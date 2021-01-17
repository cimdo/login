const { Schema, model } = require('mongoose');


const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    token: String,
    active: Boolean,
    username: String,
}, {
    strict: false
});

const User = model('User', userSchema, 'users');

module.exports = User;