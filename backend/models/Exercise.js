const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
    sets: {
        type: Number,
        required: function() {
            return (!(this.reps || this.time) || !!(this.reps)) 
        },
        max: 1000000
    },
    reps: {
        type: Number,
        required: function () {
            return (!(this.sets || this.time) || !!(this.sets))
        },
        max: 1000000
    },
    time: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    goal: {
        type: Schema.Types.ObjectId,
        ref: 'Goal'
    },
    workout: {
        type: Schema.Types.ObjectId,
        ref: 'ExerciseEntry'
    }
}, {
    timestamps: true
})

module.exports = ExerciseSchema;
mongoose.model('Exercise', ExerciseSchema);