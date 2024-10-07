const mongoose = require('mongoose');
const userShema = mongoose.Schema({
    username: { type: String, required: true , unique: true },
    email: { type: String, required: true , unique: true },
    password: { type: String, required: true },
    admin: { type: Boolean },
    date_inscription: {type: Date, required: true}
});
module.exports = mongoose.model('User', userShema);