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

      if (!response.ok) throw new Error("Login non reussi");

      const data = await response.json();
      console.log("Login reussi:", data);

      const token = data.token;
      console.log(token);
      localStorage.setItem("token", token);

      !!localStorage.getItem("token")
    } catch (error) {
      console.error("Error:", error);
      alert("Login non reussi. Verifiez votre e-mail ou mot de passe.");
    }
  });
});
