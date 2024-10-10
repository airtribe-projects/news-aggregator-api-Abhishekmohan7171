require("dotenv").config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Error connecting to MongoDB', err.message);
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;