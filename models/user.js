const mongoose = require('mongoose');
const passpostLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique:true
    }

});

UserSchema.plugin(passpostLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

