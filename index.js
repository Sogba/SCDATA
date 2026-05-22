let tableData = [];
let visibleColumns = [];
let sortDirection = {};

fetch("output.csv")
  .then(response => response.text())
  .then(csv => {

    tableData = parseCSV(csv);

    visibleColumns = Object.keys(tableData[0]);
    createColumnToggles();
    renderTable(tableData);

    setupSearch();
  });

function parseCSV(csv) {

  const lines = csv.trim().split(/\r?\n/);

  const headers = lines[0]
    .split(",")
    .map(h => h.trim());

  return lines.slice(1).map(line => {

    const values = line
      .split(",")
      .map(v => v.trim());

    let obj = {};

    headers.forEach((header, index) => {
      obj[header] = values[index] || "";
    });

    return obj;
  });
}

function sortTable(column) {
  sortDirection[column] = !sortDirection[column];

  tableData.sort((a, b) => {
    const valA = a[column];
    const valB = b[column];

    const numA = Number(valA);
    const numB = Number(valB);

    let comparison;

    if (!isNaN(numA) && !isNaN(numB)) {
      comparison = numA - numB;
    } else {
      comparison = valA.localeCompare(valB);
    }

    return sortDirection[column]
      ? comparison
      : -comparison;
  });

  renderTable(tableData);
}

function setupSearch() {

  const searchInput = document.getElementById("search");

  searchInput.addEventListener("input", e => {

    const value = e.target.value.toLowerCase();

    const filtered = tableData.filter(row =>

      row.Name.toLowerCase().includes(value)
    );

    renderTable(filtered);
  });
}
function createColumnToggles() {

  const container = document.getElementById("columnToggles");

  container.innerHTML = "";

  visibleColumns.forEach(column => {

    const label = document.createElement("label");

    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.checked = true;

    checkbox.addEventListener("change", () => {

      if (checkbox.checked) {

        visibleColumns.push(column);

      } else {

        visibleColumns = visibleColumns.filter(c => c !== column);
      }

      renderTable(tableData);
    });

    label.appendChild(checkbox);

    label.append(" " + column);

    container.appendChild(label);
  });
}

function renderTable(data) {

  const tableHead = document.querySelector("#dataTable thead");

  const tableBody = document.querySelector("#dataTable tbody");

  tableHead.innerHTML = "";

  tableBody.innerHTML = "";

  if (data.length === 0) return;

  const headers = Object.keys(data[0]);

  const headerRow = document.createElement("tr");

  headers.forEach(header => {

    if (!visibleColumns.includes(header)) return;

    const th = document.createElement("th");

    th.textContent = header;

    th.addEventListener("click", () => {
      sortTable(header);
    });

    headerRow.appendChild(th);
  });

  tableHead.appendChild(headerRow);

  // Data rows
  data.forEach(row => {

    const tr = document.createElement("tr");

    headers.forEach(header => {

      if (!visibleColumns.includes(header)) return;

      const td = document.createElement("td");

      td.textContent = row[header];

      tr.appendChild(td);
    });

    tableBody.appendChild(tr);
  });
}
