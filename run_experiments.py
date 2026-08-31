from pathlib import Path

from bartini_plus.experiments import run_all

if __name__ == "__main__":
    path = Path(__file__).resolve().parent / "results" / "bartini_plus.json"
    data = run_all(path)
    print("VERDICTS")
    for k, v in data["verdicts"].items():
        print(f"  {k}: {v}")
    print("wrote", path)
