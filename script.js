let goal = 0;
let totalIntake = 0;
let reminderInterval = null;

// Request Notification Permission
function enableNotifications() {
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                alert("Notifications enabled! Set a reminder.");
            } else {
                alert("You need to allow notifications in Safari settings.");
            }
        });
    } else {
        alert("Your browser does not support notifications.");
    }
}

// Set Reminder with Correct Timing
function setReminder() {
    let time = parseInt(document.getElementById("reminder-time").value);
    if (!isNaN(time) && time > 0) {
        if (reminderInterval) clearInterval(reminderInterval);

        alert("Reminder set! You will get notifications every " + time + " minutes.");

        localStorage.setItem("reminderTime", time);

        reminderInterval = setInterval(() => {
            let currentHour = new Date().getHours();
            if (currentHour >= 8 && currentHour <= 22) {
                if (document.visibilityState === "visible") {
                    new Notification("Time to drink water!", {
                        body: "Stay hydrated! 🥤",
                        icon: "icon.png"
                    });
                } else {
                    alert("Time to drink water! Stay hydrated.");
                }
            }
        }, time * 60 * 1000);
    }
}

// Save Daily Intake to History at 01:00 AM
function checkAndSaveDailyIntake() {
    let lastReset = localStorage.getItem("lastResetDate");
    let currentDate = new Date();
    let currentHour = currentDate.getHours();

    let todayDateString = currentDate.toISOString().split("T")[0]; // Get current date

    if (lastReset !== todayDateString && currentHour >= 1) {
        let history = JSON.parse(localStorage.getItem("waterHistory")) || [];
        history.push({ date: todayDateString, intake: totalIntake });

        localStorage.setItem("waterHistory", JSON.stringify(history));
        localStorage.setItem("lastResetDate", todayDateString);

        totalIntake = 0; // Reset intake for the new day
        updateDisplay();
    }
}

// Load & Display History
function loadHistory() {
    let history = JSON.parse(localStorage.getItem("waterHistory")) || [];
    let historyList = document.getElementById("history-list");

    historyList.innerHTML = ""; // Clear existing list
    history.forEach(entry => {
        let listItem = document.createElement("li");
        listItem.textContent = `${entry.date}: ${entry.intake} ml`;
        historyList.appendChild(listItem);
    });
}

// Clear History
function clearHistory() {
    if (confirm("Are you sure you want to clear history?")) {
        localStorage.removeItem("waterHistory");
        loadHistory();
    }
}

// Toggle History Section
function toggleHistory() {
    let historySection = document.getElementById("history-section");
    historySection.style.display = historySection.style.display === "none" ? "block" : "none";
}

// Load Data & Reset Daily Intake on Page Load
window.onload = function () {
    goal = parseInt(localStorage.getItem("waterGoal")) || 0;
    totalIntake = parseInt(localStorage.getItem("waterIntake")) || 0;
    let savedReminderTime = localStorage.getItem("reminderTime");

    if (savedReminderTime) {
        document.getElementById("reminder-time").value = savedReminderTime;
        setReminder();
    }

    checkAndSaveDailyIntake();
    loadHistory();
    updateDisplay();
};
