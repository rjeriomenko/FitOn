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
router.post('/:workoutId', requireUser, validateExerciseInput, async (req, res, next) => {
    try {
        let workout = await ExerciseEntry.findById(req.params.workoutId);
        const goalId = workout.goal;
        const userId = workout.user;
        
        const newExercise = new Exercise({
            sets: req.body.sets,
            reps: req.body.reps,
            time: req.body.time,
            weight: req.body.weight,
            name: req.body.name,
            user: userId,
            goal: goalId,
            workout: req.params.workoutId
        });

        const exercise = await newExercise.save();

        await exercise.populate('user', '_id username')
        await exercise.populate('workout', '_id date');


        return res.json({ [exercise._id]: exercise });
    } catch (err) {
        next(err);
    }
});

// get exercises PER GOAL
router.get('/byGoal/:goalId', requireUser, async (req, res, next) => {
    try {
        const exercises = await Exercise.find({ goal: req.params.goalId })
            .populate('user', '_id username imgUrl')
            .populate('workout', '_id date imgUrl')
            // .populate('goal', '_id title imgUrl')
                //  populate goal provides null to goal
            
            
        const exercisesObj = {};
        exercises.forEach(exercise => exercisesObj[exercise._id] = exercise);

        return res.json(exercisesObj);
    } catch (err) {
        next(err);
    }
});

// get exercises PER WORKOUT
router.get('/byWorkout/:workoutId', requireUser, async (req, res, next) => {
    try {
        const exercises = await Exercise.find({ workout: req.params.workoutId })
        .populate('user', '_id username imgUrl')
        .populate('workout', '_id date imgUrl');

        const exercisesObj = {};
        exercises.forEach(exercise => exercisesObj[exercise._id] = exercise);

        return res.json(exercisesObj);
    } catch (err) {
        next(err);
    }
});




// // delete
// router.delete('/:exerciseId', requireUser, async (req, res, next) => {
//     try {
//         const exerciseId = req.params.exerciseId;

//         await ExerciseEntry.updateMany(
//             { exercises: exerciseId },
//             { $pull: { exercises: exerciseId } }
//         );

//         await User.updateMany(
//             { exercises: exerciseId },
//             { $pull: { exercises: exerciseId } }
//         );

//         await Exercise.findByIdAndDelete(exerciseId);
//         return res.json({ message: 'Exercise successfully deleted' });
//     } catch (err) {
//         next(err);
//     }
// });


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
        exercise.reps = req.body.reps || exercise.reps;
        exercise.time = req.body.time || exercise.time;
        exercise.weight = req.body.weight || exercise.weight;
        exercise.name = req.body.name || exercise.name;
        exercise.workout = req.body.workout || exercise.workout;

        exercise.save();

        await exercise.populate('user', '_id username imgUrl')
        await exercise.populate('workout', '_id imgUrl date')

        return res.json({ [exercise._id]: exercise });
    } catch (err) {
        next(err);
    }
});

// delete exercise
router.delete('/:exerciseId', requireUser, async (req, res, next) => {
    try {
        let exercise = await Exercise.findById(req.params.exerciseId);
        if (!exercise) {
            const error = new Error('Exercise not found');
            error.statusCode = 404;
            throw error;
        } else if (exercise.user.toString() !== req.user._id.toString()) {
            const error = new Error('You have no power here, Gandalf the Grey');
            error.statusCode = 403;
            throw error;
        }

    await exercise.deleteOne();

    return res.json({ message: 'Exercise successfully deleted' });
    } catch (err) {
        next(err);
    }
});


module.exports = router;

// 