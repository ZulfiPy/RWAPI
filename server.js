require('dotenv').config()
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const mongoose = require('mongoose');
const connectToDB = require('./config/dbConnect');
const cookiesParser = require('cookie-parser')
const verifyJWT = require('./middleware/verifyJWT');

// run database connection config
connectToDB();

app.get('/', (req, res) => {
    res.send('hello world');
});

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware for parsing cookies
app.use(cookiesParser());

// routes
app.use('/register', require('./routes/registerEmployee'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

// verify JWT before making request to the API
app.use(verifyJWT)
app.use('/api/employees', require('./routes/api/employees'));
app.use('/api/customers', require('./routes/api/customers'));

// connect to db and run the server on port 3500
mongoose.connection.once('open', () => {
    console.log('connected to db');
    app.listen(PORT, () => console.log(`listening on port ${PORT}`));
});