function validateForm(event) {
  var requiredInputs = document.querySelectorAll("#userDataForm [required]");

  for (var i = 0; i < requiredInputs.length; i++) {
    if (!requiredInputs[i].value) {
      event.preventDefault();
      event.stopPropagation();
      requiredInputs[i].classList.add("is-invalid");
      requiredInputs[i].nextElementSibling.textContent =
        "This field is required.";
    }
  }
}

document
  .getElementById("userDataForm")
  .addEventListener("submit", validateForm);

function validateFirstName(text) {
  var firstNameInput = document.getElementById("firstName");
  var errorElement = firstNameInput.nextElementSibling;
  var re = /^[a-zA-Z][a-zA-Z0-9\s]*$/;

  if (!re.test(text)) {
    firstNameInput.classList.add("is-invalid");
    errorElement.textContent =
      "Please provide a valid name starting with a letter.";
  } else {
    firstNameInput.classList.remove("is-invalid");
    firstNameInput.classList.add("is-valid");
    errorElement.textContent = "";
  }
}

document.getElementById("firstName").addEventListener("keyup", function () {
  validateFirstName(this.value);
});

function validateLastName(text) {
  var lastNameInput = document.getElementById("lastName");
  var errorElement = lastNameInput.nextElementSibling;
  var re = /^[a-zA-Z][a-zA-Z0-9\s]*$/;

  if (!re.test(text)) {
    lastNameInput.classList.add("is-invalid");
    errorElement.textContent =
      "Please provide a valid name starting with a letter.";
  } else {
    lastNameInput.classList.remove("is-invalid");
    lastNameInput.classList.add("is-valid");
    errorElement.textContent = "";
  }
}

document.getElementById("lastName").addEventListener("keyup", function () {
  validateLastName(this.value);
});

function validateEmail(email) {
  var emailInput = document.getElementById("emailInput");
  var errorElement = emailInput.nextElementSibling;
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!re.test(email)) {
    emailInput.classList.add("is-invalid");
    errorElement.textContent = "Please provide a valid email address.";
  } else {
    emailInput.classList.remove("is-invalid");
    emailInput.classList.add("is-valid");
    errorElement.textContent = "";
  }
}

function validateContact(contact) {
  var contactInput = document.getElementById("contact");
  var errorElement = contactInput.nextElementSibling;
  var re = /^[6-9]\d{9}$/;

  if (!re.test(contact)) {
    contactInput.classList.add("is-invalid");
    errorElement.textContent =
      "Please provide a valid 10-digit contact number starting with 6, 7, 8, or 9.";
  } else {
    contactInput.classList.remove("is-invalid");
    contactInput.classList.add("is-valid");
    errorElement.textContent = "";
  }
}

document.getElementById("emailInput").addEventListener("keyup", function () {
  validateEmail(this.value);
});

document.getElementById("contact").addEventListener("keyup", function () {
  validateContact(this.value);
});



let users = [];
let editIndex = -1;

// Load data from local storage when the page loads
document.addEventListener("DOMContentLoaded", loadDataFromLocalStorage);

// Function to render table
function renderTable() {
  const tbody = document.getElementById("outputTable");
  tbody.innerHTML = "";
  users.forEach((user, index) => {
    const row = `
      <tr>
        <td>${user.firstName}</td>
        <td>${user.lastName}</td>
        <td>${user.email}</td>
        <td>${user.contact}</td>
        <td>${user.gender}</td>
        <td>${user.dob}</td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="editUser(${index})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteUser(${index})">Delete</button>
          <button class="btn btn-sm btn-info" onclick="viewUser(${index})">View</button>
        </td>
      </tr>
    `;
    tbody.insertAdjacentHTML("beforeend", row);
  });
  saveDataToLocalStorage(); // Save data to local storage whenever the table is rendered
}

// Function to add or edit user
// Function to add or edit user
document.getElementById("userDataForm").addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("Form submit event triggered");

  const user = {
    firstName: document.getElementById("firstName").value,
    middleName: document.getElementById("middleName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("emailInput").value,
    contact: document.getElementById("contact").value,
    contactType: document.getElementById("contactType").value,
    gender: document.querySelector('input[name="gender"]:checked').value,
    address1: document.getElementById("address1").value,
    sameAddress: document.getElementById("sameAddress").checked,
    address2: document.getElementById("address2").value,
    dob: document.getElementById("dob").value,
  };

  console.log("User data:", user);

  // Check for duplicate email or contact only when adding new data
  if (editIndex === -1) {
    const isDuplicateEmail = users.some(
      (existingUser) => existingUser.email === user.email
    );
    const isDuplicateContact = users.some(
      (existingUser) => existingUser.contact === user.contact
    );

    if (isDuplicateEmail || isDuplicateContact) {
      alert("Email or Contact already exists in data");
      return; // Prevent further execution
    }
  }

  if (editIndex === -1) {
    users.push(user);
  } else {
    users[editIndex] = user;
    editIndex = -1;
  }

  document.getElementById("userDataForm").reset();

  // Use Bootstrap modal API to hide the modal
  const modalElement = document.getElementById("formDataModal");
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  modalInstance.hide();

  renderTable();
});


// Function to edit user
function editUser(index) {
  editIndex = index;
  const user = users[index];

  document.getElementById("firstName").value = user.firstName;
  document.getElementById("middleName").value = user.middleName;
  document.getElementById("lastName").value = user.lastName;
  document.getElementById("emailInput").value = user.email;
  document.getElementById("contact").value = user.contact;
  document.getElementById("contactType").value = user.contactType;
  document.querySelector(
    `input[name="gender"][value="${user.gender}"]`
  ).checked = true;
  document.getElementById("address1").value = user.address1;

  document.getElementById("sameAddress").checked = user.sameAddress; //

  document.getElementById("address2").value = user.address2;
  document.getElementById("dob").value = user.dob;

  document.querySelector('[data-bs-target="#formDataModal"]').click();
}

// Function to delete user
function deleteUser(index) {
  const user = users[index];
  const confirmDelete = confirm(
    `Are you sure you want to delete ${user.firstName} ${user.lastName}?`
  );
  if (confirmDelete) {
    users.splice(index, 1);
    renderTable();
  }
}

// Function to view user details
function viewUser(index) {
  const user = users[index];

  document.getElementById("viewFirstName").textContent = user.firstName;
  document.getElementById("viewMiddleName").textContent = user.middleName;
  document.getElementById("viewLastName").textContent = user.lastName;
  document.getElementById("viewEmail").textContent = user.email;
  document.getElementById("viewContact").textContent = user.contact;
  document.getElementById("viewContactType").textContent = user.contactType;
  document.getElementById("viewGender").textContent = user.gender;
  document.getElementById("viewAddress1").textContent = user.address1;
  document.getElementById("viewSameAddress").textContent = user.sameAddress ? "Yes" : "No";
  document.getElementById("viewAddress2").textContent = user.address2;
  document.getElementById("viewDob").textContent = user.dob;

  // Show the modal
  const userDetailsModal = new bootstrap.Modal(document.getElementById("userDetailsModal"));
  userDetailsModal.show();
}

// Filtering functionality
document.getElementById("filterInput").addEventListener("keyup", function () {
  const filterValue = this.value.toLowerCase();
  const rows = document.querySelectorAll("#outputTable tr");

  rows.forEach(function (row) {
    const firstName = row.cells[0].textContent.toLowerCase();
    const lastName = row.cells[1].textContent.toLowerCase();
    const email = row.cells[2].textContent.toLowerCase();
    const contact = row.cells[3].textContent.toLowerCase();

    if (
      firstName.includes(filterValue) ||
      lastName.includes(filterValue) ||
      email.includes(filterValue) ||
      contact.includes(filterValue)
    ) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
});

const address1Field = document.getElementById("address1");
const address2Field = document.getElementById("address2");
const sameAddressCheckbox = document.getElementById("sameAddress");

sameAddressCheckbox.addEventListener("change", function () {
  if (sameAddressCheckbox.checked) {
    // Set communication address same as permanent address
    address2Field.value = address1Field.value;
    address2Field.disabled = true;
  } else {
    // Enable communication address field
    address2Field.disabled = false;
  }
});

address1Field.addEventListener("input", function () {
  if (sameAddressCheckbox.checked) {
    address2Field.value = address1Field.value;
  }
});

// Function to save data to local storage
function saveDataToLocalStorage() {
  localStorage.setItem("users", JSON.stringify(users));
}

// Function to load data from local storage
function loadDataFromLocalStorage() {
  const storedUsers = localStorage.getItem("users");
  if (storedUsers) {
    users = JSON.parse(storedUsers);
    renderTable();
  }
}




var currentPage = 1;
var rowsPerPage = 5;
var tableData = document.getElementById("outputTable");

// Event listeners for pagination navigation
const pagination = document.querySelector(".pagination");
const prevButton = pagination.querySelector("li:first-child");
const nextButton = pagination.querySelector("li:last-child");

prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    updatePagination();
  }
});

nextButton.addEventListener("click", () => {
  const totalPages = Math.ceil(tableData.rows.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    updatePagination();
  }
});

pagination.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    const pageNumber = parseInt(e.target.textContent);
    if (!isNaN(pageNumber)) {
      currentPage = pageNumber;
      updatePagination();
    }
  }
});

// Function to update pagination UI and display rows
function updatePagination() {
  const rows = Array.from(tableData.rows);
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  prevButton.classList.toggle("disabled", currentPage === 1);
  nextButton.classList.toggle("disabled", currentPage === totalPages);

  const pageLinks = pagination.querySelectorAll(
    ".page-item:not(:first-child):not(:last-child)"
  );
  pageLinks.forEach((link, index) => {
    const pageNumber = index + 1;
    link.classList.toggle("active", pageNumber === currentPage);
  });

  rows.forEach((row, index) => {
    row.style.display =
      index >= (currentPage - 1) * rowsPerPage &&
      index < currentPage * rowsPerPage
        ? ""
        : "none";
  });
}

updatePagination();
