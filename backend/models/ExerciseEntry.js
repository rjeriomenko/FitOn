const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ExerciseSchema = require('./Exercise')

const ExerciseEntrySchema = new Schema({
    exercises: [
        {
            type: ExerciseSchema,
            required: false // this is false for testing purposes until we get exercises ready
        }
    ],
    date: {
        type: String,
        required: true,
    },
    note: {
        type: String,
        required: false
    },
    rating: {
        type: Number,
        required: true
    }
})

module.exports = ExerciseEntrySchema;
mongoose.model('ExerciseEntry', ExerciseEntrySchema);