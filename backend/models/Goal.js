const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ExerciseEntrySchema = require('./ExerciseEntry');

const GoalSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    deadline: {
        type: String,
        required: true
    },
    exerciseEntries: [
        {
            type: ExerciseEntrySchema,
            required: false
        }
    ]
})

module.exports = mongoose.model('Goal', GoalSchema);