// ------------------ GRADE LOGIC ------------------
function gradeFromTotal(total) {
  if (total >= 90) return 10;
  if (total >= 80) return 9;
  if (total >= 70) return 8;
  if (total >= 60) return 7;
  if (total >= 50) return 6;
  if (total >= 40) return 5;
  return 0;
}

function computeContribution(credit, gradePoint) {
  return credit * gradePoint;
}

// ------------------ ADD SUBJECT ------------------
function addSubject(data = null) {
  let credit;

  if (data) credit = data.credit;
  else {
    credit = prompt("Enter credit (1–4):");
    if (!credit || credit < 1 || credit > 4) return;
  }

  const table = document.getElementById("sgpaTable");
  const row = table.insertRow(-1);

  row.innerHTML = `
        <td><input value="${
          data?.subject || ""
        }" oninput="updateRow(this)"></td>
        <td><input type="number" min="0" max="50" value="${
          data?.cie || ""
        }" oninput="updateRow(this)"></td>
        <td><input type="number" min="0" max="50" value="${
          data?.see || ""
        }" oninput="updateRow(this)"></td>
        <td class="total">${data?.total || 0}</td>
        <td class="credit">${credit}</td>
        <td class="grade">${data?.grade || "--"}</td>
        <td class="gpa">${data?.contribution || 0}</td>
        <td><button onclick="deleteRow(this)" style="background:red;color:white;border:none;padding:5px 10px;border-radius:5px;">X</button></td>
    `;

  if (data) updateRow(row.children[1].children[0]);
}

// ------------------ DELETE ROW ------------------
function deleteRow(btn) {
  btn.parentNode.parentNode.remove();
}

// ------------------ UPDATE ROW ------------------
function updateRow(input) {
  const row = input.parentNode.parentNode;

  const cie = Number(row.children[1].children[0].value);
  const see = Number(row.children[2].children[0].value);
  const total = cie + see;

  row.querySelector(".total").innerText = isNaN(total) ? 0 : total;

  const grade = gradeFromTotal(total);
  row.querySelector(".grade").innerText = grade;

  const credit = Number(row.querySelector(".credit").innerText);
  const contribution = computeContribution(credit, grade);

  row.querySelector(".gpa").innerText = contribution;
}

// ------------------ CALCULATE SGPA ------------------
function calculateSGPA() {
  const rows = document.querySelectorAll("#sgpaTable tr");
  let totalCredits = 0,
    totalContribution = 0;

  rows.forEach((row, i) => {
    if (i === 0) return;
    const credit = Number(row.querySelector(".credit").innerText);
    const contrib = Number(row.querySelector(".gpa").innerText);
    totalCredits += credit;
    totalContribution += contrib;
  });

  const sgpa = totalContribution / totalCredits;
  document.getElementById("sgpaBox").innerText = `SGPA: ${
    isNaN(sgpa) ? "--" : sgpa.toFixed(2)
  } (Credits: ${totalCredits})`;
}

// ------------------ SAVE ------------------
function saveData() {
  const rows = document.querySelectorAll("#sgpaTable tr");
  const data = [];

  rows.forEach((row, i) => {
    if (i === 0) return;
    data.push({
      subject: row.children[0].children[0].value,
      cie: row.children[1].children[0].value,
      see: row.children[2].children[0].value,
      total: row.querySelector(".total").innerText,
      credit: row.querySelector(".credit").innerText,
      grade: row.querySelector(".grade").innerText,
      contribution: row.querySelector(".gpa").innerText,
    });
  });

  localStorage.setItem("sgpaData", JSON.stringify(data));
  alert("Saved!");
}

// ------------------ LOAD ------------------
function loadData() {
  const saved = localStorage.getItem("sgpaData");
  if (!saved) return alert("No saved data found.");

  const data = JSON.parse(saved);

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

  data.forEach((d) => addSubject(d));
  alert("Loaded!");
}

// ------------------ DARK MODE ------------------
function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
}
