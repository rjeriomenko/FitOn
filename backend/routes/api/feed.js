const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
// const Goal = mongoose.model('Goal');
const { requireUser } = require('../../config/passport'); //needed? probs not?


// ALL FEED ITEMS (get)
router.get('/', requireUser, async (req, res, next) => {
    try {
        const users = await User.find(); // apparently retrieves all users?
        const feedItems = [];

        // instantiate blank object, populate an object with each unique goal's stuff, then send the array of those objects?
        // (send BOTH updated and created), date, title, description/body, user+id?
        users.forEach(user => {
            const name = user.username;
            const nameId = user.id
            user.goals.forEach(goal => {
                goal.setter = name;
                goal.setterId = nameId;
                feedItems.push(goal); //where goal completed = false? where goal = new? when completed = true? could be a bit complex
                // goal.exerciseEntries.forEach(entry => {
                //     feedItems.push(entry);
                // })

            });
        });

        return res.json(feedItems);
    } catch (err) {
        next(err);
    }
});

module.exports = router;

//catch all - every goal, every entry, every thing that we might want in feed
// - 1 route that does this, and 1 route to get things specifically
// route for every goal in past 24, every entry in past 24, every goal completed, etc etc.

// [ goal_id: {createdAt: XYZ, updatedAt: XYZ, title: XYZ, desc/body: XYZ, user: XYZ, user_id: XYZ}]
// one object where every key is a goal_id, and then the values are the rest of the info
