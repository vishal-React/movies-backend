const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// ✅ Dynamic route for both movies and tv (e.g., /api/movies/popular or /api/tv/top_rated)
app.get("/api/:category/:type", async (req, res) => {
  const { category, type } = req.params;

  // Validate category and type
  const validCategories = ["movie", "tv"];
  const validTypes = ["popular", "upcoming", "top_rated", "on_the_air"];

  if (!validCategories.includes(category) || !validTypes.includes(type)) {
    return res.status(400).json({ error: "Invalid category or type" });
  }

  try {
    const response = await axios.get(`${TMDB_BASE_URL}/${category}/${type}`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        language: "en-US",
        page: req.query.page || 1,
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error("TMDB API Error:", err.message);
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    }
    res.status(500).json({ error: "Failed to fetch data from TMDB" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
