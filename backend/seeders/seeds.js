const mongoose = require("mongoose");
const { mongoURI: db } = require('../config/keys.js');
const UserSchema = require('../models/User');
const GoalSchema = require('../models/Goal');
const ExerciseEntrySchema = require('../models/ExerciseEntry');
const ExerciseSchema = require('../models/Exercise');
const FollowSchema = require('../models/Follow');
const bcrypt = require('bcryptjs');

// Define models
const User = mongoose.model('User', UserSchema);
const Goal = mongoose.model('Goal', GoalSchema);
const ExerciseEntry = mongoose.model('ExerciseEntry', ExerciseEntrySchema);
const Exercise = mongoose.model('Exercise', ExerciseSchema);
const Follow = mongoose.model('Follow', FollowSchema);

// Establish a connection to your MongoDB database
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Seed function
const seedData = async () => {
    try {
        // wipe DB before seeding
        await User.deleteMany({});
        await Goal.deleteMany({});
        await ExerciseEntry.deleteMany({});
        await Exercise.deleteMany({});
        await Follow.deleteMany({});

        process.stdout.write("Database cleared!\n");


        // create and save USERS

        // userTemplate: 
        // const userVar = newUser({
        //     username: "",
        //     email: "",
        //     hashedPassword: bcrypt.hashSync("password", 10)
        // });
        // await userVar.save();


        const demoUser = new User({
            username: "demo user",
            email: "demo@user.io",
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

        // creating FOLLOWS
        const follows = [
            { follower: savedDemoUser._id, followedUser: savedTriUser._id },
            { follower: savedDemoUser._id, followedUser: savedFullUser._id },
            { follower: savedTriUser._id, followedUser: savedDemoUser._id },
            { follower: savedTriUser._id, followedUser: savedFullUser._id },
            { follower: savedFullUser._id, followedUser: savedDemoUser._id },
            { follower: savedFullUser._id, followedUser: savedTriUser._id }
        ];

        await Follow.insertMany(follows);

        process.stdout.write("Follows created and saved!\n");

        // create and save GOALS
        // remember demoUser has more robust data

        // goalTemplate: 
        // const goalVar = new Goal({
        // title: ,
        // description: ,
        // deadline: ,
        // user: 
        // });
        // const savedGoalVarName = await goalVar.save();

        const demoGoal1 = new Goal({
            title: "Higher Intensity in all Workouts",
            description: "Build muscle bulk and tone, lower resting heart rate",
            deadline: "2023-07-31",
            user: demoUser._id,
        });
        const firstDemoGoal = await demoGoal1.save();
        savedDemoUser.currentGoal = firstDemoGoal;
        await savedDemoUser.save();

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
            deadline: "2023-07-03",
            user: demoUser._id
        });
        const thirdDemoGoal = await demoGoal3.save();

        const demoGoal4 = new Goal({
            title: "Mindful Meditation Practice",
            description: "Incorporate regular meditation sessions to reduce stress, enhance focus, and promote mental well-being.",
            deadline: "2023-07-17",
            user: demoUser._id
        });
        const fourthDemoGoal = await demoGoal4.save();

        const demoGoal5 = new Goal({
            title: "Flexibility and Mobility Improvement",
            description: "Enhance range of motion, improve flexibility, and increase overall mobility for better performance and injury prevention.",
            deadline: "2023-07-10",
            user: demoUser._id
        });
        const fifthDemoGoal = await demoGoal5.save();

        const triRunGoal = new Goal({
            title: "Run 30 miles by next weekend",
            description: "Preparing for my triathlon",
            deadline: "2023-04-10",
            user: triathlonUser._id
        });
        const savedRunGoal = await triRunGoal.save();

        const triBikeGoal = new Goal({
            title: "Bike 500 miles by end of July",
            description: "Increase biking endurance and speed for triathlon",
            deadline: "2023-07-30",
            user: triathlonUser._id
        });
        const savedBikeGoal = await triBikeGoal.save();
        savedTriUser.currentGoal = savedBikeGoal;
        await savedTriUser.save();

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
        savedFullUser.currentGoal = firstFullGoal;
        await savedFullUser.save();

        const fullBodyGoal2 = new Goal({
            title: "Reduce Body Fat and Increase Muscle Tone",
            description: "I want to lose a few pounds of fat to really highlight my muscles",
            deadline: "2023-07-16",
            user: fullBodyUser._id
        });
        const secondFullGoal = await fullBodyGoal2.save();

        process.stdout.write("Goals created and saved!\n");

        // create and save WORKOUTS AND EXERCISES
        // this will be a little more complicated as you'll have to make sure the references are all pointed correctly

        const goals = [];
        goals.push(firstDemoGoal);
        goals.push(secondDemoGoal);
        goals.push(thirdDemoGoal);
        goals.push(fourthDemoGoal);
        goals.push(fifthDemoGoal);
        goals.push(savedRunGoal);
        goals.push(savedBikeGoal);
        goals.push(savedSwimGoal);
        goals.push(firstFullGoal);
        goals.push(secondFullGoal);

        for (const goal of goals) {
            const deadline = goal.deadline;
            const numWorkouts = 7;
            const workouts = populateWorkouts(deadline, numWorkouts);

            const workoutPromises = [];
            const exercisePromises = [];

            for (const workout of workouts) {
                const exerciseEntry = new ExerciseEntry({
                    date: workout.date,
                    note: workout.note,
                    rating: workout.rating,
                    user: goal.user,
                    goal: goal._id,
                });

                const savedEntry = await exerciseEntry.save();
                if (!savedEntry) {
                    process.stdout.write("entry not working!!!!!\n");
                    const error = new Error('Entry was not saved');
                    throw error;
                }

                workoutPromises.push(savedEntry);

                const exercises = generateExercises(goal);

                for (const exercise of exercises) {
                    const exerciseObj = new Exercise({
                        name: exercise.name,
                        sets: exercise.sets,
                        reps: exercise.reps,
                        time: exercise.time,
                        user: goal.user,
                        goal: goal._id,
                        workout: savedEntry._id,
                    });

                    const savedExercise = await exerciseObj.save();
                    if (!savedExercise) {
                        process.stdout.write("exercise not working!!!!!!\n");
                        const error = new Error('Exercise was not saved');
                        throw error;
                    }

                    exercisePromises.push(savedExercise);
                }
            }
            await Promise.all(workoutPromises);
            await Promise.all(exercisePromises);
        }

        process.stdout.write("Workouts created and saved!\n");
        process.stdout.write("Exercises created and saved!\n");


        process.stdout.write("All seed data generated successfully!\n");
    } catch (error) {
        console.error("Error creating seed data:", error);
    } finally {
        mongoose.connection.close();
    }
};

// generate workouts templates for the goal based on deadline and how many days of workouts you need
const populateWorkouts = (deadline, numWorkouts) => {
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

const getRandomCardioTime = () => {
    const times = [30, 35, 40, 45];
    const randomIndex = Math.floor(Math.random() * times.length);
    return String(times[randomIndex]);
}

const getRandomRepTime = () => {
    const times = [8, 9, 10, 11, 12, 13, 14, 15];
    const randomIndex = Math.floor(Math.random() * times.length);
    return String(times[randomIndex]);
}

const getRandomStretchTime = () => {
    const times = [15, 20, 25, 30];
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


// Function to generate exercises based on the goal
const generateExercises = (goal) => {
    const exercises = [];

    switch (goal.title) {
        case "Higher Intensity in all Workouts":
            exercises.push({
                name: "Burpees",
                sets: getRandomSets(),
                reps: getRandomReps(),
                time: getRandomRepTime()
            });
            exercises.push({
                name: "Stair Runs",
                sets: getRandomSets(),
                reps: 1,
                time: getRandomRepTime()
            });
            exercises.push({
                name: "Squats",
                sets: getRandomSets(),
                reps: getRandomReps(),
                time: getRandomRepTime(),
                weight: 135
            });
            return exercises;
        case "Increase Endurance and Stamina":
            exercises.push({
                name: "Jump Rope",
                time: getRandomCardioTime()
            });
            exercises.push({
                name: "Rowing Machine",
                time: getRandomCardioTime()
            });
            exercises.push({
                name: "Boxing",
                time: getRandomCardioTime()
            });
            return exercises;
        case "Weight Loss and Body Toning":
            exercises.push({
                name: "Crunches",
                sets: getRandomSets(),
                reps: getRandomReps(),
                time: getRandomRepTime()
            });
            exercises.push({
                name: "Lunges",
                sets: getRandomSets(),
                reps: getRandomReps(),
                time: getRandomRepTime()
            });
            exercises.push({
                name: "Supermans",
                sets: getRandomSets(),
                reps: getRandomReps(),
                time: getRandomRepTime()
            });
            return exercises;
        case "Mindful Meditation Practice":
            exercises.push({
                name: "Dynamic Stretching",
                time: getRandomStretchTime()
            });
            exercises.push({
                name: "Pilates",
                time: getRandomStretchTime()
            });
            exercises.push({
                name: "Yoga",
                time: getRandomStretchTime()
            });
            return exercises;
        case "Flexibility and Mobility Improvement":
            exercises.push({
                name: "Elliptical",
                time: getRandomCardioTime()
            });
            exercises.push({
                name: "Water Aerobics",
                time: getRandomCardioTime()
            });
            exercises.push({
                name: "Zumba",
                time: getRandomCardioTime()
            });
            return exercises;
        case "Run 30 miles by next weekend":
            exercises.push({
                name: "Running",
                time: getRandomCardioTime()
            });
            return exercises;
        case "Bike 500 miles by end of July":
            exercises.push({
                name: "Cycling",
                time: getRandomCardioTime()
            });
            return exercises;
        case "Swim 50 laps (1 mile) per week":
            exercises.push({
                name: "Swimming",
                time: getRandomCardioTime()
            });
            return exercises;
        case "Increase Strength and Build Muscle Mass":
            exercises.push({
                name: "Pushups",
                sets: getRandomSets(),
                reps: getRandomReps(),
                time: getRandomRepTime()
            });
            exercises.push({
                name: "Pullups",
                sets: getRandomSets(),
                reps: getRandomReps(),
                time: getRandomRepTime()
            });
            exercises.push({
                name: "Glute Bridges",
                sets: getRandomSets(),
                reps: getRandomReps(),
                time: getRandomRepTime()
            });
            exercises.push({
                name: "Calf Raises",
                sets: getRandomSets(),
                reps: getRandomReps(),
                time: getRandomRepTime()
            });
            return exercises;
        case "Reduce Body Fat and Increase Muscle Tone":
            exercises.push({
                name: "Lunges",
                sets: getRandomSets(),
                reps: getRandomReps(),
                time: getRandomRepTime()
            });
            exercises.push({
                name: "Squats",
                sets: getRandomSets(),
                reps: getRandomReps(),
                time: getRandomRepTime(),
                weight: 155
            });
            exercises.push({
                name: "Mountain Climbers",
                sets: getRandomSets(),
                reps: getRandomReps(),
                time: getRandomRepTime()
            });
            exercises.push({
                name: "Russian Twists",
                sets: getRandomSets(),
                reps: 20,
                time: getRandomRepTime()
            });
            return exercises;
        default: 
            return exercises;
    };
};

seedData();

// make sure you're in backend folder
// if not yet installed, npm install -g dotenv-cli
// to run the seed file, node -r dotenv/config seeders/seeds.js