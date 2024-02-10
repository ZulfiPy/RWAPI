const mongoose = require('mongoose');

const mongooseConnect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
    } catch (err) {
        console.log('error');
    }
}

module.exports = mongooseConnect;