const express = require("express");
require("dotenv").config();
const router = express.Router();
const User = require("../models/users");
const News = require("../models/news")
const axios = require("axios");
const { validateJwt } = require("../middleware/validateJwt");
const NodeCache = require('node-cache');
const newsCache = new NodeCache({ stdTTL: 3600 });

//fetch all news as per user preferences
router.get("/", validateJwt, async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  try {
    const id = req.user.id;
    const dbUser = await User.findById(id);
    const preferences = dbUser.preferences;
    if (!preferences || preferences.length === 0) {
      return res.status(400).send({ message: "No preferences provided" });
    }
    const queries = preferences.join(" OR ");
    // Check cache in NodeCache
    const cachedNews = newsCache.get(queries);
    if (cachedNews) {
        console.log("from cache >>>>>>>>>>>>>>>>>")
        return res.send({ news: cachedNews });
    }
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${queries}&apiKey=f5a174fd19e140af8a08fe1ae3cca9b4`
    );
    // Store in cache
    newsCache.set(queries, response.data.articles);
    //Adding the news in DB
    const dbNews = await News.create(response.data.articles);
    res.send({ news: dbNews});
  } catch (err) {
    console.error("Error fetching news:", err);
    if (err.response) {
      res
        .status(err.response.status)
        .send({ message: err.response.data.message });
    } else {
      res.status(500).send({ message: "Error fetching data" });
    }
  }
});

//news search functionality
router.get("/search/:keyword", validateJwt, async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  try {
    const keyword = req.params.keyword;
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${keyword}&apiKey=f5a174fd19e140af8a08fe1ae3cca9b4`
    );

    res.send({ news: response.data.articles });
  } catch (err) {
    console.error("Error searching news:", err);
    if (err.response) {
      res
        .status(err.response.status)
        .send({ message: err.response.data.message });
    } else {
      res.status(500).send({ message: "Error fetching data" });
    }
  }
});

// Mark a news article as read
router.post('/:id/read',validateJwt, async (req, res) => {
    if (!req.user) {
        return res.status(401).send({ message: "Unauthorized" });
      }
    try {
        const articleId = req.params.id;
        // Add the article ID to the user's read list
        await News.findByIdAndUpdate(articleId,{read:true});
        res.send({ message: 'Article marked as read' });
    } catch (err) {
        console.error('Error marking article as read:', err);
        res.status(500).send({ message: 'Error marking article as read' });
    }
});

// // Mark a news article as favorite
router.post('/:id/favourite',validateJwt, async (req, res) => {
    if (!req.user) {
        return res.status(401).send({ message: "Unauthorized" });
      }
    try {
        const articleId = req.params.id;
        // Add the article ID to the user's read list
        await News.findByIdAndUpdate(articleId,{favourite:true});
        res.send({ message: 'Article marked as favourite' });
    } catch (err) {
        console.error('Error marking article as favourite:', err);
        res.status(500).send({ message: 'Error marking article as Favourite' });
    }
});

// Retrieve all read news articles
router.get('/read',validateJwt, async (req, res) => {
    if (!req.user) {
        return res.status(401).send({ message: "Unauthorized" });
      }
    try {
        const read = await News.find({read: true});
        res.send({ readArticles: read});
    } catch (err) {
        console.error('Error retrieving read articles:', err);
        res.status(500).send({ message: 'Error retrieving read articles' });
    }
});

// // Retrieve all favorite news articles
router.get('/favourites',validateJwt, async (req, res) => {
    if (!req.user) {
        return res.status(401).send({ message: "Unauthorized" });
      }
    try {
        const read = await News.find({read: true});
        res.send({ readArticles: read});
    } catch (err) {
        console.error('Error retrieving read articles:', err);
        res.status(500).send({ message: 'Error retrieving favourite articles' });
    }
});

module.exports = router;
