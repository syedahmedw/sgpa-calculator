// ------------------ GRADE POINT RULES ------------------
function gradeFromTotal(total) {
    if (total >= 90) return 10;
    if (total >= 80) return 9;
    if (total >= 70) return 8;
    if (total >= 60) return 7;
    if (total >= 50) return 6;
    if (total >= 40) return 5;
    return 0;
}

// Contribution = credit × gradePoint
function computeContribution(credit, gradePoint) {
    return credit * gradePoint;
}

// ------------------ ADD SUBJECT ------------------
function addSubject() {
    let credit = prompt("Enter credit for this subject (1 to 4):");
    if (!credit || isNaN(credit) || credit < 1 || credit > 4) {
        alert("Enter a valid credit number between 1 and 4.");
        return;
    }
    credit = parseInt(credit);

    insertRow({
        subject: "",
        cie: "",
        see: "",
        total: 0,
        credit: credit,
        grade: "--",
        contribution: 0
    });
}

// ------------------ INSERT ROW FROM DATA ------------------
function insertRow(data) {
    let table = document.getElementById("sgpaTable");
    let row = table.insertRow(-1);

    row.innerHTML = `
        <td><input value="${data.subject}" oninput="updateRow(this)"></td>
        <td><input type="number" value="${data.cie}" min="0" max="50" oninput="updateRow(this)"></td>
        <td><input type="number" value="${data.see}" min="0" max="50" oninput="updateRow(this)"></td>
        <td class="total">${data.total}</td>
        <td class="credit">${data.credit}</td>
        <td class="grade">${data.grade}</td>
        <td class="gpa">${data.contribution}</td>
        <td><button onclick="deleteRow(this)" style="background:red;color:white;padding:5px 10px;border:none;border-radius:5px;">X</button></td>
    `;

    // Recalculate after inserting
    if (data.cie !== "" && data.see !== "") {
        updateRow(row.children[1].children[0]);
    }
}

// ------------------ DELETE ROW ------------------
function deleteRow(btn) {
    btn.parentNode.parentNode.remove();
}

// ------------------ UPDATE ROW ------------------
function updateRow(input) {
    let row = input.parentNode.parentNode;

    let subject = row.children[0].children[0].value;
    let cie = Number(row.children[1].children[0].value);
    let see = Number(row.children[2].children[0].value);

    let total = cie + see;
    row.querySelector(".total").innerText = isNaN(total) ? 0 : total;

    let gradePoint = gradeFromTotal(total);
    row.querySelector(".grade").innerText = gradePoint;

    let credit = Number(row.querySelector(".credit").innerText);
    let contribution = computeContribution(credit, gradePoint);

    row.querySelector(".gpa").innerText = contribution;
}

// ------------------ CALCULATE SGPA ------------------
function calculateSGPA() {
    let rows = document.querySelectorAll("#sgpaTable tr");
    let totalContribution = 0;
    let totalCredits = 0;

    rows.forEach((row, index) => {
        if (index === 0) return;

        const credit = Number(row.querySelector(".credit")?.innerText || 0);
        const contrib = Number(row.querySelector(".gpa")?.innerText || 0);

        totalCredits += credit;
        totalContribution += contrib;
    });

    let sgpa = totalContribution / totalCredits;

    document.getElementById("sgpaBox").innerText =
        `SGPA: ${isNaN(sgpa) ? "--" : sgpa.toFixed(2)}  (Credits: ${totalCredits})`;
}

// ------------------ SAVE DATA (JSON) ------------------
function saveData() {
    let rows = document.querySelectorAll("#sgpaTable tr");
    let data = [];

    rows.forEach((row, index) => {
        if (index === 0) return;

        data.push({
            subject: row.children[0].children[0].value,
            cie: row.children[1].children[0].value,
            see: row.children[2].children[0].value,
            total: row.querySelector(".total").innerText,
            credit: row.querySelector(".credit").innerText,
            grade: row.querySelector(".grade").innerText,
            contribution: row.querySelector(".gpa").innerText
        });
    });

    localStorage.setItem("sgpaData", JSON.stringify(data));
    alert("Saved!");
}

// ------------------ LOAD DATA (JSON) ------------------
function loadData() {
    let saved = localStorage.getItem("sgpaData");
    if (!saved) {
        alert("No saved data found.");
        return;
    }

    let data = JSON.parse(saved);

    // Clear table except header
    document.getElementById("sgpaTable").innerHTML = `
        <tr>
            <th>SUBJECT</th>
            <th>CIE</th>
            <th>SEE</th>
            <th>TOTAL</th>
            <th>CREDIT</th>
            <th>GRADE</th>
            <th>CONTRIBUTION</th>
            <th>DELETE</th>
        </tr>
    `;

    // Rebuild each row
    data.forEach(item => insertRow(item));

    alert("Loaded!");
}
