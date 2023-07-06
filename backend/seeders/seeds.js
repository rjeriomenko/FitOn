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
            email: "fullbody@test.io",
            hashedPassword: bcrypt.hashSync("password", 10),
        });

        const savedFullBodyUser = await fullBodyUser.save();

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
        await savedFullBodyUser.save();
        

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
                    user: savedFullBodyUser._id,
                    goal: savedFullBodyGoal._id,
                    workout: savedWorkout._id,
                },
                {
                    name: "Pullups",
                    sets: 3,
                    reps: 8,
                    time: '10',
                    user: savedFullBodyUser._id,
                    goal: savedFullBodyGoal._id,
                    workout: savedWorkout._id,
                },
                {
                    name: "Squats",
                    sets: 4,
                    reps: 9,
                    time: '10',
                    user: savedFullBodyUser._id,
                    goal: savedFullBodyGoal._id,
                    workout: savedWorkout._id,
                },
                {
                    name: "Burpees",
                    sets: 2,
                    reps: 12,
                    time: '10',
                    user: savedFullBodyUser._id,
                    goal: savedFullBodyGoal._id,
                    workout: savedWorkout._id,
                },
                {
                    name: "Bicep Curls",
                    sets: 3,
                    reps: 10,
                    time: '10',
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
            email: "triathlon@test.io",
            hashedPassword: bcrypt.hashSync("password", 10),
        });

        const savedTriathlonUser = await triathlonUser.save();

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
        await savedTriathlonUser.save();

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
                    time: getRandomTime(),
                    user: savedTriathlonUser._id,
                    goal: savedTriathlonGoal._id,
                    workout: savedWorkout._id,
                },
                {
                    name: "Swimming",
                    time: getRandomTime(),
                    user: savedTriathlonUser._id,
                    goal: savedTriathlonGoal._id,
                    workout: savedWorkout._id,
                },
                {
                    name: "Cycling",
                    time: getRandomTime(),
                    user: savedTriathlonUser._id,
                    goal: savedTriathlonGoal._id,
                    workout: savedWorkout._id,
                },
            ];

            triathlonWorkoutPromises.push(Exercise.insertMany(exercises));
        }

        // Wait for all triathlon exercises to be saved
        await Promise.all(triathlonWorkoutPromises);


        // Create a user for the sprained ankle recovery workout
        const sprainedAnkleUser = new User({
            username: "sprainedAnkleUser",
            email: "sprainedankle@test.io",
            hashedPassword: bcrypt.hashSync("password", 10),
        });

        const savedSprainedAnkleUser = await sprainedAnkleUser.save();

        // Create a goal for the sprained ankle recovery workout
        const sprainedAnkleGoal = new Goal({
            title: "Stay in shape while recovering from sprained ankle",
            description: "I don't want this injury to set me back too much",
            deadline: "2024-07-31",
            user: savedSprainedAnkleUser._id,
        });

        // Save the sprained ankle goal to the database
        const savedSprainedAnkleGoal = await sprainedAnkleGoal.save();
        sprainedAnkleUser.currentGoal = sprainedAnkleGoal;
        await savedSprainedAnkleUser.save();

        // Generate workouts for the sprained ankle recovery workout
        const sprainedAnkleWorkoutPromises = [];
        const sprainedAnkleWorkoutInfo = [
            { date: getNextDate(0), note: "Feeling some pain in the ankle, but managed to complete the workout", rating: 3 },
            { date: getNextDate(1), note: "Ankle pain reduced today, had a good workout overall", rating: 4 },
            { date: getNextDate(2), note: "Minimal ankle discomfort during the workout, feeling positive", rating: 5 },
        ];

        for (const workout of sprainedAnkleWorkoutInfo) {
            const exerciseEntry = new ExerciseEntry({
                date: workout.date,
                note: workout.note,
                rating: workout.rating,
                user: savedSprainedAnkleUser._id,
                goal: savedSprainedAnkleGoal._id,
            });

            // Save the workout to the database
            const savedWorkout = await exerciseEntry.save();

            // Generate exercises and assign them to the workout
            const exercises = [
                {
                    name: "Swimming",
                    time: getRandomTime(),
                    user: savedSprainedAnkleUser._id,
                    goal: savedSprainedAnkleGoal._id,
                    workout: savedWorkout._id,
                },
                {
                    name: "Cycling",
                    time: getRandomTime(),
                    user: savedSprainedAnkleUser._id,
                    goal: savedSprainedAnkleGoal._id,
                    workout: savedWorkout._id,
                },
            ];

            sprainedAnkleWorkoutPromises.push(Exercise.insertMany(exercises));
        }

        // Wait for all sprained ankle exercises to be saved
        await Promise.all(sprainedAnkleWorkoutPromises);

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

const getRandomTime = () => {
    const times = [25, 30, 35, 40, 45];
    const randomIndex = Math.floor(Math.random() * times.length);
    return String(times[randomIndex]);
}

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
// if not yet installed, npm install -g dotenv-cli
// to run the seed file, node -r dotenv/config seeders/seeds.js

// pseudocode for demo

// demo@user.io
//password

// 30(!!!???!!) days of exercises?
// could be weekly physical therapy/yoga/etc.
// also maybe miss a day here and there to give it a more authentic feel

