const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Student = require('./models/student');  // Adjust path if needed
const Subject = require('./models/subject');  // Adjust path if needed
const Attendance = require('./models/attendance');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));  // Parse form data
app.use(express.static('public'));  // Serve static files like CSS

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/attendanceSystem')
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.log('MongoDB connection error:', err));

// Route for the home page (root path)
app.get('/', (req, res) => {
    res.render('index');  // Render the home page (index.ejs)
});

// Route for student registration form
app.get('/registerStudent', (req, res) => {
    res.render('registerStudent');
});

// Handle student registration form submission
app.post('/registerStudent', async (req, res) => {
    const { name, rollNo, branch } = req.body;
    if (!name || !rollNo || !branch) {
        return res.status(400).send("All fields are required.");
    }

    try {
        const existingStudent = await Student.findOne({ rollNo });
        if (existingStudent) {
            return res.send('Student with this roll number already exists.');
        }

        const newStudent = new Student({
            name: name,
            rollNo: rollNo,
            branch: branch
        });

        await newStudent.save();
        res.redirect('/registerStudent');  // Redirect after successful registration
    } catch (error) {
        console.error('Error registering student:', error);
        res.status(500).send('Error occurred during registration.');
    }
});

// Route for subject registration form
app.get('/registerSubject', (req, res) => {
    res.render('registerSubject');
});

// Handle subject registration form submission
app.post('/registerSubject', (req, res) => {
    const { subjectName, subjectCode } = req.body;

    if (!subjectName || !subjectCode) {
        return res.status(400).send("Subject Name and Code are required.");
    }

    const newSubject = new Subject({
        subjectName: subjectName,
        subjectCode: subjectCode
    });

    newSubject.save()
    .then(() => res.redirect('/'))  // Redirect after successful registration
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error occurred during registration.");
    });
});

// Route for marking attendance
// Route for marking attendance
app.get('/markAttendance', async (req, res) => {
    try {
        // Get all students and subjects from the database
        const students = await Student.find();
        const subjects = await Subject.find();
        
        // Render the markAttendance page with students and subjects data
        res.render('markAttendance', {
            students,
            subjects,
            errorMessage: null,  // Pass errorMessage as null initially
            successMessage: null // Pass successMessage as null initially
        });
    } catch (err) {
        console.error("Error fetching students/subjects:", err);
        res.status(500).send("Error fetching students or subjects.");
    }
});



// Handle attendance submission
// Handle attendance submission
// Handle attendance submission
app.post('/markAttendance', async (req, res) => {
    try {
        // Get data from the form submission
        const { studentId, subjectId, status, date } = req.body;

        // Log the form data for debugging
        console.log("Student ID:", studentId);
        console.log("Subject ID:", subjectId);
        console.log("Status:", status);
        console.log("Date:", date);

        // Validate that all fields are provided
        if (!studentId || !subjectId || !status || !date) {
            return res.status(400).send("All fields are required");
        }

        // Create a new attendance record
        const newAttendance = new Attendance({
            student: studentId,
            subject: subjectId,
            status: status,
            date: date // Save the date
        });

        // Save the attendance record to the database
        await newAttendance.save();

        // After saving, render the same markAttendance page with students and subjects data
        const students = await Student.find();
        const subjects = await Subject.find();
        res.render('markAttendance', { students, subjects, successMessage: "Attendance marked successfully!" });
    } catch (error) {
        console.error("Error saving attendance:", error);
        res.status(500).send("Error saving attendance");
    }
});




// Route to view attendance
// Route to view attendance for a specific subject and student
// Route to view attendance for a specific subject and date
// Route to view attendance for a specific subject and student
app.get('/viewAttendance', async (req, res) => {
    try {
        // Get the subjectId and date from the query parameters
        const { subjectId, date } = req.query;

        // Find all subjects for the dropdown
        const subjects = await Subject.find();

        // Check if both subjectId and date are provided in the query
        if (subjectId && date) {
            // Filter attendance records by subject and date
            const attendanceRecords = await Attendance.find({
                subject: subjectId,
                date: date
            })
            .populate('subject')
            .populate('student');

            // Render the view with filtered attendance records
            res.render('viewAttendance', {
                attendanceRecords,
                subjects,
                subjectId,
                date
            });
        } else {
            // If no filters are provided, render with an empty list or a prompt
            res.render('viewAttendance', {
                attendanceRecords: [],
                subjects,
                subjectId: '',
                date: ''
            });
        }

    } catch (err) {
        console.error("Error fetching attendance:", err);
        res.status(500).send("Error fetching attendance data.");
    }
});



// Route to handle deleting an attendance entry
// Route to handle attendance deletion
app.post('/deleteAttendance/:id', async (req, res) => {
    try {
        const attendanceId = req.params.id;
        
        // Find and delete the attendance record by ID
        const deletedAttendance = await Attendance.findByIdAndDelete(attendanceId);

        if (!deletedAttendance) {
            return res.status(404).send("Attendance record not found.");
        }

        // Redirect back to the attendance view page with a success message
        res.redirect('/viewAttendance');
    } catch (error) {
        console.error("Error deleting attendance:", error);
        res.status(500).send("Error occurred while deleting the attendance record.");
    }
});



// Start the server
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
