const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    password: String,
    name: String,
    user_type_id: Number
});

// User.methods.generateHash = (password) => {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// }

module.exports = mongoose.model('user', userSchema, 'users');