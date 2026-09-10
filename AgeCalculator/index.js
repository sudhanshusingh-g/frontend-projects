// Import Luxon DateTime
const { DateTime } = luxon;

// DOM Elements
const ageForm = document.getElementById("ageForm");
const birthdateInput = document.getElementById("birthdate");
const dateError = document.getElementById("dateError");
const resultContainer = document.getElementById("resultContainer");
const yearsValue = document.getElementById("yearsValue");
const monthsValue = document.getElementById("monthsValue");
const daysValue = document.getElementById("daysValue");
const nextBirthdayInfo = document.getElementById("nextBirthdayInfo");
const totalDaysInfo = document.getElementById("totalDaysInfo");
const resetBtn = document.getElementById("resetBtn");

// Initialize Flatpickr Datepicker
const picker = flatpickr(birthdateInput, {
  mode: "single",
  dateFormat: "Y-m-d",
  maxDate: "today",
  disableMobile: false,
  onChange: function () {
    // Clear error message when user selects a date
    clearError();
  },
});

/**
 * Clear error message
 */
function clearError() {
  dateError.textContent = "";
  dateError.classList.remove("show");
}

/**
 * Display error message
 */
function showError(message) {
  dateError.textContent = message;
  dateError.classList.add("show");
}

/**
 * Validate birthdate
 */
function isValidBirthdate(dateString) {
  try {
    const date = DateTime.fromISO(dateString);

    // Check if date is valid
    if (!date.isValid) {
      return { valid: false, message: "Invalid date format" };
    }

    // Check if date is not in the future
    if (date > DateTime.now()) {
      return { valid: false, message: "Birthdate cannot be in the future" };
    }

    // Check if person is at least 0 years old (ignore time component)
    const age = DateTime.now().diff(date, "years").years;
    if (age < 0) {
      return { valid: false, message: "Birthdate must be in the past" };
    }

    // Check if person is not older than 150 years
    if (age > 150) {
      return { valid: false, message: "Please enter a valid birthdate" };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, message: "Invalid date" };
  }
}

/**
 * Calculate age and display results
 */
function calculateAge() {
  const birthdateValue = birthdateInput.value.trim();

  // Validate input
  if (!birthdateValue) {
    showError("Please select your birthdate");
    return;
  }

  // Validate birthdate
  const validation = isValidBirthdate(birthdateValue);
  if (!validation.valid) {
    showError(validation.message);
    return;
  }

  clearError();

  const birthDate = DateTime.fromISO(birthdateValue);
  const today = DateTime.now();

  // Calculate age in years, months, and days
  const diff = today.diff(birthDate, ["years", "months", "days"]);
  const years = Math.floor(diff.years);
  const months = Math.floor(diff.months % 12);
  const days = Math.floor(diff.days % 31);

  // Update result display
  yearsValue.textContent = years;
  monthsValue.textContent = months;
  daysValue.textContent = days;

  // Calculate next birthday
  const nextBirthday = birthDate.plus({ years: years + 1 });
  const daysUntilBirthday = Math.ceil(nextBirthday.diff(today, "days").days);

  if (daysUntilBirthday === 0) {
    nextBirthdayInfo.textContent = "🎉 Happy Birthday Today!";
  } else if (daysUntilBirthday === 1) {
    nextBirthdayInfo.textContent = "🎂 Your birthday is tomorrow!";
  } else if (daysUntilBirthday < 365) {
    nextBirthdayInfo.textContent = `🎈 ${daysUntilBirthday} days until your next birthday`;
  } else {
    nextBirthdayInfo.textContent = `🎂 Your next birthday is on ${nextBirthday.toFormat("MMMM d, yyyy")}`;
  }

  // Calculate total days lived
  const totalDays = Math.floor(today.diff(birthDate, "days").days);
  totalDaysInfo.textContent = `You have lived approximately ${totalDays.toLocaleString()} days`;

  // Show results
  resultContainer.classList.remove("hidden");

  // Scroll to results
  setTimeout(() => {
    resultContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 100);
}

/**
 * Reset form and hide results
 */
function resetForm() {
  ageForm.reset();
  picker.clear();
  resultContainer.classList.add("hidden");
  clearError();
  birthdateInput.focus();
}

// Event listeners
ageForm.addEventListener("submit", function (e) {
  e.preventDefault();
  calculateAge();
});

resetBtn.addEventListener("click", resetForm);

// Allow Enter key to submit form from input field
birthdateInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    calculateAge();
  }
});

// Focus input on page load
window.addEventListener("load", function () {
  birthdateInput.focus();
});
