const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Follow = mongoose.model('Follow');
const { requireUser } = require('../../config/passport');

// create a follow (POST)
router.post('/:followedUserId', requireUser, async (req, res, next) => {
    try {
        const newFollow = new Follow({
            follower: req.user._id,
            followedUser: req.params.followedUserId
        })
        
        const existingFollow = await Follow.findOne({
            follower: req.user._id,
            followedUser: req.params.followedUserId
        });
    
        if (existingFollow) {
            return res.status(400).json({ message: 'You are already following this user.' });
        }
        
        let follow = await newFollow.save();

        follow = await follow.populate('follower', '_id username');
        follow = await follow.populate('followedUser', '_id username');
        
        return res.json({ [follow._id]: follow} );
    }
    catch (err) {
        next(err);
    }
});

// delete a follow (DELETE)
router.delete('/:followId', requireUser, async (req, res, next) => {
    try {
        const follow = await Follow.findById(req.params.followId);
        if (!follow) {
            const error = new Error('Follow not found');
            error.statusCode = 404;
            throw error;
        }

        await follow.deleteOne();

        return res.json({ message: 'Successfully unfollowed' });
    } 
    catch (err) {
        next(err);
    }
});

// get a user's follows (GET)
router.get('/:followerId', requireUser, async (req, res, next) => {
    try {
        const follows = await Follow.find({ follower: req.user._id })

        // if (follows) {
        //     return res.json({ message: follows })
        // }

        const followsObj = {};
        follows.forEach(follow => followsObj[follow._id] = follow);

        return res.json(followsObj);
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;