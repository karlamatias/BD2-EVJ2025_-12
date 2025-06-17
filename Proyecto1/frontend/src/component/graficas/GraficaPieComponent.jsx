import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ["#007acc", "#00C49F", "#FFBB28", "#FF8042", "#aa00ff"];

export default function GraficaPieComponent({ data }) {
  const formattedData = data.map((item, idx) => {
    let label = item._id;
    if (typeof label === "object") label = Object.values(label).join(" - ");
    return {
      name: label || `Opción ${idx + 1}`,
      value: item.total || Object.values(item).find(v => typeof v === "number")
    };
  });

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Tooltip />
        <Legend />
        <Pie
          data={formattedData}
          dataKey="value"
          nameKey="name"
          outerRadius={120}
          fill="#8884d8"
          label
        >
          {formattedData.map((_, idx) => (
            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
