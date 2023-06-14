const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ExerciseEntrySchema = require('./ExerciseEntry');

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
    exerciseEntries: [
        {
            type: ExerciseEntrySchema,
            required: false
        }
    ],
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = GoalSchema;
mongoose.model('Goal', GoalSchema);