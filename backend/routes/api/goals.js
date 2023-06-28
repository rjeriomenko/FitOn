const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Goal = mongoose.model('Goal');
const validateGoalInput = require("../../validations/goals");
const { requireUser } = require('../../config/passport');


// create a goal (POST)
router.post('/', requireUser, validateGoalInput, async (req, res, next) => {
    try {
        const newGoal = new Goal({
            title: req.body.title,
            description: req.body.description,
            deadline: req.body.deadline,
            completionDate: req.body.completionDate,
            user: req.user._id
        });

        let goal = await newGoal.save();
        goal = await goal.populate('user', '_id username imgUrl createdAt');
        return res.json(goal);
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;