const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ExerciseSchema = require('./exercise');

const RoutineSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    exercises: [
        {
            type: ExerciseSchema,
            required: true
        }
    ]
})


module.exports = mongoose.model('Routine', RoutineSchema);