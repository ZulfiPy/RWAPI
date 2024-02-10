require('dotenv').config()
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const mongoose = require('mongoose');
const connectToDB = require('./config/dbConnect');

// run database connection config
connectToDB();

app.get('/', (req, res) => {
    res.send('hello world');
});

// connect to db and run the server on port 3500
mongoose.connection.once('open', () => {
    console.log('connected to db');
    app.listen(PORT, () => console.log(`listening on port ${PORT}`));
});