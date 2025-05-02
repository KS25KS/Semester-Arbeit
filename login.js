// Load user data if already logged in
window.onload = function () {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (user) {
      document.getElementById("userName").textContent = user.name;
      document.getElementById("userEmail").textContent = user.email;
      document.getElementById("userPhone").textContent = user.phone || "Optional";
      document.getElementById("points").textContent = user.points || 0;
      document.getElementById("loginBox").style.display = "none";
      document.getElementById("logoutBox").style.display = "block"; // Show logout button
    }
};

// Sign in function
function signIn() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        alert("Bitte E-Mail und Passwort eingeben.");
        return;
    }

    // Check if user already exists
    let existingUser = JSON.parse(localStorage.getItem("userData"));
    if (!existingUser) {
        alert("Benutzer existiert nicht. Bitte registrieren.");
        return;
    }

    // If user exists, login successfully
    if (existingUser.email === email && existingUser.password === password) {
        localStorage.setItem("userData", JSON.stringify(existingUser));
        location.reload();
    } else {
        alert("Falsches Passwort!");
    }
}

// Logout function
function logout() {
    localStorage.removeItem("userData");
    location.reload();
}

// Function to add points after an order
function addPointsForOrder(pointsToAdd = 10) {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (!user) return;

    user.points = (user.points || 0) + pointsToAdd;
    localStorage.setItem("userData", JSON.stringify(user));

    // Update points display
    document.getElementById("points").textContent = user.points;
}

function editField(field) {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (!user) return;
  
    let currentValue = user[field] || '';
    const newValue = prompt(`Neuer ${field === 'email' ? 'E-Mail' : 'Telefonnummer'}:`, currentValue);
  
    if (newValue === null) return; // Cancelled
  
    if (field === 'email' && !newValue.includes('@')) {
      alert("Bitte eine gültige E-Mail-Adresse eingeben.");
      return;
    }
  
    if (field === 'phone' && /\D/.test(newValue)) {
      alert("Telefonnummer darf nur Zahlen enthalten.");
      return;
    }
  
    user[field] = newValue;
    localStorage.setItem("userData", JSON.stringify(user));
    location.reload();
  }
  
  // Show/hide password toggle
document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.getElementById("loginPassword");
    const toggleIcon = document.getElementById("togglePassword");
  
    toggleIcon.addEventListener("click", function () {
      const isPassword = passwordInput.type === "password";
      passwordInput.type = isPassword ? "text" : "password";
      toggleIcon.classList.toggle("fa-eye");
      toggleIcon.classList.toggle("fa-eye-slash");
    });
  });
  