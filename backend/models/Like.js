const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
    liker: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    likedGoal: {
        type: Schema.Types.ObjectId,
        ref: 'Goal'
    },
    likedEntry: {
        type: Schema.Types.ObjectId,
        ref: 'ExerciseEntry'
    },
}, {
    timestamps: true
});


module.exports = LikeSchema;
mongoose.model('Like', LikeSchema);