const mongoose = require("mongoose");
const { mongoURI: db } = require('../config/keys.js');
const UserSchema = require('../models/User');
const GoalSchema = require('../models/Goal');
const ExerciseEntrySchema = require('../models/ExerciseEntry');
const ExerciseSchema = require('../models/Exercise');
const bcrypt = require('bcryptjs');

// Define models
const User = mongoose.model('User', UserSchema);
const Goal = mongoose.model('Goal', GoalSchema);
const ExerciseEntry = mongoose.model('ExerciseEntry', ExerciseEntrySchema);
const Exercise = mongoose.model('Exercise', ExerciseSchema);

// Establish a connection to your MongoDB database
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Seed function
const seedData = async () => {
    try {
        // Create a user
        const seedUser = new User({
            username: "seedTest",
            email: "seed@tester.io",
            hashedPassword: bcrypt.hashSync("password", 10),
        });

        // Save the user to the database
        const savedUser = await seedUser.save();

        // Create a goal
        const seedGoal = new Goal({
            title: "Training for triathlon",
            description: "Signed up for a triathlon for next year woohooo",
            deadline: "2024/07/28",
            user: savedUser._id,
        });

        // Save the goal to the database
        const savedGoal = await seedGoal.save();

        // Generate workouts
        const workoutPromises = [];
        const workoutInfo = [
            { date: getNextDate(0), note: "change this name please! 1", rating: 4 },
            { date: getNextDate(1), note: "change this name please! 2", rating: 3 },
            { date: getNextDate(2), note: "change this name please! 3", rating: 5 },
        ];

        for (const workout of workoutInfo) {
            const exerciseEntry = new ExerciseEntry({
                date: workout.date,
                note: workout.note,
                rating: workout.rating,
                user: savedUser._id,
                goal: savedGoal._id,
            });

            // Save the workout to the database
            const savedWorkout = await exerciseEntry.save();

            // Generate exercises and assign them to the workout
            const exercises = [
                {
                    name: "Running",
                    sets: null,
                    reps: null,
                    time: "30",
                    weight: null,
                    user: savedUser._id,
                    goal: savedGoal._id,
                    workout: savedWorkout._id,
                },
                {
                    name: "Cycling",
                    sets: null,
                    reps: null,
                    time: "45",
                    weight: null,
                    user: savedUser._id,
                    goal: savedGoal._id,
                    workout: savedWorkout._id,
                },
                {
                    name: "Swimming",
                    sets: null,
                    reps: null,
                    time: "20",
                    weight: null,
                    user: savedUser._id,
                    goal: savedGoal._id,
                    workout: savedWorkout._id,
                },
            ];

            workoutPromises.push(Exercise.insertMany(exercises));
        }

        // Wait for all exercises to be saved
        await Promise.all(workoutPromises);

        console.log("Seed data created successfully!");
    } catch (error) {
        console.error("Error creating seed data:", error);
    } finally {
        // Close the MongoDB connection
        mongoose.connection.close();
    }
};

// Get the next date in the week
const getNextDate = (day) => {
    const today = new Date();
    today.setDate(today.getDate() + day);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const date = String(today.getDate()).padStart(2, "0");
    return `${year}/${month}/${date}`;
};

// Call the function to create the seed data
seedData();

// TIME EXERCISE:
// jogging
// swimming
// cycling
// dancing
// plank

// REP EXERCISE:
// pushups
// pull-ups
// squats
// burpees
// bicep curls 


//notes

// seed1 - triathlon trainer (jogging/swimming/cycling)
//seed2 - fullbody trainer (pushups, pullups, burpees, squats)