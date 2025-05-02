window.onload = function () {
  const user = JSON.parse(localStorage.getItem("userData"));
  if (user) {
    document.getElementById("userName").textContent = user.name;
    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("userPhone").textContent = user.phone || "Optional";
    document.getElementById("userAddress").textContent = user.address || "Optional";
    document.getElementById("userPLZ").textContent = user.plz || "Optional";
    document.getElementById("points").textContent = user.points || 0;
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("registerBox").style.display = "none";
    document.getElementById("logoutBox").style.display = "block";
  }
};

function toggleView(view) {
  document.getElementById("loginBox").style.display = view === "login" ? "block" : "none";
  document.getElementById("registerBox").style.display = view === "register" ? "block" : "none";
}

// SIGN IN
function signIn() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Bitte E-Mail und Passwort eingeben.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const matchedUser = users.find(user => user.email === email && user.password === password);

  if (!matchedUser) {
    alert("Login fehlgeschlagen. Falsche E-Mail oder Passwort.");
    return;
  }

  localStorage.setItem("userData", JSON.stringify(matchedUser));

  document.getElementById("userName").textContent = matchedUser.name;
  document.getElementById("userEmail").textContent = matchedUser.email;
  document.getElementById("userPhone").textContent = matchedUser.phone || "Optional";
  document.getElementById("userAddress").textContent = matchedUser.address || "Optional";
  document.getElementById("userPLZ").textContent = matchedUser.plz || "Optional";
  document.getElementById("points").textContent = matchedUser.points || 0;

  document.getElementById("loginBox").style.display = "none";
  document.getElementById("registerBox").style.display = "none";
  document.getElementById("logoutBox").style.display = "block";
}

// REGISTER
function register() {
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const phone = document.getElementById("registerPhone").value.trim();
  const password = document.getElementById("registerPassword").value.trim();
  const address = document.getElementById("registerAddress").value.trim();
  const plz = document.getElementById("registerPLZ").value.trim();

  if (!name || !email || !password) {
    alert("Bitte alle Pflichtfelder (*) ausfüllen.");
    return;
  }

  if (!email.includes("@")) {
    alert("Ungültige E-Mail.");
    return;
  }

  if (phone && !/^\d+$/.test(phone)) {
    alert("Telefonnummer darf nur Zahlen enthalten.");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const userExists = users.some(user => user.email === email);
  if (userExists) {
    alert("Ein Benutzer mit dieser E-Mail existiert bereits.");
    return;
  }

  const newUser = {
    name,
    email,
    phone: phone || "", 
    password,
    address: address || "",
    plz: plz || "",
    points: 0  
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("userData", JSON.stringify(newUser));

  document.getElementById("userName").textContent = newUser.name;
  document.getElementById("userEmail").textContent = newUser.email;
  document.getElementById("userPhone").textContent = newUser.phone || "Optional";
  document.getElementById("userAddress").textContent = newUser.address || "Optional";
  document.getElementById("userPLZ").textContent = newUser.plz || "Optional";
  document.getElementById("points").textContent = newUser.points || 0;

  document.getElementById("loginBox").style.display = "none";
  document.getElementById("registerBox").style.display = "none";
  document.getElementById("logoutBox").style.display = "block";

  alert("Registrierung erfolgreich. Willkommen, " + newUser.name + "!");
}

// LOGOUT
function logout() {
  localStorage.removeItem("userData");
  document.getElementById("userName").textContent = "Gast";
  document.getElementById("userEmail").textContent = "Nicht eingeloggt";
  document.getElementById("userPhone").textContent = "Optional";
  document.getElementById("userAddress").textContent = "Optional";
  document.getElementById("userPLZ").textContent = "Optional";
  document.getElementById("points").textContent = 0;

  document.getElementById("loginBox").style.display = "block";
  document.getElementById("registerBox").style.display = "none";
  document.getElementById("logoutBox").style.display = "none";
}

// EDIT
function editField(field) {
  const fieldLabels = {
    email: "E-Mail",
    phone: "Telefonnummer",
    address: "Adresse",
    plz: "PLZ"
  };

  const user = JSON.parse(localStorage.getItem("userData"));
  if (!user) return;

  const currentValue = user[field] || "";
  const label = fieldLabels[field] || field;
  const newValue = prompt(`Neue ${label}:`, currentValue);
  if (newValue === null) return;

  if (field === "email" && !newValue.includes("@")) {
    alert("Ungültige E-Mail.");
    return;
  }

  if (field === "phone" && /\D/.test(newValue)) {
    alert("Nur Zahlen erlaubt.");
    return;
  }

  user[field] = newValue;

  localStorage.setItem("userData", JSON.stringify(user));

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const index = users.findIndex(u => u.email === user.email);
  if (index !== -1) {
    users[index][field] = newValue;
    localStorage.setItem("users", JSON.stringify(users));
  }

  location.reload();
}

// PASSWORD TOGGLE
document.addEventListener("DOMContentLoaded", () => {
  const togglePass = (toggleId, inputId) => {
    const icon = document.getElementById(toggleId);
    const input = document.getElementById(inputId);

    if (icon && input) {
      icon.addEventListener("click", () => {
        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";
        icon.classList.toggle("fa-eye");
        icon.classList.toggle("fa-eye-slash");
      });
    }
  };

  togglePass("toggleLoginPassword", "loginPassword");
  togglePass("toggleRegisterPassword", "registerPassword");
});
