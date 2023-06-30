const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ExerciseEntry = mongoose.model('ExerciseEntry');
const Goal = mongoose.model('Goal');
const Follow = mongoose.model('Follow');
const User = mongoose.model('User');
const validateExerciseEntryInput = require("../../validations/exerciseEntries");
const { requireUser } = require('../../config/passport');


// create an entry (POST)
router.post('/:goalId', requireUser, validateExerciseEntryInput, async (req, res, next) => {
    try {
        const newEntry = new ExerciseEntry({
            date: req.body.date,
            note: req.body.note,
            rating: req.body.rating,
            imgUrl: req.body.imgUrl,
            user: req.user._id,
            goal: req.params.goalId
        });

        let goal = await Goal.findById(req.params.goalId);
        if (!goal) {
            const error = new Error('Goal not found');
            error.statusCode = 404;
            throw error;
        } else if (req.user._id.toString() !== goal.user.toString()) {
            const error = new Error('stay in your lane, pal');
            error.statusCode = 403;
            throw error;
        }

        let entry = await newEntry.save();
        return res.json({ [entry._id]: entry });
    }
    catch (err) {
        next(err);
    }
});


//GET followed entries
router.get('/followed', requireUser, async (req, res, next) => {
    try {
        const follows = await Follow.find({ follower: req.user._id });

        const followedUsers = await Promise.all(follows.map(async (follow) => {
            let searchId = follow.followedUser;
            const user = await User.findById(searchId);
            return user;
        }));

        const followedWorkouts = {};
        await Promise.all(followedUsers.map(async (user) => {
            const workouts = await ExerciseEntry.find({ user: user._id });
            followedWorkouts[user._id] = workouts;
        }));

        return res.json(followedWorkouts);
    } catch (err) {
        next(err);
    }
});

// sample 10 random workouts
router.get('/sample', requireUser, async (req, res, next) => {
    try {
        let workouts = await ExerciseEntry.find({});
        let randomizedWorkouts = workouts.sort(() => Math.random() - 0.5);
        let workoutsArray = randomizedWorkouts.slice(0, 9);
        let workoutsObj = {};

        workoutsArray.forEach(workout => workoutsObj[workout._id] = workout);

        return res.json(workoutsObj)
    } catch (err) {
        next(err);
    }
});

// GET by userId
router.get('/byUser/:userId', requireUser, async (req, res, next) => {
    try {
        const entries = await ExerciseEntry.find({ user: req.params.userId })
            .populate('user', '_id username imgUrl createdAt')
            .populate('goal', '_id title');

        const entriesObj = {};
        entries.forEach(entry => entriesObj[entry._id] = entry);

        return res.json(entriesObj);
    } catch (err) {
        next(err);
    }
});

// GET by goalId
router.get('/byGoal/:goalId', requireUser, async (req, res, next) => {
    try {
        const entries = await ExerciseEntry.find({ goal: req.params.goalId })
            .populate('user', '_id username imgUrl createdAt')
            .populate('goal', '_id title');

        const entriesObj = {};
        entries.forEach(entry => entriesObj[entry._id] = entry);

        return res.json(entriesObj);
    } catch (err) {
        next(err);
    }
});

// PATCH workout 
router.patch('/:entryId', requireUser, validateExerciseEntryInput, async (req, res, next) => {
    try {
        let entry = await ExerciseEntry.findById(req.params.entryId);
        if (!entry) {
            const error = new Error('Entry not found');
            error.statusCode = 404;
            throw error;
        } else if (req.user._id.toString() !== entry.user.toString()) {
            const error = new Error('Cannot edit this workout');
            error.statusCode = 403;
            throw error;
        }

        entry.date = req.body.date || entry.date
        entry.note = req.body.note || entry.note
        entry.rating = req.body.rating || entry.rating
        entry.imgUrl = req.body.imgUrl || entry.imgUrl

        await entry.save();

        entry = await entry.populate('user', '_id username imgUrl createdAt');

        return res.json({ [entry._id]: entry });
    } catch (err) {
        next(err);
    }
});

// DELETE workout
router.delete('/:entryId', requireUser, async (req, res, next) => {
    try {
        let entry = await ExerciseEntry.findById(req.params.entryId);
        if (!entry) {
            const error = new Error('Entry not found');
            error.statusCode = 404;
            throw error;
        } else if (entry.user.toString() !== req.user._id.toString()) {
            const error = new Error('You have no power here, Gandalf the Grey');
            error.statusCode = 403;
            throw error;
        }

        await entry.deleteOne();

        return res.json({ message: 'Workout successfully deleted' });

    } catch (err) {
        next(err);
    }
});

module.exports = router;