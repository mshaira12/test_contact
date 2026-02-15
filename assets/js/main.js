
const form = document.getElementById("contactForm");
const successMessage = document.getElementById("successMessage");
const errorMessage = document.getElementById("errorMessage");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Récupère les valeurs du formulaire
  const name = form.name.value;
  const email = form._replyto.value;
  const message = form.message.value;

  // Détecte si on est en local ou sur Pages
  const isLocal = window.location.hostname === "localhost";
  const endpoint = isLocal ? "http://localhost:3000/contact" : "/contact";

  try {
    // Envoie le formulaire
    const response = await fetch(endpoint, {
      method: "POST",
      body: isLocal
        ? JSON.stringify({ name, _replyto: email, message }) // local Node.js attend JSON
        : new FormData(form),                               // Cloudflare Pages accepte FormData
      headers: isLocal ? { "Content-Type": "application/json" } : { "Accept": "application/json" }
    });

    let data;
    try {
      data = await response.json();
    } catch {
      data = { status: "error", message: "Empty or invalid JSON response" };
    }

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