const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Goal = mongoose.model('Goal');
const { requireUser } = require('../../config/passport'); //needed? probs not?


// ALL FEED ITEMS (get)
router.get('/', requireUser, async (req, res, next) => {
    try {
        const users = await User.find(); // apparently retrieves all users?
        const feedItems = [];

        users.forEach(user => {
            user.goals.forEach(goal => {
                feedItems.push(goal); //where goal completed = false? where goal = new? when completed = true? could be a bit complex
                goal.exerciseEntries.forEach(entry => {
                    feedItems.push(entry);
                })
            });
        });

        return res.json(feedItems);
    } catch (err) {
        next(err);
    }
});

//catch all - every goal, every entry, every thing that we might want in feed
// - 1 route that does this, and 1 route to get things specifically
// route for every goal in past 24, every entry in past 24, every goal completed, etc etc.