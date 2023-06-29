const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ExerciseEntry = mongoose.model('ExerciseEntry');
const Goal = mongoose.model('Goal');
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
        return res.json(entry);
    }
    catch (err) {
        next(err);
    }
});




module.exports = router;