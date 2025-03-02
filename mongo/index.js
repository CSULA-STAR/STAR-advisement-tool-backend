const mongoose = require('mongoose');

// BUILD THE MONGO URI CONNECTION STRING
const { username, password, projectname, serverURL } = require('../config.json');
const mongoURL = `mongodb+srv://${username}:${password}@${serverURL}/${projectname}?retryWrites=true&w=majority`;

// CONNECT TO MONGO
const connectDB = async () => {
    try {
        await mongoose.connect(mongoURL);
        console.log('Connected to Mongo DB');
    } catch (error) {
        console.log(error);
    }
};

module.exports = { connectDB };