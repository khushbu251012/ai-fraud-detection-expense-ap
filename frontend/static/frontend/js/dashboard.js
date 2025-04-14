document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        alert('Please login first!');
        window.location.href = '/frontend/login/';
        return;
    }

    const response = await fetch('/api/users/profile/', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    });

    if (response.status === 200) {
        const data = await response.json();
        document.getElementById('username').textContent = data.username;
        document.getElementById('email').textContent = data.email;
        document.getElementById('joined').textContent = data.date_joined;
    } else {
        alert('Session expired! Please login again.');
        localStorage.clear();
        window.location.href = '/frontend/login/';
    }
});
