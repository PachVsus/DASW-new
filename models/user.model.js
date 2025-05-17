const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    RFC: { type: String, required: true, unique: true },
    cardNumber: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);