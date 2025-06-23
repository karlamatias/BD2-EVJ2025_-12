import { useEffect, useState } from "react";

function App() {
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState("");

  const fetchReviews = async () => {
    const res = await fetch("http://localhost:3001/api/reviews");
    const data = await res.json();
    setReviews(data);
  };

  const submitReview = async () => {
    await fetch("http://localhost:3001/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    setText("");
    fetchReviews();
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div>
      <h1>Video Game Reviews</h1>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={submitReview}>Submit</button>
      <ul>
        {reviews.map((r, i) => (
          <li key={i}>{r.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
