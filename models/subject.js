const mongoose = require('mongoose');

// Define the schema for the Subject model
const subjectSchema = new mongoose.Schema({
    subjectName: {
        type: String,
        required: true
    },
    subjectCode: {
        type: String,
        required: true
    }
});

// Create the model from the schema
const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
