const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ExerciseEntry = mongoose.model('ExerciseEntry');
const validateExerciseEntryInput = require("../../validations/goals");
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

        let entry = await newEntry.save();
        return res.json(entry);
    }
    catch (err) {
        next(err);
    }
});




module.exports = router;