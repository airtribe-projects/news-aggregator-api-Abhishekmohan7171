const express = require('express');
require("dotenv").config()
const router = express.Router();
const User = require("../models/users");
const axios = require('axios');
const {validateJwt} = require('../middleware/validateJwt');

//fetch all news as per user preferences
router.get('/',validateJwt,async (req,res) => {
    if (!req.user) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const id = req.user.id;
        const dbUser = await User.findById(id);
        const preferences = dbUser.preferences;
        if (!preferences || preferences.length === 0) {
            return res.status(400).send({ message: 'No preferences provided' });
        }

        const queries = preferences.join(' OR ');
        const response = await axios.get(
            `https://newsapi.org/v2/everything?q=${queries}&apiKey=f5a174fd19e140af8a08fe1ae3cca9b4`
        );
        res.send({ news: response.data.articles });
    } catch (err) {
        console.error('Error fetching news:', err);
        if (err.response) {
            res.status(err.response.status).send({ message: err.response.data.message });
        } else {
            res.status(500).send({ message: 'Error fetching data' });
        }
    }

})

//news search functionality
router.get('/search/:keyword',validateJwt, async (req, res) => {
    if (!req.user) {
        return res.status(401).send({ message: 'Unauthorized' });
    }
    try {
        const keyword = req.params.keyword;
        const response = await axios.get(
            `https://newsapi.org/v2/everything?q=${keyword}&apiKey=f5a174fd19e140af8a08fe1ae3cca9b4`
        );

        res.send({ news: response.data.articles });
    } catch (err) {
        console.error('Error searching news:', err);
        if (err.response) {
            res.status(err.response.status).send({ message: err.response.data.message });
        } else {
            res.status(500).send({ message: 'Error fetching data' });
        }
    }
});

// Mark a news article as read
router.post('/:id/read',validateJwt, async (req, res) => {
    try {
        const articleId = req.params.id;
        // Add the article ID to the user's read list
        await User.updateOne({ _id: req.user._id }, { $addToSet: { readArticles: articleId } });
        res.send({ message: 'Article marked as read' });
    } catch (err) {
        console.error('Error marking article as read:', err);
        res.status(500).send({ message: 'Error marking article as read' });
    }
});

// Mark a news article as favorite
router.post('/:id/favorite',validateJwt, async (req, res) => {
    try {
        const articleId = req.params.id;
        // Add the article ID to the user's favorite list
        await User.updateOne({ _id: req.user._id }, { $addToSet: { favoriteArticles: articleId } });
        res.send({ message: 'Article marked as favorite' });
    } catch (err) {
        console.error('Error marking article as favorite:', err);
        res.status(500).send({ message: 'Error marking article as favorite' });
    }
});

// Retrieve all read news articles
router.get('/read',validateJwt, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('readArticles');
        res.send({ readArticles: user.readArticles });
    } catch (err) {
        console.error('Error retrieving read articles:', err);
        res.status(500).send({ message: 'Error retrieving read articles' });
    }
});

// Retrieve all favorite news articles
router.get('/favorites',validateJwt, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('favoriteArticles');
        res.send({ favoriteArticles: user.favoriteArticles });
    } catch (err) {
        console.error('Error retrieving favorite articles:', err);
        res.status(500).send({ message: 'Error retrieving favorite articles' });
    }
});



module.exports = router;