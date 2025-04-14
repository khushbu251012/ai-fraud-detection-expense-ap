document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("access_token");
  const budgetForm = document.getElementById("budget-form");
  const budgetList = document.getElementById("budgetList");

  // Default Add Budget Logic
  function defaultSubmit(e) {
    e.preventDefault();

    const category = document.getElementById("category").value.trim();
    const amountValue = document.getElementById("amount").value.trim();
    const amount = parseFloat(amountValue);
    const start_date = document.getElementById("start-date").value;
    const end_date = document.getElementById("end-date").value;

    if (!category || isNaN(amount) || !start_date || !end_date) {
      alert("❗ Please fill all fields correctly.");
      return;
    }

    fetch("http://127.0.0.1:8000/api/budgets/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        category,
        amount,
        start_date,
        end_date,
      }),
    })
      .then(res => res.json().then(data => {
        if (res.ok) {
          alert("✅ Budget Added!");
          budgetForm.reset();
          fetchBudgets();
          fetchBudgetSummary(); // 🔁 reload summary after add
        } else {
          alert("❌ Error: " + JSON.stringify(data));
        }
      }))
      .catch(error => {
        console.error("⚠️ Fetch Error:", error);
        alert("Something went wrong while adding budget!");
      });
  }

  // Attach default add logic initially
  budgetForm.addEventListener("submit", defaultSubmit);

  // Fetch and show all budgets
  function fetchBudgets() {
    fetch("http://127.0.0.1:8000/api/budgets/", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        budgetList.innerHTML = ""; // clear old
        data.forEach(item => {
          const budgetItem = document.createElement("div");
          budgetItem.classList.add("card", "mb-2", "p-3", "shadow");
          budgetItem.innerHTML = `
            <h5>₹${item.amount} - ${item.category}</h5>
            <p><strong>From:</strong> ${item.start_date} <strong>To:</strong> ${item.end_date}</p>
            <button class="btn btn-primary btn-sm edit-btn" data-id="${item.id}">Edit</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${item.id}">Delete</button>
          `;
          budgetList.appendChild(budgetItem);
        });
      });
  }

  // Fetch & Show Budget Summary (category-wise)
  function fetchBudgetSummary() {
    fetch("http://127.0.0.1:8000/api/budgets/summary/", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const summaryContainer = document.getElementById("budget-summary");
        summaryContainer.innerHTML = "";

        data.forEach(item => {
          let color = item.remaining < 0 ? "red" : "green";

          summaryContainer.innerHTML += `
            <div class="summary-card">
              <h4>📊 ${item.category}</h4>
              <p><b>Budget:</b> ₹${item.budget}</p>
              <p><b>Spent:</b> ₹${item.spent}</p>
              <p><b style="color:${color}">Remaining:</b> ₹${item.remaining}</p>
              <hr/>
            </div>
          `;
        });
      });
  }

  //  Edit Budget
  budgetList.addEventListener("click", function (e) {
    if (e.target.classList.contains("edit-btn")) {
      const id = e.target.getAttribute("data-id");

      fetch(`http://127.0.0.1:8000/api/budgets/${id}/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          document.getElementById("category").value = data.category;
          document.getElementById("amount").value = data.amount;
          document.getElementById("start-date").value = data.start_date;
          document.getElementById("end-date").value = data.end_date;

          // 🔁 Remove default handler
          budgetForm.removeEventListener("submit", defaultSubmit);

          // 🔁 Create edit handler
          const editHandler = function (e) {
            e.preventDefault();

            const updatedData = {
              category: document.getElementById("category").value,
              amount: parseFloat(document.getElementById("amount").value),
              start_date: document.getElementById("start-date").value,
              end_date: document.getElementById("end-date").value,
            };

            fetch(`http://127.0.0.1:8000/api/budgets/${id}/`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify(updatedData),
            })
              .then((res) => {
                if (res.ok) {
                  alert("Budget Updated!");
                  budgetForm.reset();
                  fetchBudgets();
                  fetchBudgetSummary(); // 🔁 update summary after edit

                  // ✅ Restore original handler
                  budgetForm.removeEventListener("submit", editHandler);
                  budgetForm.addEventListener("submit", defaultSubmit);
                } else {
                  res.json().then((data) => {
                    alert("Error: " + JSON.stringify(data));
                  });
                }
              });
          };

          // 🛠️ Attach temporary edit handler
          budgetForm.addEventListener("submit", editHandler);
        });
    }
  });

  // ❌ Delete Budget
  budgetList.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn")) {
      const id = e.target.getAttribute("data-id");

      fetch(`http://127.0.0.1:8000/api/budgets/${id}/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }).then(() => {
        alert("Deleted!");
        fetchBudgets();
        fetchBudgetSummary(); // 🔁 refresh after delete
      });
    }
  });

  // 🔃 Initial Load
  fetchBudgets();
  fetchBudgetSummary(); // 👈 added summary
});
