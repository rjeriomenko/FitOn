const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ExerciseSchema = require('./Exercise');

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


module.exports = RoutineSchema;
mongoose.model('Routine', RoutineSchema);