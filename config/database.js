const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connection success')
    } catch (err) {
        console.error('Error in DB connection:', err);
        process.exit(1);
    }
};

module.exports = connectDB;