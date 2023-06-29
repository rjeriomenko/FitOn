const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FollowSchema = new Schema({
    follower: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    followedUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});


module.exports = FollowSchema;
mongoose.model('Follow', FollowSchema);