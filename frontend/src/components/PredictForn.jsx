import { useState } from "react";
import axios from "axios";
import CostChart from "./costChart";

function SliderField({ label, name, min, max, step = 1, value, onChange, format }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-white/80">{label}</span>
        <span className="text-sm font-bold bg-white/20 px-2 py-0.5 rounded-full">
          {format ? format(value) : value}
        </span>
      </div>
      <div className="relative h-2 bg-white/20 rounded-full">
        <div
          className="absolute h-2 bg-sky-400 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range" min={min} max={max} step={step}
          name={name} value={value} onChange={onChange}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-sky-400 transition-all pointer-events-none"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-white/80 mb-1">{label}</label>
      <div className="relative">
        <select
          name={name} value={value} onChange={onChange}
          className="w-full appearance-none bg-white/10 border border-white/20 text-white p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
        >
          {options.map(({ value: v, label: l }) => (
            <option key={v} value={v} className="text-gray-900 bg-white">{l}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60">▾</div>
      </div>
    </div>
  );
}

const REGION_FLAGS = { northwest: "🌲", northeast: "🏙️", southwest: "🌵", southeast: "🌊" };

function PredictForm() {
  const [form, setForm] = useState({
    age: 30, bmi: 25, children: 0,
    sex: "male", smoker: "no", region: "northwest",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    const updated = {
      ...form,
      [name]: ["age", "bmi", "children"].includes(name) ? Number(value) : value,
    };
    setForm(updated);
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("http://127.0.0.1:8000/predict", updated);
      setResult(res.data.predicted_cost);
    } catch {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const riskLevel = result
    ? result < 8000
      ? { label: "Low Risk", color: "text-green-300", bg: "bg-green-500/20", bar: "bg-green-400", pct: 20 }
      : result < 20000
      ? { label: "Moderate Risk", color: "text-yellow-300", bg: "bg-yellow-500/20", bar: "bg-yellow-400", pct: 55 }
      : { label: "High Risk", color: "text-red-300", bg: "bg-red-500/20", bar: "bg-red-400", pct: 90 }
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full text-white/70 text-sm mb-4 border border-white/10">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            AI-Powered Estimation
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">💊 Insurance Cost Predictor</h1>
          <p className="text-white/50 text-sm">Adjust the sliders to get a real-time estimate</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ── Form Panel ── */}
          <div className="lg:col-span-3 bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
            <h2 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
              <span className="w-6 h-6 bg-sky-400/20 rounded-lg flex items-center justify-center text-sky-300 text-xs">✦</span>
              Your Profile
            </h2>

            <SliderField label="Age" name="age" min={18} max={70} value={form.age} onChange={handleChange} format={v => `${v} yrs`} />
            <SliderField label="BMI" name="bmi" min={15} max={50} step={0.1} value={form.bmi} onChange={handleChange} format={v => parseFloat(v).toFixed(1)} />
            <SliderField label="Children" name="children" min={0} max={5} value={form.children} onChange={handleChange} format={v => v == 1 ? "1 child" : `${v} children`} />

            <div className="grid grid-cols-2 gap-3">
              <SelectField label="Biological Sex" name="sex" value={form.sex} onChange={handleChange}
                options={[{ value: "male", label: "♂ Male" }, { value: "female", label: "♀ Female" }]} />
              <SelectField label="Smoking Status" name="smoker" value={form.smoker} onChange={handleChange}
                options={[{ value: "no", label: "🚭 Non-Smoker" }, { value: "yes", label: "🚬 Smoker" }]} />
            </div>

            <div className="mt-1">
              <label className="block text-sm font-medium text-white/80 mb-2">Region</label>
              <div className="grid grid-cols-2 gap-2">
                {["northwest", "northeast", "southwest", "southeast"].map((r) => (
                  <button key={r}
                    onClick={() => handleChange({ target: { name: "region", value: r } })}
                    className={`p-2.5 rounded-xl text-sm font-medium transition-all border capitalize flex items-center gap-2 ${
                      form.region === r
                        ? "bg-sky-400/30 border-sky-400 text-white"
                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    <span>{REGION_FLAGS[r]}</span> {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Results Panel ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Cost card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl flex-1 flex flex-col justify-center">
              <p className="text-white/60 text-sm font-medium mb-1">Estimated Annual Cost</p>
              {loading ? (
                <div className="flex items-center gap-2 text-white/40 text-sm mt-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-sky-400 rounded-full animate-spin" />
                  Calculating…
                </div>
              ) : error ? (
                <p className="text-red-300 text-sm mt-2">{error}</p>
              ) : result ? (
                <>
                  <div className="text-4xl font-extrabold text-white mt-1 mb-3">
                    ${result.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className={`inline-flex items-center gap-2 ${riskLevel.bg} ${riskLevel.color} text-xs font-semibold px-3 py-1 rounded-full w-fit mb-4`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {riskLevel.label}
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 mb-1">
                    <div className={`h-1.5 rounded-full transition-all duration-700 ${riskLevel.bar}`} style={{ width: `${riskLevel.pct}%` }} />
                  </div>
                  <p className="text-white/40 text-xs">Risk score relative to population</p>
                </>
              ) : (
                <p className="text-white/40 text-sm mt-2 italic">Adjust sliders to get your estimate</p>
              )}
            </div>

            {/* Key factors */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 border border-white/20 shadow-2xl">
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">Key Factors</p>
              <div className="space-y-2">
                {[
                  { label: "Smoker", impact: form.smoker === "yes" ? "High ↑" : "Low", color: form.smoker === "yes" ? "text-red-300" : "text-green-300" },
                  { label: "BMI", impact: form.bmi > 30 ? "Elevated ↑" : "Normal", color: form.bmi > 30 ? "text-yellow-300" : "text-green-300" },
                  { label: "Age", impact: form.age > 50 ? "Senior ↑" : form.age > 35 ? "Middle" : "Young", color: form.age > 50 ? "text-orange-300" : "text-green-300" },
                ].map(({ label, impact, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-white/50 text-sm">{label}</span>
                    <span className={`text-xs font-semibold ${color}`}>{impact}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart */}
            {result && (
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 border border-white/20 shadow-2xl">
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">vs. Average</p>
                <CostChart cost={result} />
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          Predictions based on a Random Forest model trained on historical insurance data.
        </p>
      </div>
    </div>
  );
}

export default PredictForm;