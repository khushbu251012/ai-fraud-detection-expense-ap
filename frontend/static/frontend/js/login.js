document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        const response = await fetch('http://127.0.0.1:8000/api/users/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        console.log("Login Response:", data);

        if (response.status === 200 && data.access && data.refresh) {
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);

            alert('Login Successful! Redirecting to Dashboard...');
            window.location.href = '/dashboard/';
        } else {
            document.getElementById('error-message').innerHTML = '<p style="color:red;">Invalid username or password</p>';
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert("Something went wrong during login. Please try again.");
    }
});
