// main.js – pour Cloudflare Pages uniquement

const form = document.getElementById("contactForm");
const successMessage = document.getElementById("successMessage");
const errorMessage = document.getElementById("errorMessage");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  try {
    // Envoie le formulaire en POST avec FormData
    const response = await fetch("/contact", {
      method: "POST",
      body: new FormData(form) // Cloudflare Pages Functions accepte FormData
    });

    let data;
    try {
      data = await response.json();
    } catch {
      data = { status: "error", message: "Empty or invalid JSON response" };
    }

    // Affichage des messages
    if (response.ok && data.status === "success") {
      successMessage.style.display = "block";
      errorMessage.style.display = "none";
      form.reset();
    } else {
      errorMessage.style.display = "block";
      errorMessage.textContent = "❌ Error: " + (data.message || "Unknown error");
      successMessage.style.display = "none";
    }

  } catch (err) {
    errorMessage.style.display = "block";
    errorMessage.textContent = "❌ Error: " + err.message;
    successMessage.style.display = "none";
  }
});







/*
// ancien fetch vers Resend
// const response = await fetch("https://api.resend.com/emails", { ...

// nouveau fetch vers ton serveur Node.js
const response = await fetch("http://localhost:3000/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ 
    name, 
    _replyto: email, 
    message 
  })
});
*/