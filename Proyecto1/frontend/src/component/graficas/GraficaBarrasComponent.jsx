import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

export default function GraficaBarrasComponent({ data }) {
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
      <BarChart data={formattedData}>
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Legend />
        {keysNum.map((key, idx) => (
          <Bar key={key} dataKey={key} fill="#007acc" />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
