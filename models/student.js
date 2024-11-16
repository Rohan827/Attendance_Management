const mongoose = require('mongoose');

// Student schema
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rollNo: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    }
});

// Create and export the Student model
const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
