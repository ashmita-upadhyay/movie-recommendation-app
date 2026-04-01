import { useState } from "react";
import "./App.css";

function App() {
  const [preference, setPreference] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMovies = async () => {
    if (!preference.trim()) {
      setError("Please enter your movie preference");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://your-backend.onrender.com/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userInput: preference })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMovies(data.recommendations);
    } catch (err) {
      setError("Backend not responding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>🎬 Movie Recommendation App</h1>

      <input
        type="text"
        placeholder="e.g. action movies with strong female lead"
        value={preference}
        onChange={(e) => setPreference(e.target.value)}
      />

      <button onClick={fetchMovies}>
        {loading ? "Finding..." : "Get Recommendations"}
      </button>

      {error && <p className="error">{error}</p>}

      <ul>
        {movies.map((movie, index) => (
          <li key={index}>{movie}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
