document.getElementById("register-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        // 🔹 1. Register API Call
        const response = await fetch("http://127.0.0.1:8000/api/users/register/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        if (response.status === 201) {
            // 🔹 2. On success: auto-login
            const loginResponse = await fetch("http://127.0.0.1:8000/api/users/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const loginData = await loginResponse.json();

            if (loginResponse.ok) {
                // 🔐 Save token to localStorage
                localStorage.setItem("access_token", loginData.access);
                localStorage.setItem("refresh_token", loginData.refresh);

                // Redirect to dashboard
                window.location.href = "/static/html/dashboard.html";
            } else {
                alert("Login failed after registration!");
            }

        } else {
            const errorData = await response.json();
            alert("Registration failed:\n" + JSON.stringify(errorData));
        }

    } catch (err) {
        console.error("Error:", err);
        alert("Something went wrong!");
    }
});
