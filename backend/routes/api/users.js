const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Goal = mongoose.model('Goal');
const ExerciseEntry = mongoose.model('ExerciseEntry');
const passport = require('passport');
const { loginUser, restoreUser, requireUser } = require('../../config/passport');
const { isProduction } = require('../../config/keys');
const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');
const validateGoalInput = require('../../validations/goals');
const validateExerciseEntryInput = require('../../validations/exerciseEntries');


// Table of Contents: (+/- a few lines)
// Auth until line 106
// Goals from line 114 to 218
// Exercise Entries 235


// GET /api/users - get all users
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (err) {
    next(err);
  }
});

// POST /api/users/register
router.post('/register', validateRegisterInput, async (req, res, next) => {
  // Check to make sure no one has already registered with the proposed email or
  // username.
  const user = await User.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }]
  });

  if (user) {
    // Throw a 400 error if the email address and/or email already exists
    const err = new Error("Validation Error");
    err.statusCode = 400;
    const errors = {};
    if (user.email === req.body.email) {
      errors.email = "A user has already registered with this email";
    }
    if (user.username === req.body.username) {
      errors.username = "A user has already registered with this username";
    }
    err.errors = errors;
    return next(err);
  }

  // Otherwise create a new user
  const newUser = new User({
    username: req.body.username,
    email: req.body.email
  });

  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(req.body.password, salt, async (err, hashedPassword) => {
      if (err) throw err;
      try {
        newUser.hashedPassword = hashedPassword;
        const user = await newUser.save();
        return res.json(await loginUser(user));
      }
      catch (err) {
        next(err);
      }
    })
  });
});

// POST /api/users/login
router.post('/login', validateLoginInput, async (req, res, next) => {
  passport.authenticate('local', async function (err, user) {
    if (err) return next(err);
    if (!user) {
      const err = new Error('Invalid credentials');
      err.statusCode = 400;
      err.errors = { email: "Invalid credentials" };
      return next(err);
    }
    return res.json(await loginUser(user));
  })(req, res, next);
});

router.get('/current', restoreUser, (req, res) => {
  if (!isProduction) {
    // In development, allow React server to gain access to the CSRF token
    // whenever the current user information is first loaded into the
    // React application
    const csrfToken = req.csrfToken();
    res.cookie("CSRF-TOKEN", csrfToken);
  }
  if (!req.user) return res.json(null);
  res.json({
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email
  });
});

router.get('/:userId', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return res.json(user);
  } catch (err) {
    next(err);
  }
});

// since goals are embedded in Users, all goal routes will be 
// written out in the User.js file. eEntries under goals


// CREATE GOAL (post)
router.post('/:userId/goals', requireUser, validateGoalInput, async (req, res, next) => {
  try {
    const newGoal = new Goal({
      title: req.body.title,
      description: req.body.description,
      deadline: req.body.deadline,
      completionDate: req.body.completionDate
    });

    let user = await User.findById(req.params.userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    user.goals.push(newGoal);
    user.save();

    // return res.json({ message: 'it finally fucking works maybe?'})
    return res.json(user.goals.slice(-1));
  } catch (err) {
    next(err);
  }
});

// SHOW ONE SPECIFIC GOAL (get)
router.get('/:userId/goals/:goalId', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    const goal = user.goals.filter(goal => goal.id === req.params.goalId)[0];

    return res.json(goal || { message: 'Goal not found' });
  } catch (err) {
    next(err);
  }
});

// EDIT A GOAL (patch)
router.patch('/:userId/goals/:goalId', requireUser, validateGoalInput, async (req, res, next) => {
  try {
    let user = await User.findById(req.params.userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const oldGoal = user.goals.filter(goal => goal.id === req.params.goalId)[0];
    oldGoal.title = req.body.title || oldGoal.title
    oldGoal.description = req.body.description || oldGoal.description;
    oldGoal.deadline = req.body.deadline || oldGoal.deadline;
    oldGoal.completionDate = req.body.completionDate || oldGoal.completionDate;

    user.save();

    return res.json(oldGoal);
  } catch (err) {
    next(err);
  }
});


// DELETE ONE GOAL (delete)
router.delete('/:userId/goals/:goalId', requireUser, async (req, res, next) => {
  try {
    let user = await User.findById(req.params.userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const goalsArray = user.goals.filter(goal => goal.id !== req.params.goalId);
    user.goals = goalsArray;

    user.save();

    return res.json({ message: 'Goal successfully deleted' });
  } catch (err) {
    next(err);
  }
});

// SHOW ALL GOALS FOR ONE USER (index? get?)
router.get('/:userId/goals', requireUser, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return res.json(user.goals);
  } catch (err) {
    next(err);
  }
});

module.exports = router;


// due to our nested/embedded structure, it seems the vast majority of 
// routes will be in this file lol

// EXERCISE ENTRIES 

// CREATE ENTRY (post)
router.post('/:userId/goals/:goalId/entries', requireUser, validateExerciseEntryInput, async (req, res, next) => {
  try {
    const newEntry = new ExerciseEntry({
      date: req.body.date,
      note: req.body.note,
      rating: req.body.rating
    });

    let user = await User.findById(req.params.userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    let goal = user.goals.filter(goal => goal.id === req.params.goalId)[0];
    goal.exerciseEntries.push(newEntry);
    user.save();

    return res.json(goal.exerciseEntries.slice(-1));
  } catch (err) {
    next(err);
  }
})


// SHOW ENTRY (get)
router.get('/:userId/goals/:goalId/entries/:entryId', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const goal = user.goals.filter(goal => goal.id === req.params.goalId)[0];
    const entry = goal.exerciseEntries.filter(entry => entry.id === req.params.entryId)[0];
    const formattedEntry = {
      [entry.id]: { exerciseEntry: entry, exerciseEntryId: entry.id, setter: user.username, setterId: user.id, goalId: goal.id }
    }

    return res.json(Object.keys(formattedEntry).length ? formattedEntry : { message: 'Entry not found' })
  } catch (err) {
    next(err);
  }
});


// per goal ENTRY INDEX (get)
router.get('/:userId/goals/:goalId/entries', requireUser, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    const entries = user.goals.filter(goal => goal.id === req.params.goalId)[0].exerciseEntries;

    return res.json(entries || { message: 'Entry not found' });
  } catch (err) {
    next(err);
  }
});

// per user ENTRY INDEX (get)
router.get('/:userId/entries', requireUser, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const entries = {};
    user.goals.forEach(goal => 
      goal.exerciseEntries.forEach(entry => 
        entries[entry.id] = { exerciseEntry: entry, exerciseEntryId: entry.id, setter: user.username, setterId: user.id, goalId: goal.id  }))
    
    return res.json(Object.keys(entries).length ? entries : { message: 'Entry not found'})
  } catch (err) {
    next(err);
  }
});


// EDIT AN ENTRY (patch)
router.patch('/:userId/goals/:goalId/entries/:entryId', requireUser, validateExerciseEntryInput, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const oldEntry = user.goals.filter(goal => goal.id === req.params.goalId)[0].exerciseEntries.filter(entry => entry.id === req.params.entryId)[0];
    oldEntry.date = req.body.date || oldEntry.date
    oldEntry.note = req.body.note || oldEntry.note
    oldEntry.rating = req.body.rating || oldEntry.rating
    oldEntry.exercises = req.body.exercises || oldEntry.exercises

    user.save();

    return res.json(oldEntry);
  } catch (err) {
    next(err);
  }
});


// DELETE ENTRY (delete)
router.delete('/:userId/goals/:goalId/entries/:entryId', requireUser, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const goalObj = user.goals.filter(goal => goal.id === req.params.goalId)[0];
    const otherEntries = goalObj.exerciseEntries.filter(entry => entry.id !== req.params.entryId);

    goalObj.exerciseEntries = otherEntries;

    user.save();

    return res.json({ message: 'Entry successfully deleted' });
  } catch (err) {
    next(err);
  }
});