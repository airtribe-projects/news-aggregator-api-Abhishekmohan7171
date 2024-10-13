require("dotenv").config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const userRouter = require('./routes/users');
const prefRouter = require('./routes/preferences');
const newsRouter = require('./routes/news');

// Connect to MongoDB
mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Error connecting to MongoDB', err.message);
})

const logger = (req,res,next) => {
    console.log(`${req.method} Request recieved on ${req.url}`);
    next()
}

app.use(logger)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/users', userRouter);
app.use('/api/v1/preferences', prefRouter);
app.use('/api/v1/news', newsRouter);

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;