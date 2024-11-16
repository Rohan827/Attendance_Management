// app.js

// This function adds interactivity to the form (you can modify it as needed)
document.addEventListener("DOMContentLoaded", function () {

    // Form submission behavior (example for mark attendance form)
    const markAttendanceForm = document.querySelector("#markAttendanceForm");
    if (markAttendanceForm) {
        markAttendanceForm.addEventListener("submit", function (e) {
            const studentId = document.querySelector("#studentId").value;
            const subjectId = document.querySelector("#subjectId").value;
            const status = document.querySelector("#status").value;

            // Ensure all fields are filled before submitting
            if (!studentId || !subjectId || !status) {
                e.preventDefault(); // Prevent form submission
                alert("Please fill all the fields!");
            }
        });
    }

    // Optionally, add any dynamic behavior here, e.g., form field validation, modal popups, etc.

});
