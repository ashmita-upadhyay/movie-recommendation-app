import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [movies, setMovies] = useState([]);  
  const [loading, setLoading] = useState(false);

  const getRecommendations = async () => {
    if (!input) return alert("Enter movie preference");

    setLoading(true);
    setMovies([]); 

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: input }),
      });

      const data = await res.json();

    
      if (data.recommendations) {
        setMovies(data.recommendations);
      }
    } catch (err) {
      alert("Backend not responding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h2>🎬 Movie Recommendation App</h2>

      <input
        type="text"
        placeholder="e.g. action movies with female lead"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "320px", padding: "8px" }}
      />

      <br /><br />

      <button onClick={getRecommendations} disabled={loading}>
        {loading ? "Loading..." : "Get Recommendations"}
      </button>

      {movies.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Recommended Movies:</h3>
          <ul>
            {movies.map((movie, index) => (
              <li key={index}>{movie}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;