/**
 * N часов / N времён: запирание урны и объём конуса S² × S^{N-1}.
 * Бесконечное N внутри той же меры не выигрывает.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

function logGamma(z) {
  const p = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (z < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * z)) - logGamma(1 - z);
  }
  z -= 1;
  let x = p[0];
  for (let i = 1; i < p.length; i++) x += p[i] / (z + i);
  const t = z + p.length - 1.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

function sphereArea(n) {
  const a = (n + 1) / 2;
  return (2 * Math.PI ** a) / Math.exp(logGamma(a));
}

function bartiniM(n) {
  const a = (n + 1) / 2;
  return Math.exp(logGamma(a)) / (2 * Math.PI ** a);
}

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

function runUrn(N, theta, steps, n0, seed) {
  const rng = new RNG(seed);
  const n = Array(N).fill(n0);
  const ticks = Array(N).fill(0);
  let lockStep = steps;
  for (let s = 0; s < steps; s++) {
    const w = n.map((x) => x ** theta);
    const z = w.reduce((a, b) => a + b, 0);
    const p = w.map((x) => x / z);
    const a = rng.choice(p);
    n[a] += 1;
    ticks[a] += 1;
    const mx = Math.max(...p);
    if (mx >= 0.95 && lockStep === steps) lockStep = s;
  }
  const tot = ticks.reduce((a, b) => a + b, 0);
  const p = ticks.map((t) => t / tot);
  const ipr = 1 / p.reduce((s, x) => s + x * x, 0);
  const winnerShare = Math.max(...p);
  return { lockStep, dT: ipr, winnerShare };
}

function ensembleUrn(N, theta, steps, n0, runs, seed0) {
  const xs = [];
  for (let i = 0; i < runs; i++) xs.push(runUrn(N, theta, steps, n0, seed0 + i * 17));
  const mean = (k) => xs.reduce((s, r) => s + r[k], 0) / xs.length;
  return {
    N,
    lock_frac: xs.filter((r) => r.lockStep < steps).length / xs.length,
    lock_median: [...xs.map((r) => r.lockStep)].sort((a, b) => a - b)[Math.floor(xs.length / 2)],
    dT_mean: mean("dT"),
    winner_share_mean: mean("winnerShare"),
  };
}

function cone3plusN(Ntime) {
  if (Ntime < 1) return { Ntime, vol: 0 };
  const vol = sphereArea(2) * sphereArea(Ntime - 1);
  const totalDim = 3 + Ntime;
  return {
    Ntime,
    totalDim,
    vol,
    m_total: bartiniM(totalDim),
  };
}

const Ns = [2, 3, 4, 5, 6, 7, 8, 10, 16, 32];
const urns = Ns.map((N) => ensembleUrn(N, 2, 4000, 3, 24, 50 + N));
const cones = [];
for (let N = 1; N <= 16; N++) cones.push(cone3plusN(N));
const mOfN = [];
for (let n = 3; n <= 24; n++) mOfN.push({ n, m: bartiniM(n), area: sphereArea(n) });

const bestCone = cones.reduce((a, b) => (a.vol > b.vol ? a : b));
const bestM = mOfN.reduce((a, b) => (a.m < b.m ? a : b));

const out = {
  urn_theta2_n0_3: urns,
  cone_3_plus_N: cones,
  bartini_m_of_total_n: mOfN,
  max_cone_at_Ntime: bestCone.Ntime,
  max_cone_vol: bestCone.vol,
  min_m_at_n: bestM.n,
  note_infinity: "Area(S^k)→0 при k→∞; m(n)→∞. Бесконечное число времён проигрывает и конусу, и m(n).",
};

const here = dirname(fileURLToPath(import.meta.url));
const path = join(here, "..", "results", "n_times.json");
mkdirSync(dirname(path), { recursive: true });
writeFileSync(path, JSON.stringify(out, null, 2));
console.log("urns", JSON.stringify(urns, null, 2));
console.log("best cone N_time", bestCone.Ntime, "vol", bestCone.vol);
console.log("min m at n", bestM.n);
console.log("cone N=3", cones[2], "N=16", cones[15]);
console.log("wrote", path);
