document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("access_token");

  // 🔐 Check token
  if (!token) {
    console.log("🚫 Token missing. Redirecting to login.");
    window.location.href = "/login/";
    return;
  }

  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // 🔍 Fetch Profile Data
  fetch("/api/users/profile/", {
    method: "GET",
    headers,
  })
    .then((res) => {
      if (res.status === 401 || res.status === 403) {
        console.error("❌ Unauthorized! Redirecting to login...");
        localStorage.removeItem("access_token");
        window.location.href = "/login/";
        return;
      }
      return res.json();
    })
    .then((data) => {
      if (data && data.username && data.email) {
        document.getElementById("username").value = data.username;
        document.getElementById("email").value = data.email;
        console.log("✅ Profile loaded:", data);
      } else {
        console.warn("⚠️ Unexpected response format:", data);
      }
    })
    .catch((err) => {
      console.error("⚠️ Error loading profile:", err);
      alert("Server error while loading profile. Please try again.");
    });

  // ✏️ Update Profile
  const form = document.getElementById("profile-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const updatedData = {
        username: document.getElementById("username").value.trim(),
        email: document.getElementById("email").value.trim(),
      };

      const password = document.getElementById("password").value.trim();
      if (password.length > 0) {
        updatedData.password = password;
      }

      console.log("📤 Updating profile with:", updatedData);

      fetch("/api/users/profile/", {
        method: "PUT",
        headers,
        body: JSON.stringify(updatedData),
      })
        .then((res) => {
          if (res.status === 200 || res.status === 202) {
            return res.json();
          } else if (res.status === 400) {
            return res.json().then((data) => {
              throw new Error(data.detail || "Bad Request");
            });
          } else {
            throw new Error("Update failed with status " + res.status);
          }
        })
        .then((data) => {
          console.log("✅ Profile update response:", data);
          alert("🎉 Profile updated successfully!");
          document.getElementById("password").value = ""; // Clear password field after update
        })
        .catch((err) => {
          console.error("⚠️ Error updating profile:", err);
          alert("❌ Profile update failed: " + err.message);
        });
    });
  }

  // 🚪 Logout Feature
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      alert("👋 Logged out successfully.");
      window.location.href = "/login/";
    });
  }
});
