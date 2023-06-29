const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//'Workout'
const ExerciseEntrySchema = new Schema({
    date: {
        type: String,
        required: true,
    },
    note: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    imgUrl: {
        type: String,
        required: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    goal: {
        type: Schema.Types.ObjectId,
        ref: 'Goal'
    }
}, {
    timestamps: true
});

module.exports = ExerciseEntrySchema;
mongoose.model('ExerciseEntry', ExerciseEntrySchema);