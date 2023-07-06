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
const Workout = mongoose.model('ExerciseEntry', ExerciseEntrySchema);
const Exercise = mongoose.model('Exercise', ExerciseSchema);

// Establish a connection to your MongoDB database
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Seed function
const seedData = async () => {
    try {
        // create and save USERS
        const demoUser = new User({
            username: "demo user",
            email: "sams@demo.io",
            hashedPassword: bcrypt.hashSync("password", 10)
        });
        const savedDemoUser = await demoUser.save();

        const triathlonUser = new User({
            username: "triathlonerRunner123",
            email: "triathlon@demo.io",
            hashedPassword: bcrypt.hashSync("password", 10)
        });
        const savedTriUser = await triathlonUser.save();

        const fullBodyUser = new User({
            username: "fullBodyTrainer",
            email: "fullbody@demo.io",
            hashedPassword: bcrypt.hashSync("password", 10)
        });
        const savedFullUser = await fullBodyUser.save();

        process.stdout.write("Users created and saved!\n");

        // template: 
        // const userVar = newUser({
        //     username: "",
        //     email: "",
        //     hashedPassword: bcrypt.hashSync("password", 10)
        // });
        // await userVar.save();

        // create and save GOALS
        // remember demoUser has more robust data

        const demoGoal1 = new Goal({
            title: "Higher Intensity in all Workouts",
            description: "Build muscle bulk and tone, lower resting heart rate",
            deadline: "2023-07-31",
            user: demoUser._id,
        });
        const firstDemoGoal = await demoGoal1.save();
        demoUser.currentGoal = firstDemoGoal;
        await demoUser.save();

        const demoGoal2 = new Goal({
            title: "Increase Endurance and Stamina",
            description: "Improve cardiovascular fitness and stamina for longer workouts",
            deadline: "2023-07-24",
            user: demoUser._id
        });
        const secondDemoGoal = await demoGoal2.save();

        const demoGoal3 = new Goal({
            title: "Weight Loss and Body Toning",
            description: "Lose weight and tone my body for summer",
            deadline: "2023-07-01",
            user: demoUser._id
        });
        const thirdDemoGoal = await demoGoal3.save();

        const triRunGoal = new Goal({
            title: "Run 30 miles by next weekend",
            description: "Preparing for my triathlon",
            deadline: "2023-04-10",
            user: triathlonUser._id
        });
        const savedRunGoal = await triRunGoal.save();

        const triBikeGoal = new Goal({
            title: "Bike 500 miles by mid-April",
            description: "Increase biking endurance and speed for triathlon",
            deadline: "2023-04-01",
            user: triathlonUser._id
        });
        const savedBikeGoal = await triBikeGoal.save();

        const triSwimGoal = new Goal({
            title: "Swim 50 laps (1 mile) per week",
            description: "Improve swimming technique",
            deadline: "2023-04-17",
            user: triathlonUser._id
        });
        const savedSwimGoal = await triSwimGoal.save();

        const fullBodyGoal1 = new Goal({
            title: "Increase Strength and Build Muscle Mass",
            description: "Full body focus to build overall strength",
            deadline: "2023-07-31",
            user: fullBodyUser._id
        });
        const firstFullGoal = await fullBodyGoal1.save();

        const fullBodyGoal2 = new Goal({
            title: "Reduce Body Fat and Increase Muscle Tone",
            description: "I want to lose a few pounds of fat to really highlight my muscles",
            deadline: "2023-07-16",
            user: fullBodyUser._id
        });
        const secondFullGoal = await fullBodyGoal2.save();

        process.stdout.write("Goals created and saved!\n");

        // template: 
        // {
        // title: ,
        // description: ,
        // deadline: ,
        // user: 
        // }

        const goals = [];
        goals.push(firstDemoGoal);
        goals.push(secondDemoGoal);
        goals.push(thirdDemoGoal);
        goals.push(savedRunGoal);
        goals.push(savedBikeGoal);
        goals.push(savedSwimGoal);
        goals.push(firstFullGoal);
        goals.push(secondFullGoal);

        // create and save WORKOUTS
        // this will be a little more complicated as you'll have to make sure the references are all pointed correctly

        for (const goal of goals) {
            const deadline = goal.deadline;
            const numWorkouts = 7;
            const workouts = populateWorkouts(deadline, numWorkouts);

            const workoutPromises = [];

            for (const workout of workouts) {
                const exerciseEntry = new Workout({
                    date: workout.date,
                    note: workout.note,
                    rating: workout.rating,
                    user: goal.user,
                    goal: goal._id
                });

                const savedWorkout = await exerciseEntry.save();

                const exercises = generateExercises(goal); // Generate exercises for the current goal

                for (const exercise of exercises) {
                    const exerciseEntry = new Exercise({
                        name: exercise.name,
                        sets: exercise.sets,
                        reps: exercise.reps,
                        time: exercise.time,
                        user: goal.user,
                        goal: goal._id,
                        workout: savedWorkout._id
                    });

                    workoutPromises.push(exerciseEntry.save());
                }
            }

            await Promise.all(workoutPromises);
        }

        process.stdout.write("Workouts created and saved!\n");

        // Function to generate exercises based on the goal
        const generateExercises = (goal) => {
            const exercises = [];

            switch (goal.title) {
                case "Higher Intensity in all Workouts":
                    exercises.push({
                        name: "Burpees",
                        sets: getRandomSets(),
                        reps: getRandomReps(),
                        time: "10"
                    });
                    exercises.push({
                        name: "Stair Runs",
                        sets: getRandomSets(),
                        reps: 1,
                        time: "10"
                    });
                    exercises.push({
                        name: "Squats",
                        sets: getRandomSets(),
                        reps: getRandomReps(),
                        time: "10"
                    });
                    break;
                case "Increase Endurance and Stamina":
                    exercises.push({
                        name: "Jump Rope",
                        time: getRandomTime()
                    });
                    exercises.push({
                        name: "Rowing Machine",
                        time: getRandomTime()
                    });
                    exercises.push({
                        name: "Boxing",
                        time: getRandomTime()
                    });
                    break;
                case "Weight Loss and Body Toning":
                    exercises.push({
                        name: "Crunches",
                        sets: getRandomSets(),
                        reps: getRandomReps(),
                        time: "10"
                    });
                    exercises.push({
                        name: "Lunges",
                        sets: getRandomSets(),
                        reps: getRandomReps(),
                        time: "10"
                    });
                    exercises.push({
                        name: "Supermans",
                        sets: getRandomSets(),
                        reps: getRandomReps(),
                        time: "10"
                    });
                case "Run 30 miles by next weekend":
                    exercises.push({
                        name: "Running",
                        time: getRandomTime()
                    });
                    break
                case "Bike 500 miles by mid-April":
                    exercises.push({
                        name: "Cycling",
                        time: getRandomTime()
                    });
                    break
                case "Swim 50 laps (1 mile) per week":
                    exercises.push({
                        name: "Swimming",
                        time: getRandomTime()
                    });
                    break
                case "Increase Strength and Build Muscle Mass":
                    exercises.push({
                        name: "Pushups",
                        sets: getRandomSets(),
                        reps: getRandomReps(),
                        time: "10"
                    });
                    exercises.push({
                        name: "Pullups",
                        sets: getRandomSets(),
                        reps: getRandomReps(),
                        time: "10"
                    });
                    exercises.push({
                        name: "Glute Bridges",
                        sets: getRandomSets(),
                        reps: getRandomReps(),
                        time: "10"
                    });
                    exercises.push({
                        name: "Calf Raises",
                        sets: getRandomSets(),
                        reps: getRandomReps(),
                        time: "10"
                    });
                    break;
                case "Reduce Body Fat and Increase Muscle Tone":
                    exercises.push({
                        name: "Lunges",
                        sets: getRandomSets(),
                        reps: getRandomReps(),
                        time: "10"
                    });
                    exercises.push({
                        name: "Squats",
                        sets: getRandomSets(),
                        reps: getRandomReps(),
                        time: "10"
                    });
                    exercises.push({
                        name: "Mountain Climbers",
                        sets: getRandomSets(),
                        reps: getRandomReps(),
                        time: "10"
                    });
                    exercises.push({
                        name: "Russian Twists",
                        sets: getRandomSets(),
                        reps: 20,
                        time: "10"
                    });
                    break;
            };
            return exercises;
        };
        process.stdout.write("Exercises created and saved!\n");


        process.stdout.write("All seed data generated successfully!\n");
    } catch (error) {
        console.error("Error creating seed data:", error);
    } finally {
        // Close the MongoDB connection
        mongoose.connection.close();
    }
};

// generate workouts for the goal based on deadline and how many days of workouts you need
const populateWorkouts = (numWorkouts, deadline) => {
    const workouts = [];

    for (let i = 0; i < numWorkouts; i++) {
        const date = getPreviousDate(deadline, i);
        const note = getRandomNote();
        const rating = getRandomRating();

        const workout = {
            date,
            note,
            rating
        };

        workouts.push(workout);
    }

    return workouts;
};

// work backwards from deadline
const getPreviousDate = (deadline, days) => {
    const deadlineDate = new Date(deadline);
    const previousDate = new Date(deadlineDate);
    previousDate.setDate(deadlineDate.getDate() - days);
    const year = previousDate.getFullYear();
    const month = String(previousDate.getMonth() + 1).padStart(2, "0");
    const date = String(previousDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${date}`;
};

const getRandomTime = () => {
    const times = [30, 35, 40, 45];
    const randomIndex = Math.floor(Math.random() * times.length);
    return String(times[randomIndex]);
}

const getRandomRating = () => {
    return Math.floor(Math.random() * 5) + 1;
}

const getRandomSets = () => {
    return Math.floor(Math.random() * 3) + 2;
}

const getRandomReps = () => {
    const reps = [7, 8, 9, 10, 11, 12];
    const randomIndex = Math.floor(Math.random() * reps.length);
    return reps[randomIndex];
}

const getRandomNote = () => {
    const workoutNotes = [
        "Great workout! Feeling pumped!",
        "Not my best workout, but I pushed through.",
        "Incredible session! Achieved new personal records.",
        "Feeling the burn! Building strength.",
        "Challenging workout, but I'm proud of my progress.",
        "Focused and determined during the entire session.",
        "Fantastic effort! Feeling energized and motivated.",
        "Workout complete! Time to recover and refuel.",
        "Positive mindset led to a productive workout.",
        "Overcame obstacles and finished strong."
    ];

    const randomIndex = Math.floor(Math.random() * workoutNotes.length);
    return workoutNotes[randomIndex];
}

// Call the function to create the seed data
seedData();