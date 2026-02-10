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
    const res = await axios.post("http://127.0.0.1:8000/predict", form);
    setResult(res.data.predicted_cost);
  };

  return (
    <div>
      <h2>Enter Details</h2>

      <input name="age" placeholder="Age" onChange={handleChange} />
      <input name="bmi" placeholder="BMI" onChange={handleChange} />
      <input name="children" placeholder="Children" onChange={handleChange} />

      <select name="sex" onChange={handleChange}>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <select name="smoker" onChange={handleChange}>
        <option value="no">No</option>
        <option value="yes">Yes</option>
      </select>

      <select name="region" onChange={handleChange}>
        <option value="northwest">Northwest</option>
        <option value="northeast">Northeast</option>
        <option value="southwest">Southwest</option>
        <option value="southeast">Southeast</option>
      </select>

      <button onClick={handlePredict}>Predict</button>

      {result && <h2>Predicted Cost: {result}</h2>}
    </div>
  );
}

export default PredictForm;
