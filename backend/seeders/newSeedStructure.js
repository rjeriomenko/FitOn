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

        // template: 
        // {
        // title: ,
        // description: ,
        // deadline: ,
        // user: 
        // }


        // create and save WORKOUTS
        // this will be a little more complicated as you'll have to make sure the references are all pointed correctly


        const demoWorkoutPromises = [];
        const demoWorkoutInfo = [
            { date: getPreviousDate("2023-07-31", 0), note: getRandomNote(), rating: 4 },
            { date: getPreviousDate("2023-07-31", 1), note: getRandomNote(), rating: 3 },
            { date: getPreviousDate("2023-07-31", 2), note: getRandomNote(), rating: 5 },
            { date: getPreviousDate("2023-07-31", 3), note: getRandomNote(), rating: 3 },
            { date: getPreviousDate("2023-07-31", 4), note: getRandomNote(), rating: 4 },
            { date: getPreviousDate("2023-07-31", 5), note: getRandomNote(), rating: 3 },
            { date: getPreviousDate("2023-07-31", 6), note: getRandomNote(), rating: 5 },
        ];

        for (const workout of demoWorkoutInfo) {
            const exerciseEntry = new Workout({
                date: workout.date,
                note: workout.note,
                rating: workout.rating,
                user: savedDemoUser._id,
                goal: firstDemoGoal._id
            });

            const savedWorkout = await exerciseEntry.save();

            const exercises = [
                {
                    name: "Burpees",
                    sets: 3,
                    reps: getRandomReps(),
                    time: '10',
                    user: savedDemoUser._id,
                    goal: firstDemoGoal._id,
                    workout: savedWorkout._id
                },
                {
                    name: "Stair Runs",
                    sets: 3,
                    reps: 1,
                    time: '10',
                    user: savedDemoUser._id,
                    goal: firstDemoGoal._id,
                    workout: savedWorkout._id
                },
                {
                    name: "Squats",
                    sets: 4,
                    reps: getRandomReps(),
                    time: '10',
                    user: savedDemoUser._id,
                    goal: firstDemoGoal._id,
                    workout: savedWorkout._id
                },
                {
                    name: "Crunches",
                    sets: 3,
                    reps: 20,
                    time: '10',
                    user: savedDemoUser._id,
                    goal: firstDemoGoal._id,
                    workout: savedWorkout._id
                },
            ];

            demoWorkoutPromises.push(Exercise.insertMany(exercises));
        }

        await Promise.all(demoWorkoutPromises);





        console.log("Seed data created successfully!");
    } catch (error) {
        console.error("Error creating seed data:", error);
    } finally {
        // Close the MongoDB connection
        mongoose.connection.close();
    }
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
    const times = [25, 30, 35, 40, 45];
    const randomIndex = Math.floor(Math.random() * times.length);
    return String(times[randomIndex]);
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
        "Overcame obstacles and finished strong.",
        "AMAZING workout - I love Celsius energy drink!"
    ];

    const randomIndex = Math.floor(Math.random() * workoutNotes.length);
    return workoutNotes[randomIndex];
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

