const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ExerciseSchema = require('./Exercise')

const ExerciseEntrySchema = new Schema({
    exercises: [
        {
            type: ExerciseSchema,
            required: true
        }
    ],
    date: {
        type: String,
        required: true,
    },
    note: {
        type: String,
        required: false
    }
})

module.exports = ExerciseEntrySchema;
mongoose.model('ExerciseEntry', ExerciseEntrySchema);