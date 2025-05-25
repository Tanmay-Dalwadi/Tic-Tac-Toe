// Data structure for students (mock data)
const studentsByClass = {
    "10A": [
        { id: "S001", name: "Alice Johnson" },
        { id: "S002", name: "Bob Williams" },
        { id: "S003", name: "Charlie Brown" },
        { id: "S004", name: "Diana Prince" },
        { id: "S005", name: "Ethan Hunt" },
    ],
    "10B": [
        { id: "S006", name: "Fiona Gallagher" },
        { id: "S007", name: "George Costanza" },
        { id: "S008", name: "Hannah Montana" },
        { id: "S009", name: "Ivan Drago" },
        { id: "S010", name: "Jasmine Khan" },
    ],
    "11C": [
        { id: "S011", name: "Kyle Reese" },
        { id: "S012", name: "Laura Croft" },
        { id: "S013", name: "Michael Scott" },
        { id: "S014", name: "Nancy Drew" },
    ],
    "12D": [
        { id: "S015", name: "Oliver Queen" },
        { id: "S016", name: "Pam Beesly" },
        { id: "S017", name: "Quinn Fabray" },
        { id: "S018", name: "Rachel Green" },
    ]
};

// State to store current attendance for selected class
let currentAttendance = {}; // { studentId: "status" }

// Get DOM elements
const classSelect = document.getElementById('classSelect');
const attendanceDateInput = document.getElementById('attendanceDate');
const studentListDiv = document.getElementById('studentList');
const submitAttendanceBtn = document.getElementById('submitAttendance');
const messageBox = document.getElementById('messageBox');
const messageText = document.getElementById('messageText');
const messageBoxClose = document.getElementById('messageBoxClose');

// Set today's date as default
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
const day = String(today.getDate()).padStart(2, '0');
attendanceDateInput.value = `${year}-${month}-${day}`;

/**
 * Displays a custom message box with the given message.
 * Adds 'show' class for animation.
 * @param {string} message The message to display.
 */
function showMessageBox(message) {
    messageText.textContent = message;
    messageBox.classList.remove('hidden');
    // Trigger reflow to ensure transition plays
    void messageBox.offsetWidth; // Forces a reflow
    messageBox.classList.add('show');
}

// Event listener to hide custom message box
messageBoxClose.addEventListener('click', () => {
    messageBox.classList.remove('show');
    // Hide after transition
    messageBox.addEventListener('transitionend', function handler() {
        messageBox.classList.add('hidden');
        messageBox.removeEventListener('transitionend', handler);
    });
});

/**
 * Renders the list of students for a given class name.
 * Clears previous list and resets current attendance state.
 * @param {string} className The name of the class to render students for.
 */
function renderStudentList(className) {
    studentListDiv.innerHTML = ''; // Clear previous list
    currentAttendance = {}; // Reset attendance for new class

    const students = studentsByClass[className];
    if (!students || students.length === 0) {
        studentListDiv.innerHTML = '<div class="p-8 text-center text-gray-500 text-xl font-medium">No students found for this class.</div>';
        return;
    }

    students.forEach(student => {
        const studentRow = document.createElement('div');
        // Initial animation classes for each student row
        studentRow.className = 'student-row opacity-0 transform translate-y-2 transition-all duration-300 ease-out';
        studentRow.setAttribute('data-student-id', student.id);
        // Trigger fade-in after a slight delay for staggered effect
        setTimeout(() => studentRow.classList.remove('opacity-0', 'translate-y-2'), 50);

        const studentName = document.createElement('span');
        studentName.className = 'student-name text-xl font-semibold text-gray-800';
        studentName.textContent = student.name;
        studentRow.appendChild(studentName);

        const buttonsGroup = document.createElement('div');
        buttonsGroup.className = 'status-buttons-group flex gap-3'; /* Increased gap */

        // Define attendance statuses and their classes
        const statuses = [
            { label: 'Present', value: 'present', class: 'status-present' },
            { label: 'Absent', value: 'absent', class: 'status-absent' },
            { label: 'Late', value: 'late', class: 'status-late' },
            { label: 'Excused', value: 'excused', class: 'status-excused' }
        ];

        statuses.forEach(status => {
            const button = document.createElement('button');
            button.className = `status-button ${status.class}`;
            button.textContent = status.label;
            button.setAttribute('data-status', status.value);

            button.addEventListener('click', () => {
                // Remove 'status-selected' from all buttons in this row
                Array.from(buttonsGroup.children).forEach(btn => {
                    btn.classList.remove('status-selected');
                });
                // Add 'status-selected' to the clicked button
                button.classList.add('status-selected');
                // Update the current attendance state
                currentAttendance[student.id] = status.value;
                console.log(`Student ${student.name} (${student.id}) marked as: ${status.value}`);
            });
            buttonsGroup.appendChild(button);
        });

        studentRow.appendChild(buttonsGroup);
        studentListDiv.appendChild(studentRow);
    });
}

// Event listener for class selection change
classSelect.addEventListener('change', (event) => {
    const selectedClass = event.target.value;
    if (selectedClass) {
        renderStudentList(selectedClass);
    } else {
        studentListDiv.innerHTML = '<div class="p-8 text-center text-gray-500 text-xl font-medium">Please select a class to view students.</div>';
        currentAttendance = {}; // Clear attendance if no class is selected
    }
});

// Event listener for submit button
submitAttendanceBtn.addEventListener('click', () => {
    const selectedClass = classSelect.value;
    const attendanceDate = attendanceDateInput.value;

    if (!selectedClass) {
        showMessageBox("Please select a class before submitting attendance.");
        return;
    }
    if (!attendanceDate) {
        showMessageBox("Please select a date for attendance.");
        return;
    }

    const studentsInClass = studentsByClass[selectedClass];
    if (!studentsInClass || studentsInClass.length === 0) {
        showMessageBox("No students to submit attendance for in this class.");
        return;
    }

    // Check if all students have an attendance status
    let allMarked = true;
    const finalAttendanceRecords = [];
    studentsInClass.forEach(student => {
        const status = currentAttendance[student.id] || "unmarked";
        if (status === "unmarked") {
            allMarked = false;
        }
        finalAttendanceRecords.push({
            studentId: student.id,
            studentName: student.name,
            status: status
        });
    });

    if (!allMarked) {
        showMessageBox("Please mark attendance for all students before submitting.");
        return;
    }

    console.log("--- Submitting Attendance ---");
    console.log(`Class: ${selectedClass}`);
    console.log(`Date: ${attendanceDate}`);
    console.log("Attendance Records:", finalAttendanceRecords);
    showMessageBox("Attendance submitted successfully! Check the console for details.");

    // In a real application, this data would be sent to a backend server (e.g., via fetch API)
    // fetch('/api/submit-attendance', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //         class: selectedClass,
    //         date: attendanceDate,
    //         records: finalAttendanceRecords
    //     })
    // }).then(response => response.json())
    //   .then(data => console.log('Success:', data))
    //   .catch(error => console.error('Error:', error));
});

// Initial fade-in for the main container on page load
document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.querySelector('.container');
    if (mainContainer) {
        setTimeout(() => {
            mainContainer.classList.remove('opacity-0', 'scale-95');
        }, 150); // Slight delay to allow page load
    }

    // Initial render if a class is pre-selected (though none are by default)
    if (classSelect.value) {
        renderStudentList(classSelect.value);
    }
});