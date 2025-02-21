let goal = 0;
let totalIntake = 0;
let dailyHistory = JSON.parse(localStorage.getItem("dailyHistory")) || {};
let previousIntake = JSON.parse(localStorage.getItem("previousIntake")) || [];

function addWater(amount) {
    totalIntake += amount;
    saveDailyHistory(amount);
    updateDisplay();
}

function addManual() {
    let amount = parseInt(document.getElementById("manual").value);
    if (!isNaN(amount)) {
        totalIntake += amount;
        saveDailyHistory(amount);
        updateDisplay();
    }
}

function saveDailyHistory(amount) {
    let currentDate = new Date().toLocaleDateString();
    if (!dailyHistory[currentDate]) {
        dailyHistory[currentDate] = [];
    }
    dailyHistory[currentDate].push(amount);
    localStorage.setItem("dailyHistory", JSON.stringify(dailyHistory));
}

function updateDisplay() {
    document.getElementById("total").innerText = totalIntake;
}

function showHistory() {
    let historyData = "<h2>Daily Water Intake History</h2>";
    for (let date in dailyHistory) {
        historyData += `<p><b>${date}:</b> ${dailyHistory[date].reduce((a, b) => a + b, 0)} ml</p>`;
    }

    document.getElementById("history-content").innerHTML = historyData;
    document.getElementById("history-popup").style.display = "block";
}

function closeHistory() {
    document.getElementById("history-popup").style.display = "none";
}
