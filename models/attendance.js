const mongoose = require('mongoose');

// Define the attendance schema
const attendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Present', 'Absent'],
        required: true
    }
});

// Create the Attendance model from the schema
const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
