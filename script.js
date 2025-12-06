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

  let table = document.getElementById("sgpaTable");
  let row = table.insertRow(-1);

  row.innerHTML = `
        <td><input type="text" placeholder="SUB"></td>
        <td><input type="number" min="0" max="50" oninput="updateRow(this)"></td>
        <td><input type="number" min="0" max="50" oninput="updateRow(this)"></td>
        <td class="total">0</td>
        <td class="credit">${credit}</td>
        <td class="grade">--</td>
        <td class="gpa">0</td>
        <td><button onclick="deleteRow(this)" style="background:red;color:white;padding:5px 10px;border:none;border-radius:5px;">X</button></td>
    `;
}

// ------------------ DELETE ROW ------------------
function deleteRow(btn) {
  btn.parentNode.parentNode.remove();
}

// ------------------ UPDATE ROW ------------------
function updateRow(input) {
  let row = input.parentNode.parentNode;

  let cie = Number(row.children[1].children[0].value);
  let see = Number(row.children[2].children[0].value);

  let total = cie + see;
  row.querySelector(".total").innerText = total;

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

  document.getElementById("sgpaBox").innerText = `SGPA: ${
    isNaN(sgpa) ? "--" : sgpa.toFixed(2)
  }  (Credits: ${totalCredits})`;
}

// ------------------ SAVE / LOAD ------------------
function saveData() {
  localStorage.setItem(
    "sgpaTableData",
    document.getElementById("sgpaTable").innerHTML
  );
  alert("Saved!");
}

function loadData() {
  let saved = localStorage.getItem("sgpaTableData");
  if (saved) {
    document.getElementById("sgpaTable").innerHTML = saved;
    alert("Loaded!");
  } else {
    alert("No data found");
  }
}
