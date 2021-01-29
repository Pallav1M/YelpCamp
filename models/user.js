// See https://www.npmjs.com/package/passport-local-mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})
UserSchema.plugin(passportLocalMongoose);
// this will add username and password even if it is not added

module.exports = mongoose.model('User', UserSchema);