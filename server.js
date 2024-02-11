require('dotenv').config()
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const mongoose = require('mongoose');
const connectToDB = require('./config/dbConnect');
const cookiesParser = require('cookie-parser')

// run database connection config
connectToDB();

app.get('/', (req, res) => {
    res.send('hello world');
});

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cookiesParser());

app.use('/register', require('./routes/registerEmployee'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use('/api/employees', require('./routes/api/employees'));

// connect to db and run the server on port 3500
mongoose.connection.once('open', () => {
    console.log('connected to db');
    app.listen(PORT, () => console.log(`listening on port ${PORT}`));
});