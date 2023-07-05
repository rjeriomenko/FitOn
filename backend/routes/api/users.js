const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Follow = mongoose.model('Follow');
const passport = require('passport');
const { singleFileUpload, singleMulterUpload } = require("../../awsS3");
const { loginUser, restoreUser, requireUser } = require('../../config/passport');
const { isProduction } = require('../../config/keys');
const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');


// GET /api/users - get all users
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find({});
    const usersObj = {};

    users.forEach(user => usersObj[user._id] = user);
    return res.json(usersObj);
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
    email: req.user.email,
    currentGoal: req.user.currentGoal,
    imgUrl: req.user.imgUrl
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
    return res.json({ [user._id]: user });
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const users = await User.find({});
    const usersObj = {};

    users.forEach(user => usersObj[user._id] = user);
    return res.json(usersObj);
  } catch (err) {
    next(err);
  }
});

// get people you follow
router.get('/followed', requireUser, async (req, res, next) => {
  try {
    const follows = await Follow.find({ follower: req.user._id });

    if (follows.length === 0) {
      return res.json({ message: 'No follows found' });
    }

    const followedUsers = await Promise.all(follows.map(async (follow) => {
      let searchId = follow.followedUser;
      const user = await User.findById(searchId).select('-hashedPassword -currentGoal');
      return user;
    }));


    let usersObj = {};
    followedUsers.forEach(user => usersObj[user._id] = user);

    return res.json(usersObj);
  } catch (err) {
    next(err);
  }
});

//edit user
router.patch('/:userId', requireUser, singleMulterUpload("image"), async (req, res, next) => {
  try {
    if (req.params.userId.toString() !== req.user._id.toString()) {
      const error = new Error('You have no power here, Gandalf the Grey');
      error.statusCode = 403;
      throw error;
    }

    let user = await User.findById(req.params.userId).select('-hashedPassword -currentGoal');

    const imgUrl = req.file ?
      await singleFileUpload({ file: req.file, public: true }) :
      false;

    user.username = req.body.username || user.username
    user.imgUrl = imgUrl || user.imgUrl;

    await user.save();

    return res.json(user)
  } catch (err) {
    next(err);
  }
});

module.exports = router;