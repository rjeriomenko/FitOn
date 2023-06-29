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

        req.user.currentGoal = goal;
        await req.user.save();

        goal = await goal.populate('user', '_id username imgUrl createdAt');
        return res.json(goal);
    }
    catch (err) {
        next(err);
    }
});

// view a specific goal (GET)
router.get('/:goalId', requireUser, async (req, res, next) => {
    try {
        const goal = await Goal.findById(req.params.goalId)
            .populate('user', '_id username imgUrl createdAt');
        if (!goal) {
            const error = new Error('Goal not found');
            error.statusCode = 404;
            throw error;
        }
        return res.json(goal);
    } catch (err) {
        next(err);
    }
});

// edit a goal (patch)
router.patch('/:goalId', requireUser, validateGoalInput, async (req, res, next) => {
    try {
        let goal = await Goal.findById(req.params.goalId);
        if (!goal) {
            const error = new Error('Goal not found');
            error.statusCode = 404;
            throw error;
        } else if (req.user._id.toString() !== goal.user.toString()) {
            const error = new Error('Cannot edit this goal');
            error.statusCode = 403;
            throw error;
        }

        goal.title = req.body.title || goal.title
        goal.description = req.body.description || goal.description;
        goal.deadline = req.body.deadline || goal.deadline;
        goal.completionDate = req.body.completionDate || goal.completionDate;

        await goal.save();

        if (goal._id === req.user.currentGoal._id) {
            req.user.currentGoal = goal;
        }
        await req.user.save();

        goal = await goal.populate('user', '_id username imgUrl createdAt');

        return res.json(goal);
    } catch (err) {
        next(err);
    }
});

// delete a goal (delete)
router.delete('/:goalId', requireUser, async (req, res, next) => {
    try {
        const goal = await Goal.findById(req.params.goalId);
        if (!goal) {
            const error = new Error('Goal not found');
            error.statusCode = 404;
            throw error;
        }

        if (goal.user.toString() !== req.user._id.toString()) {
            const error = new Error('You have no power here, Gandalf the Grey');
            error.statusCode = 403;
            throw error;
        }

        await goal.deleteOne();

        if (req.user.currentGoal && req.user.currentGoal._id.toString() === goal._id.toString()) {
            req.user.currentGoal = null;
            await req.user.save();
        }

        return res.json({ message: 'Goal successfully deleted' });
    } catch (err) {
        next(err);
    }
});

// fetch all goals per user
router.get('/all/:userId', requireUser, async (req, res, next) => {
    try {
        const goals = await Goal.find({ user: req.params.userId })
            .populate('user', '_id username imgUrl createdAt');

        const goalsObj = {};
        goals.forEach(goal => goalsObj[goal._id] = goal);

        return res.json(goalsObj);
    } catch (err) {
        next(err);
    }
});



module.exports = router;