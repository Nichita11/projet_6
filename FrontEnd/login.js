document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login non réussi");
      } else {
        const data = await response.json();
        console.log("Connexion réussi:", data);

        const token = data.token;
        console.log(token);
        localStorage.setItem("token", token);

        alert("Connexion réussie!");

        if (localStorage.getItem("token")) {
          window.location.href = "index.html";
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Login non réussi. Vérifiez votre e-mail ou mot de passe.");
    }
  });
});
