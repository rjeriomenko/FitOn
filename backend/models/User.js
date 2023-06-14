const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GoalSchema = require('./Goal');
const RoutineSchema = require('./Routine');

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
    goals: [
        {
            type: GoalSchema,
            required: false
        }
    ],
    routines: [
        {
            type: RoutineSchema,
            required: false
        }
    ]
}, {
    timestamps: true
});


module.exports = UserSchema;
mongoose.model('User', UserSchema);