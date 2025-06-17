import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const COLORS = ["#007acc", "#00C49F", "#FFBB28", "#FF8042", "#aa00ff"];

export default function GraficaAreaComponent({ data }) {
  const formattedData = data.map((item) => {
    let label = item._id;
    if (typeof label === "object") label = Object.values(label).join(" - ");
    return { ...item, label: label?.toString() || "" };
  });

  const keysNum = Object.keys(formattedData[0]).filter(
    (k) => k !== "_id" && k !== "label" && typeof formattedData[0][k] === "number"
  );

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={formattedData}>
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Legend />
        {keysNum.map((key, idx) => (
          <Area key={key} type="monotone" dataKey={key} stroke={COLORS[idx % COLORS.length]} fill={COLORS[idx % COLORS.length]} />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
