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
      hashedPassword: bcrypt.hashSync('password', 10)
    });

    // Define the week's dates
    const weekDates = [
      '2023/07/05',
      '2023/07/06',
      '2023/07/07',
      '2023/07/08',
      '2023/07/09',
      '2023/07/10',
      '2023/07/11'
    ];

    // Create an array to store the generated exercise entry IDs
    const exerciseEntries = [];

    // Create exercise entries for each date
    for (let i = 0; i < weekDates.length; i++) {
      const date = weekDates[i];

      // Create an exercise entry for the current date
      const exerciseEntry = new ExerciseEntry({
        date: date,
        note: 'Completed workout',
        rating: Math.floor(Math.random() * 5) + 1
      });

      exerciseEntries.push(exerciseEntry);
    }

    // Generate routines and exercises for each entry
    for (let i = 0; i < exerciseEntries.length; i++) {
      const entry = exerciseEntries[i];
      const routine = generateRandomRoutine(seedUser);

      // Create exercises for the current entry
      const entryExercises = routine.map((exercise) => {
        const { name, sets, reps, setter } = exercise;
        const newExercise = new Exercise({
          name,
          sets,
          reps,
          setter,
          entryId: entry._id
        });
        seedUser.exercises.push(newExercise); // Add exercise reference to user's exercises array
        return newExercise;
      });

      entry.exercises = entryExercises.map((exercise) => exercise._id);
    }

    // Create a goal
    const seedGoal = new Goal({
      title: 'GROW THAT DUMPTRUCK',
      description: 'I want a BIG FAT DERRIER',
      deadline: '2023/07/28',
      exerciseEntries: exerciseEntries.map((entry) => ({
        exerciseEntry: entry._id,
        rating: Math.floor(Math.random() * 5) + 1,
        date: entry.date
      })),
      updatedAt: Date.now()
    });

    // Assign exercise entries and goal to the user
    seedUser.exerciseEntries = exerciseEntries;
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

// Generate a random routine for a specific entry
const generateRandomRoutine = (seedUser) => {
  const exercises = [
    {
      name: 'Squats'
    },
    {
      name: 'Glute Bridges'
    },
    {
      name: 'Hip Thrusts'
    }
    // Add more exercises as needed
  ];

  return exercises.map((exercise) => {
    return {
      ...exercise,
      sets: getRandomNumber(3, 5),
      reps: getRandomNumber(8, 12),
      setter: seedUser._id
    };
  });
};

// Generate a random number within a range
const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Call the function to create the seed data
seedData();
