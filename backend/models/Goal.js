const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GoalSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    deadline: {
        type: String,
        required: true
    },
    completionDate: {
        type: String,
        required: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    imgUrl: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

module.exports = GoalSchema;
mongoose.model('Goal', GoalSchema);