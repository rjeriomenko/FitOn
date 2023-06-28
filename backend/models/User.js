const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GoalSchema = require('./Goal');

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    currentGoal: {
        type: GoalSchema,
        required: false
    },
    imgUrl: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});


module.exports = UserSchema;
mongoose.model('User', UserSchema);