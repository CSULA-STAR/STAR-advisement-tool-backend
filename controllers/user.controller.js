const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

const config = require('../../config.json');
const util = require('../util');

// Register a new user.
// POST /users/register
const registerUser = async (req, res) => {
    const { body } = req;
    const { username, password } = body;

    if (!username || !password) {
        return res
            .status(400)
            .json({ error: 'Username and Password are required' });
    }

    try {
        // gen salt which changes each time the function is called
        const salt = await bcrypt.genSalt(10);

        // use the passwaord + salt to create a hashed password
        const hashed = await bcrypt.hash(password, salt);

        const userDoc = new User({ ...body, password: hashed });
        const saved = await userDoc.save();

        // toObject() converts a Mongoose doc into a plain javascript object
        const user = saved.toObject();
        // remove the password key
        delete user.password;

        res.json(user);
    } catch (error) {
        if (error.message.indexOf('duplicate key error') !== -1) {
            res.status(400).json({ error: `Username: ${body.username} is already taken.`});
        } else {
            res.status(500).json({ error: error.toString() });
        }
    }
};

// Login an exsiting user
// POST /users/login
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({
            username: username.toLowerCase()
        }).select('+password');

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const authenticated = await bcrypt.compare(
            password,
            user.password
        );

        if (authenticated) {
            const token = jwt.sign(
                { id: user._id, username: user.username },
                config.jwtsecret,
                { expiresIn: '24h' }
            );

            // toObject() converts a Mongoose doc into a plain javascript object
            const authorized = user.toObject();
            // remove the password key
            delete authorized.password;

            res.header('Authorization', `Bearer ${token}`).json(authorized);
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

// Retrieve user information by ID.
// GET  /users/:id
const getUserById  = async (req, res) => {
    const { params, query } = req;
    const id = params.id;

    // get boolean from query params strings
    const includeSnippets = util.queryToBoolean(query.snippets);
    const includeBookmarks = util.queryToBoolean(query.bookmarks);

    let user = null;
    try {
        if (includeSnippets && includeBookmarks) {
            user = await User.findOne({
                _id: id
            }).populate({
                path: 'snippets',
                populate: 'bookmark_count'
            }).populate('bookmarks');

        } else if (includeSnippets) {
            user = await User.findOne({
                _id: id
            }).populate('snippets');

        } else if (includeBookmarks) {
            user = await User.findOne({
                _id: id
            }).populate('bookmarks');

        } else {
            user = await User.findOne({_id: id});
        }

        if (user){
            res.json(user);
        } else {
            res.status(404).json({ error: `No user found by id: ${id}` });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

// Update user information by ID.
// PUT  /users/:id
const updateUserByID  = async (req, res) => {
    const { params, body } = req;
    const id = params.id;

    try {
        // findOneAndUpdate returns the actual mongo document
        // and { new: true } indicates that we get the updated version of the document
        const user = await User.findOneAndUpdate({ _id: id }, body, {
            new: true
        });

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: `No User found by id: ${id}` });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserById,
    updateUserByID
};