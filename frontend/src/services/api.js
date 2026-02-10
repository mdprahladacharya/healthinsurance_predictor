import axios from "axios";

const API = "http://127.0.0.1:8000";

export const predictCost = async (data) => {
  const res = await axios.post(`${API}/predict`, data);
  return res.data;
};
