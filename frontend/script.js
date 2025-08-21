// API Configuration
const API_BASE_URL = "http://localhost:3000/api";

// Global variables
let currentSection = "accounts";
let editingId = null;

// DOM Elements
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalForm = document.getElementById("modalForm");
const loading = document.getElementById("loading");

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  initializeNavigation();
  loadInitialData();
  setupModalHandlers();
});

// Navigation functionality
function initializeNavigation() {
  const navButtons = document.querySelectorAll(".nav-btn");

  navButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const section = this.getAttribute("data-section");
      switchSection(section);
    });
  });
}

function switchSection(section) {
  // Update navigation buttons
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelector(`[data-section="${section}"]`).classList.add("active");

  // Update sections
  document.querySelectorAll(".section").forEach((s) => {
    s.classList.remove("active");
  });
  document.getElementById(section).classList.add("active");

  currentSection = section;
  loadSectionData(section);
}

// Load initial data
function loadInitialData() {
  loadSectionData("accounts");
}

// Load data for specific section
function loadSectionData(section) {
  showLoading();

  switch (section) {
    case "accounts":
      loadAccounts();
      break;
    case "customers":
      loadCustomers();
      break;
    case "banks":
      loadBanks();
      break;
    case "transactions":
      loadTransactions();
      break;
    case "loans":
      loadLoans();
      break;
    case "audit":
      loadAuditLogs();
      break;
  }
}

// Enhanced API Functions with better error handling
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    showMessage("Error: " + error.message, "error");
    throw error;
  }
}

// Accounts
async function loadAccounts() {
  try {
    const accounts = await apiCall("/accounts");
    displayAccounts(accounts);
  } catch (error) {
    showEmptyState(
      "accountsTableBody",
      "No accounts found or error loading accounts"
    );
  } finally {
    hideLoading();
  }
}

function displayAccounts(accounts) {
  const tbody = document.getElementById("accountsTableBody");

  if (!accounts || accounts.length === 0) {
    showEmptyState("accountsTableBody", "No accounts found");
    return;
  }

  tbody.innerHTML = accounts
    .map(
      (account, index) => `
      <tr>
          <td>${index + 1}</td> <!-- Serial number for Sno. -->
          <td>${account.customer_name || "N/A"}</td>
          <td>${account.account_type || "N/A"}</td>
          <td>$${parseFloat(account.balance || 0).toFixed(2)}</td>
          <td>
              <div class="action-buttons">
                  <button class="btn btn-warning btn-sm" onclick="editRecord('account', ${
                    account.id
                  })">
                      <i class="fas fa-edit"></i> Edit
                  </button>
                  <button class="btn btn-danger btn-sm" onclick="deleteRecord('account', ${
                    account.id
                  })">
                      <i class="fas fa-trash"></i> Delete
                  </button>
              </div>
          </td>
      </tr>
    `
    )
    .join("");
}

// Customers
async function loadCustomers() {
  try {
    const customers = await apiCall("/customers");
    displayCustomers(customers);
  } catch (error) {
    showEmptyState(
      "customersTableBody",
      "No customers found or error loading customers"
    );
  } finally {
    hideLoading();
  }
}

function displayCustomers(customers) {
  const tbody = document.getElementById("customersTableBody");
  tbody.innerHTML = customers
    .map(
      (customer, index) => `
      <tr>
        <td>${customer.id}</td>
        <td>${customer.name || "N/A"}</td>
        <td>${customer.age !== undefined ? customer.age : "N/A"}</td>
        <td>${customer.gender || "N/A"}</td>
        <td>
        <div class="action-buttons">
        <button class="btn btn-warning btn-sm" onclick="editRecord('customer', ${
          customer.id
        })">
        <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn btn-danger btn-sm" onclick="deleteRecord('customer', ${
          customer.id
        })">
        <i class="fas fa-trash"></i> Delete
        </button>
        </div>
        </td>
      </tr>
    `
    )
    .join("");
}

// Banks
async function loadBanks() {
  try {
    const banks = await apiCall("/banks");
    displayBanks(banks);
  } catch (error) {
    showEmptyState("banksTableBody", "No banks found or error loading banks");
  } finally {
    hideLoading();
  }
}

function displayBanks(banks) {
  const tbody = document.getElementById("banksTableBody");
  tbody.innerHTML = banks
    .map(
      (bank) => `
      <tr>
        <td>${bank.bank_id}</td>
        <td>${bank.name}</td>
        <td>${bank.country}</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-warning btn-sm" onclick="editRecord('bank', ${bank.bank_id})">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteRecord('bank', ${bank.bank_id})">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>  
        </div>
        </td>
      </tr>
    `
    )
    .join("");
}

// Transactions
async function loadTransactions() {
  try {
    const transactions = await apiCall("/transactions");
    displayTransactions(transactions);
  } catch (error) {
    showEmptyState(
      "transactionsTableBody",
      "No transactions found or error loading transactions"
    );
  } finally {
    hideLoading();
  }
}

function displayTransactions(transactions) {
  const tbody = document.getElementById("transactionsTableBody");

  if (!transactions || transactions.length === 0) {
    showEmptyState("transactionsTableBody", "No transactions found");
    return;
  }

  tbody.innerHTML = transactions
    .map(
      (transaction) => `
        <tr>
            <td>${transaction.transaction_id}</td>
            <td>${transaction.account_id}</td>
            <td>${transaction.transaction_type}</td>
            <td>$${parseFloat(transaction.amount || 0).toFixed(2)}</td>
            <td>${new Date(transaction.transaction_date).toLocaleString()}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning btn-sm" onclick="editRecord('transaction', ${
                      transaction.transaction_id
                    })">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteRecord('transaction', ${
                      transaction.transaction_id
                    })">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        </tr>
    `
    )
    .join("");
}

// Loans
async function loadLoans() {
  try {
    const loans = await apiCall("/loans");
    displayLoans(loans);
  } catch (error) {
    showEmptyState("loansTableBody", "Loans feature not implemented yet");
  } finally {
    hideLoading();
  }
}

function displayLoans(loans) {
  const tbody = document.getElementById("loansTableBody");
  tbody.innerHTML = loans
    .map(
      (loan) => `
        <tr>
          <td>${loan.loan_id}</td>
          <td>$${parseFloat(loan.amount || 0).toFixed(
            2
          )}</td> <!-- Show amount -->
          <td>${loan.status || "N/A"}</td>
          <td>
            <div class="action-buttons">
            <button class="btn btn-warning btn-sm" onclick="editRecord('loan', ${
              loan.loan_id
            })">
            <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteRecord('loan', ${
              loan.loan_id
            })">
            <i class="fas fa-trash"></i> Delete
            </button>
            </div>
          </td>
        </tr>
      `
    )
    .join("");
}

// Audit Logs
async function loadAuditLogs() {
  try {
    const logs = await apiCall("/audit");
    displayAuditLogs(logs);
  } catch (error) {
    showEmptyState(
      "auditTableBody",
      "No audit logs found or error loading logs"
    );
  } finally {
    hideLoading();
  }
}

function displayAuditLogs(logs) {
  const tbody = document.getElementById("auditTableBody");

  if (!logs || logs.length === 0) {
    showEmptyState("auditTableBody", "No audit logs found");
    return;
  }

  tbody.innerHTML = logs
    .map(
      (log, index) => `
        <tr>
            <td>${index + 1}</td> <!-- Serial number -->
            <td>${log.action}</td>
            <td>${log.table_name}</td>
            <td>${log.record_id}</td>
            <td>${log.user || "N/A"}</td>
            <td>${new Date(log.timestamp).toLocaleString()}</td>
        </tr>
    `
    )
    .join("");
}

// Modal functionality
function setupModalHandlers() {
  const closeBtn = document.querySelector(".close");
  closeBtn.addEventListener("click", closeModal);

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });
}

function getRecordIdForType(type, data) {
  if (!data) return null;
  switch (type) {
    case "account":
      return data.id ?? data.account_id ?? null;
    case "customer":
      return data.id ?? data.customer_id ?? null;
    case "bank":
      return data.bank_id ?? data.id ?? null;
    case "transaction":
      return data.transaction_id ?? data.id ?? null;
    case "loan":
      return data.id ?? null;
    default:
      return data.id ?? null;
  }
}

function showModal(type, data = null) {
  editingId = getRecordIdForType(type, data);
  modalTitle.textContent = editingId
    ? `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}`
    : `Add New ${type.charAt(0).toUpperCase() + type.slice(1)}`;

  const formFields = getFormFields(type, data);
  modalForm.innerHTML = formFields;

  modal.style.display = "block";

  // Setup form submission
  modalForm.onsubmit = function (e) {
    e.preventDefault();
    handleFormSubmit(type);
  };
}

function closeModal() {
  modal.style.display = "none";
  editingId = null;
  modalForm.innerHTML = "";
}

function getFormFields(type, data = null) {
  const fields = {
    account: `
            <div class="form-group">
                <label for="customer_id">Customer ID</label>
                <input type="number" id="customer_id" name="customer_id" value="${
                  data?.customer_id || ""
                }" required>
            </div>
            <div class="form-group">
                <label for="account_type">Account Type</label>
                <select id="account_type" name="account_type" required>
                    <option value="">Select Account Type</option>
                    <option value="Savings" ${
                      data?.account_type === "Savings" ? "selected" : ""
                    }>Savings</option>
                    <option value="Checking" ${
                      data?.account_type === "Checking" ? "selected" : ""
                    }>Checking</option>
                    <option value="Business" ${
                      data?.account_type === "Business" ? "selected" : ""
                    }>Business</option>
                </select>
            </div>
            <div class="form-group">
                <label for="balance">Balance</label>
                <input type="number" id="balance" name="balance" step="0.01" value="${
                  data?.balance || ""
                }" required>
            </div>
        `,
    customer: `
            <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" value="${
                  data?.name || ""
                }" required>
            </div>
            <div class="form-group">
                <label for="age">Age</label>
                <input type="number" id="age" name="age" min="1" max="120" value="${
                  data?.age || ""
                }" required>
            </div>
            <div class="form-group">
                <label for="gender">Gender</label>
                <select id="gender" name="gender" required>
                    <option value="">Select Gender</option>
                    <option value="Male" ${
                      data?.gender === "Male" ? "selected" : ""
                    }>Male</option>
                    <option value="Female" ${
                      data?.gender === "Female" ? "selected" : ""
                    }>Female</option>
                    <option value="Other" ${
                      data?.gender === "Other" ? "selected" : ""
                    }>Other</option>
                </select>
            </div>
        `,
    bank: `
  <div class="form-group">
    <label for="name">Bank Name</label>
    <input type="text" id="name" name="name" value="${
      data?.name || ""
    }" required>
  </div>
  <div class="form-group">
    <label for="country">Country</label>
    <input type="text" id="country" name="country" value="${
      data?.country || ""
    }" required>
  </div>
`,
    loan: `
            <div class="form-group">
                <label for="status">Status</label>
                <select id="status" name="status" required>
                    <option value="">Select Status</option>
                    <option value="Pending" ${
                      data?.status === "Pending" ? "selected" : ""
                    }>Pending</option>
                    <option value="Approved" ${
                      data?.status === "Approved" ? "selected" : ""
                    }>Approved</option>
                    <option value="Rejected" ${
                      data?.status === "Rejected" ? "selected" : ""
                    }>Rejected</option>
                </select>
            </div>
        `,
    // ...existing code...
    transaction: `
        <div class="form-group">
            <label for="account_id">Account ID</label>
            <input type="number" id="account_id" name="account_id" value="${
              data?.account_id || ""
            }" required>
        </div>
        <div class="form-group">
            <label for="transaction_type">Transaction Type</label>
            <select id="transaction_type" name="transaction_type" required>
                <option value="">Select Transaction Type</option>
                <option value="Deposit" ${
                  data?.transaction_type === "Deposit" ? "selected" : ""
                }>Deposit</option>
                <option value="Withdrawal" ${
                  data?.transaction_type === "Withdrawal" ? "selected" : ""
                }>Withdrawal</option>
                <option value="Transfer" ${
                  data?.transaction_type === "Transfer" ? "selected" : ""
                }>Transfer</option>
                <option value="Payment" ${
                  data?.transaction_type === "Payment" ? "selected" : ""
                }>Payment</option>
            </select>
        </div>
        <div class="form-group">
            <label for="amount">Amount</label>
            <input type="number" id="amount" name="amount" step="0.01" value="${
              data?.amount || ""
            }" required>
        </div>
    `,
    // ...existing code...
  };

  return `
        ${fields[type] || ""}
        <div class="form-actions">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">
                ${editingId ? "Update" : "Create"}
            </button>
        </div>
    `;
}

async function handleFormSubmit(type) {
  const formData = new FormData(modalForm);
  const data = Object.fromEntries(formData.entries());

  // Basic validation
  if (!validateFormData(type, data)) {
    return;
  }

  try {
    showLoading();

    if (editingId) {
      // Update existing record
      await apiCall(`/${type}s/${editingId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      showMessage("Record updated successfully!", "success");
    } else {
      // Create new record
      await apiCall(`/${type}s`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      showMessage("Record created successfully!", "success");
    }

    closeModal();
    loadSectionData(currentSection);
  } catch (error) {
    showMessage("Failed to save record: " + error.message, "error");
  } finally {
    hideLoading();
  }
}

// Form validation
function validateFormData(type, data) {
  switch (type) {
    case "account":
      if (!data.customer_id || !data.account_type || data.balance === "") {
        showMessage("Please fill in all required fields", "error");
        return false;
      }
      if (parseFloat(data.balance) < 0) {
        showMessage("Balance cannot be negative", "error");
        return false;
      }
      break;
    case "customer":
      if (!data.name || !data.age || !data.gender) {
        showMessage("Please fill in all required fields", "error");
        return false;
      }
      if (parseInt(data.age) < 1 || parseInt(data.age) > 120) {
        showMessage("Age must be between 1 and 120", "error");
        return false;
      }
      break;
    case "bank":
      if (!data.name || !data.branch || !data.location) {
        showMessage("Please fill in all required fields", "error");
        return false;
      }
      break;
    case "transaction":
      if (!data.account_id || !data.transaction_type || data.amount === "") {
        showMessage("Please fill in all required fields", "error");
        return false;
      }
      if (parseFloat(data.amount) <= 0) {
        showMessage("Amount must be greater than 0", "error");
        return false;
      }
      break;
  }
  return true;
}

// Enhanced Edit and Delete functions
async function editRecord(type, id) {
  try {
    showLoading();
    const record = await apiCall(`/${type}s/${id}`);
    showModal(type, record);
  } catch (error) {
    showMessage("Failed to load record for editing", "error");
  } finally {
    hideLoading();
  }
}

async function deleteRecord(type, id) {
  if (!confirm("Are you sure you want to delete this record?")) {
    return;
  }

  try {
    showLoading();
    await apiCall(`/${type}s/${id}`, {
      method: "DELETE",
    });

    showMessage("Record deleted successfully!", "success");
    loadSectionData(currentSection);
  } catch (error) {
    showMessage("Failed to delete record: " + error.message, "error");
  } finally {
    hideLoading();
  }
}

// Utility functions
function showLoading() {
  loading.style.display = "block";
}

function hideLoading() {
  loading.style.display = "none";
}

function showMessage(message, type = "info") {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;

  const mainContent = document.querySelector(".main-content");
  mainContent.insertBefore(messageDiv, mainContent.firstChild);

  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

function showEmptyState(tableBodyId, message) {
  const tbody = document.getElementById(tableBodyId);
  tbody.innerHTML = `
        <tr>
            <td colspan="100%">
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>No Data Available</h3>
                    <p>${message}</p>
                </div>
            </td>
        </tr>
    `;
}

// Global functions for HTML onclick handlers
window.showModal = showModal;
window.editRecord = editRecord;
window.deleteRecord = deleteRecord;
window.loadAuditLogs = loadAuditLogs;
