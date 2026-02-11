import { useState } from "react";
import axios from "axios";

function PredictForm() {
  const [form, setForm] = useState({
    age: "",
    bmi: "",
    children: "",
    sex: "male",
    smoker: "no",
    region: "northwest"
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePredict = async () => {
    if (!form.age || !form.bmi || !form.children) {
      alert("Fill all fields");
      return;
    }

    const res = await axios.post("http://127.0.0.1:8000/predict", form);
    setResult(res.data.predicted_cost);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
      
      <div className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-[400px] text-white">
        
        <h1 className="text-3xl font-bold mb-6 text-center">
          💊 Insurance Predictor
        </h1>

        <input className="w-full p-2 mb-3 rounded text-black"
          name="age" placeholder="Age" onChange={handleChange}/>

        <input className="w-full p-2 mb-3 rounded text-black"
          name="bmi" placeholder="BMI" onChange={handleChange}/>

        <input className="w-full p-2 mb-3 rounded text-black"
          name="children" placeholder="Children" onChange={handleChange}/>

        <select className="w-full p-2 mb-3 rounded text-black" name="sex" onChange={handleChange}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <select className="w-full p-2 mb-3 rounded text-black" name="smoker" onChange={handleChange}>
          <option value="no">Non-Smoker</option>
          <option value="yes">Smoker</option>
        </select>

        <select className="w-full p-2 mb-3 rounded text-black" name="region" onChange={handleChange}>
          <option value="northwest">Northwest</option>
          <option value="northeast">Northeast</option>
          <option value="southwest">Southwest</option>
          <option value="southeast">Southeast</option>
        </select>

        <button
          onClick={handlePredict}
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg mt-2"
        >
          Predict Cost
        </button>

        {result && (
          <div className="mt-5 bg-white/30 p-4 rounded-lg text-center">
            <h3>Estimated Cost</h3>
            <h2 className="text-2xl font-bold">₹ {result}</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default PredictForm;
