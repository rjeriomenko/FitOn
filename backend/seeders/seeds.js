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
        // Create a user for the full-body workout
        const fullBodyUser = new User({
            username: "fullBodyUser",
            email: "fullbody@tester.io",
            hashedPassword: bcrypt.hashSync("password", 10),
        });

        // Create a goal for the full-body workout
        const fullBodyGoal = new Goal({
            title: "Full-Body Strength Training",
            description: "Build strength and improve overall fitness",
            deadline: "2024-07-31",
            user: savedFullBodyUser._id,
        });

        // Save the full-body goal to the database
        const savedFullBodyGoal = await fullBodyGoal.save();
        fullBodyUser.currentGoal = fullBodyGoal;
        const savedFullBodyUser = await fullBodyUser.save();

        // Generate workouts for the full-body workout
        const fullBodyWorkoutPromises = [];
        const fullBodyWorkoutInfo = [
            { date: getNextDate(0), note: "Pretty good workout - I really felt it in my back today", rating: 4 },
            { date: getNextDate(1), note: "Not the best workout - should've gone to sleep earlier last night", rating: 3 },
            { date: getNextDate(2), note: "AMAZING workout - I love Celsius energy drink", rating: 5 },
        ];

        for (const workout of fullBodyWorkoutInfo) {
            const exerciseEntry = new ExerciseEntry({
                date: workout.date,
                note: workout.note,
                rating: workout.rating,
                user: savedFullBodyUser._id,
                goal: savedFullBodyGoal._id,
            });

            // Save the workout to the database
            const savedWorkout = await exerciseEntry.save();

            // Generate exercises and assign them to the workout
            const exercises = [
                {
                    name: "Pushups",
                    sets: 3,
                    reps: 10,
                    time: '10',
                    weight: null,
                    user: savedFullBodyUser._id,
                    goal: savedFullBodyGoal._id,
                    workout: savedWorkout._id,
                },
                {
                    name: "Pullups",
                    sets: 3,
                    reps: 8,
                    time: '10',
                    weight: null,
                    user: savedFullBodyUser._id,
                    goal: savedFullBodyGoal._id,
                    workout: savedWorkout._id,
                },
                {
                    name: "Squats",
                    sets: 4,
                    reps: 9,
                    time: '10',
                    weight: null,
                    user: savedFullBodyUser._id,
                    goal: savedFullBodyGoal._id,
                    workout: savedWorkout._id,
                },
                {
                    name: "Burpees",
                    sets: 2,
                    reps: 12,
                    time: '10',
                    weight: null,
                    user: savedFullBodyUser._id,
                    goal: savedFullBodyGoal._id,
                    workout: savedWorkout._id,
                },
                {
                    name: "Bicep Curls",
                    sets: 3,
                    reps: 10,
                    time: '60',
                    weight: null,
                    user: savedFullBodyUser._id,
                    goal: savedFullBodyGoal._id,
                    workout: savedWorkout._id,
                },
            ];

            fullBodyWorkoutPromises.push(Exercise.insertMany(exercises));
        }

        // Wait for all full-body exercises to be saved
        await Promise.all(fullBodyWorkoutPromises);

        // Create a user for the triathlon workout
        const triathlonUser = new User({
            username: "triathlonUser",
            email: "triathlon@tester.io",
            hashedPassword: bcrypt.hashSync("password", 10),
        });

        // Create a goal for the triathlon workout
        const triathlonGoal = new Goal({
            title: "Training for Triathlon",
            description: "Signed up for a triathlon for next year woohooo",
            deadline: "2024-07-28",
            user: savedTriathlonUser._id,
        });

        // Save the triathlon goal to the database
        const savedTriathlonGoal = await triathlonGoal.save();
        triathlonUser.currentGoal = triathlonGoal;
        const savedTriathlonUser = await triathlonUser.save();

        // Generate workouts for the triathlon workout
        const triathlonWorkoutPromises = [];
        const triathlonWorkoutInfo = [
            { date: getNextDate(0), note: "Great workout! I think I can do better though.", rating: 4 },
            { date: getNextDate(1), note: "Oof, definitely not my best workout. I need to focus more on my mental game.", rating: 3 },
            { date: getNextDate(2), note: "AMAZING workout! Thank you Celsius!", rating: 5 },
        ];

        for (const workout of triathlonWorkoutInfo) {
            const exerciseEntry = new ExerciseEntry({
                date: workout.date,
                note: workout.note,
                rating: workout.rating,
                user: savedTriathlonUser._id,
                goal: savedTriathlonGoal._id,
            });

            // Save the workout to the database
            const savedWorkout = await exerciseEntry.save();

            // Generate exercises and assign them to the workout
            const exercises = [
                {
                    name: "Jogging",
                    sets: null,
                    reps: null,
                    time: "30",
                    weight: null,
                    user: savedTriathlonUser._id,
                    goal: savedTriathlonGoal._id,
                    workout: savedWorkout._id,
                },
                {
                    name: "Swimming",
                    sets: null,
                    reps: null,
                    time: "20",
                    weight: null,
                    user: savedTriathlonUser._id,
                    goal: savedTriathlonGoal._id,
                    workout: savedWorkout._id,
                },
                {
                    name: "Cycling",
                    sets: null,
                    reps: null,
                    time: "45",
                    weight: null,
                    user: savedTriathlonUser._id,
                    goal: savedTriathlonGoal._id,
                    workout: savedWorkout._id,
                },
            ];

            triathlonWorkoutPromises.push(Exercise.insertMany(exercises));
        }

        // Wait for all triathlon exercises to be saved
        await Promise.all(triathlonWorkoutPromises);

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
    return `${year}-${month}-${date}`;
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
// seed2 - fullbody trainer (pushups, pullups, burpees, squats)
// seed3 - we'll see
// demo - ***make sure demo is subscribed to the seed users

// make sure you're in backend folder
// npm install -g dotenv-cli
// node -r dotenv/config seeders/seeds.js