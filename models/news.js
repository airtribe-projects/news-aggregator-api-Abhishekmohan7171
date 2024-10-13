const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    source: {
        id: { type: String, default: null },
        name: { type: String, required: true }
    },
    author: { type: String, default: null },
    title: { type: String, required: true },
    description: { type: String, default: null },
    url: { type: String, required: true },
    urlToImage: { type: String, default: null },
    publishedAt: { type: Date, required: true },
    content: { type: String, default: null },
    read: { type: Boolean, default: false },
    favourite: { type: Boolean, default: false }
});

const News = mongoose.model('News',newsSchema);
module.exports = News;