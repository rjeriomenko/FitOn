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
            setter: req.body.setter, 
            entryId: req.body.entryId
        });

        const exercise = await newExercise.save();

        if (!exercise) {
            const error = new Error('Error saving exercise - please review inputs');
            error.statusCode = 422;
            throw error;
        }

        await exercise
            .populate('setter', '_id username')
            // .populate('entryId', '_id date');

        const user = await User.findById(req.body.setter);
        user.exercises.push(exercise._id);

        user.goals.forEach((goal) => {
            const exerciseEntry = goal.exerciseEntries.find(
                (entry) => entry._id.toString() === req.body.entryId
            );
            exerciseEntry.exercises.push(exercise._id);
        });

        await user.save();

        return res.json({ [exercise.id]: exercise });
    } catch (err) {
        next(err);
    }
});


// show (singular and index?) (use .populate()!!)
router.get('/:exerciseId', async (req, res, next) => {
    try {
        const exercise = await Exercise.findById(req.params.exerciseId)
            .populate('setter', '_id username')
            // .populate('entryId', '_id date');

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
        const formattedExercises = {};
        const exercises = await Exercise.find({})
            .populate('setter', '_id username')
            // .populate('entryId', '_id date');

        exercises.forEach(exercise => {
            formattedExercises[exercise.id] = exercise;
        })
        return res.json(Object.keys(formattedExercises).length ? formattedExercises : { message: 'Exercises not found' });
    } catch (err) {
        next(err);
    }
});

// per user exercise index (get)
router.get('/:userId', requireUser, async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const combinedExerciseArrays = [];
        const formattedExercises = {};
        user.goals.forEach(goal =>
            goal.exerciseEntries.forEach(entry =>
                combinedExerciseArrays.concat(entry.exercises)
            )
        )
        
        const exercises = await Exercise.find({ _id: { $in: combinedExerciseArrays } })
            .populate('setter', '_id username')
            // .populate('entryId', '_id date');

        exercises.forEach(exercise => {
            formattedExercises[exercise.id] = exercise;
        })

        return res.json(Object.keys(formattedExercises).length ? formattedExercises : { message: 'Exercises not found' })
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