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
            username: 'bigSeedMan',
            email: 'seed@demo.io',
            hashedPassword: bcrypt.hashSync('password', 10),
        });

        // Create a goal
        const seedGoal = new Goal({
            title: 'GROW THAT DUMPTRUCK',
            description: 'I want a BIG FAT DERRIER',
            deadline: '2023/07/28',
            updatedAt: Date.now(),
        });

        // Generate exercise entries for 7 days
        for (let day = 0; day < 7; day++) {
            const exerciseEntry = new ExerciseEntry({
                date: getNextDate(day),
                note: 'Completed workout',
                rating: Math.floor(Math.random() * 5) + 1,
            });

            // Generate exercises and assign entryId and user references
            const exercises = [];
            const exerciseNames = ['Squats', 'Glute Bridges', 'Hip Thrusts'];
            for (let i = 0; i < 3; i++) {
                const exercise = new Exercise({
                    name: exerciseNames[i],
                    sets: getRandomNumber(3, 5),
                    reps: getRandomNumber(8, 12),
                    setter: seedUser._id,
                    entryId: exerciseEntry._id,
                });
                exercises.push(exercise);
                seedUser.exercises.push(exercise);
                exerciseEntry.exercises.push(exercise);
            }

            // Assign exercise entry and exercises to the goal
            seedGoal.exerciseEntries.push(exerciseEntry);

            // Save the exercises to the database
            await Promise.all(exercises.map(exercise => exercise.save()));
        }

        // Assign goal to the user
        seedUser.goals.push(seedGoal);

        // Save the user to the database
        await seedUser.save();

        console.log('Seed data created successfully!');
    } catch (error) {
        console.error('Error creating seed data:', error);
    } finally {
        // Close the MongoDB connection
        mongoose.connection.close();
    }
};

// Generate a random number within a range
const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Get the next date in the week
const getNextDate = (day) => {
    const today = new Date();
    today.setDate(today.getDate() + day);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const date = String(today.getDate()).padStart(2, '0');
    return `${year}/${month}/${date}`;
};

// Call the function to create the seed data
seedData();
