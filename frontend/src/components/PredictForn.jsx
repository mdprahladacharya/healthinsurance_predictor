import { useState } from "react";
import axios from "axios";
import CostChart from "./costChart";

function PredictForm() {
  const [form, setForm] = useState({
    age: 25,
    bmi: 25,
    children: 0,
    sex: "male",
    smoker: "no",
    region: "northwest",
  });

  const [result, setResult] = useState(null);

  const handleChange = async (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);

    try {
      const res = await axios.post("http://127.0.0.1:8000/predict", updated);
      setResult(res.data.predicted_cost);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
      <div className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-[400px] text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">
          💊 Insurance Predictor
        </h1>

        {/* AGE */}
        <label>Age: {form.age}</label>
        <input
          type="range"
          min="18"
          max="70"
          name="age"
          value={form.age}
          onChange={handleChange}
          className="w-full mb-3"
        />

        {/* BMI */}
        <label>BMI: {form.bmi}</label>
        <input
          type="range"
          min="15"
          max="40"
          step="0.1"
          name="bmi"
          value={form.bmi}
          onChange={handleChange}
          className="w-full mb-3"
        />

        {/* CHILDREN */}
        <label>Children: {form.children}</label>
        <input
          type="range"
          min="0"
          max="5"
          name="children"
          value={form.children}
          onChange={handleChange}
          className="w-full mb-3"
        />

        {/* SEX */}
        <select
          name="sex"
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded text-black"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        {/* SMOKER */}
        <select
          name="smoker"
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded text-black"
        >
          <option value="no">Non-Smoker</option>
          <option value="yes">Smoker</option>
        </select>

        {/* REGION */}
        <select
          name="region"
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded text-black"
        >
          <option value="northwest">Northwest</option>
          <option value="northeast">Northeast</option>
          <option value="southwest">Southwest</option>
          <option value="southeast">Southeast</option>
        </select>

        {/* RESULT */}
        {result && (
          <div className="mt-5 bg-white/30 p-4 rounded-lg text-center">
            <h3>Estimated Cost</h3>
            <h2 className="text-2xl font-bold">₹ {result}</h2>
          </div>
        )}

        {/* CHART */}
        {result && <CostChart cost={result} />}

        <div className="mt-4 text-sm text-center">
          Change values to see live prediction.
        </div>
      </div>
    </div>
  );
}

export default PredictForm;
