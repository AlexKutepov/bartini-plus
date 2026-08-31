/**
 * Диагностика L0: 5 гипотез, почему Γ не ∝ k².
 * H1: огибающая A осциллирует из-за ω=c_ref (а не мгновенного c).
 * H2: leapfrog с переключением c параметрически разгоняет моду.
 * H3: фит по ln A ломается на осцилляциях.
 * H4: один взрывающийся прогон портит среднее.
 * H5: при одном часе A не константа — баг дискретизации.
 */

import { createRequire } from "node:module";

// inline copies of the same physics as experiments.mjs
const C_CLOCKS = [0.18, 0.4, 0.62];
const C_REF = C_CLOCKS.reduce((a, b) => a + b, 0) / 3;
const DX = 1.0;
const DT = 0.4;
const N_LAT = 128;

class RNG {
  constructor(seed) {
    this.s = seed >>> 0 || 1;
  }
  next() {
    this.s = (Math.imul(1664525, this.s) + 1013904223) >>> 0;
    return this.s / 4294967296;
  }
  choice(p) {
    let u = this.next();
    for (let i = 0; i < p.length; i++) {
      u -= p[i];
      if (u <= 0) return i;
    }
    return p.length - 1;
  }
}

class Wave1D {
  constructor() {
    this.n = N_LAT;
    this.phi = new Float64Array(N_LAT);
    this.pi = new Float64Array(N_LAT);
  }
  seedMode(mode, amp = 1) {
    for (let i = 0; i < this.n; i++) {
      this.phi[i] = amp * Math.sin((2 * Math.PI * mode * i) / this.n);
      this.pi[i] = 0;
    }
  }
  step(alpha) {
    const n = this.n;
    const c2 = C_CLOCKS[alpha] * C_CLOCKS[alpha];
    const invdx2 = 1 / (DX * DX);
    const lap = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      const im = (i - 1 + n) % n;
      const ip = (i + 1) % n;
      lap[i] = (this.phi[ip] - 2 * this.phi[i] + this.phi[im]) * invdx2;
    }
    for (let i = 0; i < n; i++) this.pi[i] += DT * c2 * lap[i];
    for (let i = 0; i < n; i++) this.phi[i] += DT * this.pi[i];
  }
  modeAmp(mode, cRef = C_REF) {
    const n = this.n;
    let pr = 0, pi = 0, qr = 0, qi = 0;
    for (let j = 0; j < n; j++) {
      const ang = (-2 * Math.PI * mode * j) / n;
      const c = Math.cos(ang);
      const s = Math.sin(ang);
      pr += this.phi[j] * c;
      pi += this.phi[j] * s;
      qr += this.pi[j] * c;
      qi += this.pi[j] * s;
    }
    const k = (2 * Math.PI * mode) / (n * DX);
    const omega2 = (cRef * k) ** 2;
    return Math.sqrt(pr * pr + pi * pi + (qr * qr + qi * qi) / omega2);
  }
  energy() {
    let e = 0;
    for (let i = 0; i < this.n; i++) e += this.phi[i] ** 2 + this.pi[i] ** 2;
    return e / this.n;
  }
  maxAbs() {
    let m = 0;
    for (const v of this.phi) m = Math.max(m, Math.abs(v));
    return m;
  }
}

function run(label, pickAlpha, steps, mode) {
  const wave = new Wave1D();
  wave.seedMode(mode);
  const a0 = wave.modeAmp(mode);
  const samples = [];
  for (let s = 0; s < steps; s++) {
    wave.step(pickAlpha(s));
    if (s % 50 === 0) {
      samples.push({
        s,
        A: wave.modeAmp(mode),
        E: wave.energy(),
        max: wave.maxAbs(),
      });
    }
  }
  const last = samples[samples.length - 1];
  console.log(`\n=== ${label} mode=${mode} ===`);
  console.log(
    JSON.stringify(
      {
        A0: a0,
        A_last: last.A,
        A_ratio: last.A / a0,
        E0: samples[0].E,
        E_last: last.E,
        max_last: last.max,
        A_min: Math.min(...samples.map((x) => x.A)),
        A_max: Math.max(...samples.map((x) => x.A)),
        A_samples: samples.filter((_, i) => i % 8 === 0).map((x) => +x.A.toFixed(4)),
      },
      null,
      2
    )
  );
}

const rng = new RNG(99);
const p = [1 / 3, 1 / 3, 1 / 3];

for (const mode of [2, 6, 10]) {
  run("H5 single clock 0", () => 0, 4000, mode);
  run("H1/H2 switch uniform", () => rng.choice(p), 4000, mode);
}
