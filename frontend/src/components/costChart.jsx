import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function CostChart({ cost }) {
  const data = [
    { name: "Your Cost", value: cost },
    { name: "Average", value: 15000 },
  ];

  return (
    <div className="mt-6 w-full h-[250px]">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <Bar dataKey="value" fill="#38bdf8" radius={[8,8,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CostChart;
