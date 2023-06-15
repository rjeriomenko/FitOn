const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const ExerciseEntry = mongoose.model('ExerciseEntry');
const Exercise = mongoose.model('Exercise');
const { requireUser } = require('../../config/passport');
const validateExerciseInput = require('../../validations/exercises');


// entryID reference may not be necessary? 

// create
router.post('/', requireUser, validateExerciseInput, async (req, res, next) => {
    try {
        const newExercise = new Exercise({
            sets: req.body.sets,
            reps: req.body.reps,
            time: req.body.time,
            name: req.body.name,
            setter: req.body.userId, 
            entryId: req.body.entryId
        });

        const exercise = await newExercise.save();
        if (!exercise) {
            const error = new Error('Error saving exercise - please review inputs');
            error.statusCode = 422;
            throw error;
        }
        await exercise.populate('setter', '_id username');

        const user = await User.findById(req.body.userId);
        user.exercises.push(exercise._id);

        user.goals.forEach((goal) => {
            const exerciseEntry = goal.exerciseEntries.find(
                (entry) => entry._id.toString() === req.body.entryId
            );
            exerciseEntry.exercises.push(exercise._id);
        });

        await user.save();

        return res.json(exercise);
    } catch (err) {
        next(err);
    }
});


// show (singular and index?) (use .populate()!!)
router.get('/:exerciseId', async (req, res, next) => {
    try {
        const exercise = await Exercise.findById(req.params.exerciseId).populate('setter', '_id username');

        if (!exercise) {
            const error = new Error('Exercise not found');
            error.statusCode = 404;
            throw error;
        }

        return res.json(exercise);
    } catch (err) {
        next(err);
    }
});

//get all exercises (index)
router.get('/', async (req, res, next) => {
    try {
        const exercises = await Exercise.find({}).populate('setter', '_id username');

        return res.json(exercises);
    } catch (err) {
        next(err);
    }
});


// delete
router.delete('/:exerciseId', requireUser, async (req, res, next) => {
    try {
        const exerciseId = req.params.exerciseId;

        await ExerciseEntry.updateMany(
            { exercises: exerciseId },
            { $pull: { exercises: exerciseId } }
        );

        await User.updateMany(
            { exercises: exerciseId },
            { $pull: { exercises: exerciseId } }
        );

        await Exercise.findByIdAndDelete(exerciseId);
        return res.json({ message: 'Exercise successfully deleted' });
    } catch (err) {
        next(err);
    }
});


// update
router.patch('/:exerciseId', requireUser, validateExerciseInput, async (req, res, next) => {
    try {
        const exercise = await Exercise.findById(req.params.exerciseId);
        if (!exercise) {
            const error = new Error('Exercise not found');
            error.statusCode = 404;
            throw error;
        }

        exercise.sets = req.body.sets || exercise.sets;
        exercise.reps = req.body.reps || exercise.sets;
        exercise.time = req.body.time || exercise.sets;
        exercise.name = req.body.name || exercise.sets;
        exercise.setter = req.body.userId || exercise.sets;
        exercise.entryId = req.body.entryId || exercise.sets;

        exercise.save();

        return res.json(exercise);
    } catch (err) {
        next(err);
    }
});



module.exports = router;