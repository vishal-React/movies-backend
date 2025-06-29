const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// ✅ Videos (e.g. /movie/123/videos)
app.get("/api/:category/:id/videos", async (req, res) => {
  const { category, id } = req.params;
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/${category}/${id}/videos`,
      {
        params: { api_key: process.env.TMDB_API_KEY },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

// ✅ Credits (e.g. /movie/123/credits)
app.get("/api/:category/:id/credits", async (req, res) => {
  const { category, id } = req.params;
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/${category}/${id}/credits`,
      {
        params: { api_key: process.env.TMDB_API_KEY },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch credits" });
  }
});

// ✅ Similar (e.g. /movie/123/similar)
app.get("/api/:category/:id/similar", async (req, res) => {
  const { category, id } = req.params;
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/${category}/${id}/similar`,
      {
        params: { api_key: process.env.TMDB_API_KEY },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch similar movies" });
  }
});

// ✅ Detail route (e.g. /movie/123)
app.get("/api/:category/:id", async (req, res) => {
  const { category, id } = req.params;
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/${category}/${id}`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        language: "en-US",
      },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch detail" });
  }
});

// ✅ Search (e.g. /search/movie?query=batman)
app.get("/api/search/:category", async (req, res) => {
  const { category } = req.params;
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query param is required" });
  }

  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/${category}`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        query,
        language: "en-US",
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error("TMDB Search Error:", err.message);
    res.status(500).json({ error: "Failed to search" });
  }
});

// ✅ Category List (e.g. /movie/popular)
app.get("/api/:category/:type", async (req, res) => {
  const { category, type } = req.params;
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
    res.status(500).json({ error: "Failed to fetch data from TMDB" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
