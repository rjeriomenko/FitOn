const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    goals: [
        {
            type: GoalSchema,
            required: false
        }
    ],
    routines: [
        {
            type: RoutineSchema,
            required: false
        }
    ],
}, {
    timestamps: true
});

const GoalSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    deadline: {
        type: String,
        required: false
    },
    exerciseEntries: [
        {
            type: ExerciseEntrySchema,
            required: false
        }
    ]
})

const ExerciseEntrySchema = new Schema({
    exercises: [
        {
            type: ExerciseSchema,
            required: true
        }
    ],
    date: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: false
    }
})

const RoutineSchema = new Schema({
    exercises: [
        {
            type: ExerciseSchema,
            required: true
        }
    ]
})

const ExerciseSchema = new Schema({
    sets: {
        type: String,
        required: function() {
            return (!(this.reps || this.time) || !!(this.reps)) 
        }
    },
    reps: {
        type: String,
        required: function () {
            return (!(this.sets || this.time) || !!(this.sets))
        }
    },
    time: {
        type: String,
        required: function () {
            return !(this.reps || this.time)
        }
    },
    name: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('User', userSchema);