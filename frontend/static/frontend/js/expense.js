document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("access_token");
  const expenseList = document.getElementById("expense-list");
  const expenseForm = document.getElementById("expense-form");

  // 🔃 Load all expenses
  fetch("http://127.0.0.1:8000/api/expenses/", {
      method: "GET",
      headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json",
      },
  })
  .then(response => response.json())
  .then(data => {
      data.forEach(expense => {
          renderExpenseCard(expense);
      });
  })
  .catch(error => console.error("Error fetching expenses:", error));

  // ➕ Add new expense
  expenseForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const amount = document.getElementById("amount").value;
      const category = document.getElementById("category").value;
      const date = document.getElementById("date").value;
      const description = document.getElementById("description").value;

      const expenseData = { amount, category, date, description };

      fetch("http://127.0.0.1:8000/api/expenses/", {
          method: "POST",
          headers: {
              "Authorization": "Bearer " + token,
              "Content-Type": "application/json",
          },
          body: JSON.stringify(expenseData),
      })
      .then(response => response.json())
      .then(data => {
          renderExpenseCard(data);
          expenseForm.reset();
      })
      .catch(error => console.error("Error adding expense:", error));
  });

  // 🎴 Render card
  function renderExpenseCard(expense) {
      const card = document.createElement("div");
      card.className = "expense-card";
      card.dataset.id = expense.id;
      card.innerHTML = `
          <h3>₹${expense.amount} - ${expense.category}</h3>
          <p><strong>Date:</strong> ${expense.date}</p>
          <p><strong>Description:</strong> ${expense.description}</p>
          <div class="card-buttons">
              <button class="edit-btn">Edit</button>
              <button class="delete-btn">Delete</button>
          </div>
      `;

      // 🗑️ DELETE
      card.querySelector(".delete-btn").addEventListener("click", () => {
          fetch(`http://127.0.0.1:8000/api/expenses/${expense.id}/`, {
              method: "DELETE",
              headers: {
                  "Authorization": "Bearer " + token,
              },
          })
          .then(() => {
              card.remove();
          })
          .catch(error => console.error("Error deleting:", error));
      });

      // ✏️ EDIT (popup form logic can be added later)
      card.querySelector(".edit-btn").addEventListener("click", () => {
          const newAmount = prompt("New Amount:", expense.amount);
          if (newAmount !== null) {
              fetch(`http://127.0.0.1:8000/api/expenses/${expense.id}/`, {
                  method: "PUT",
                  headers: {
                      "Authorization": "Bearer " + token,
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                      ...expense,
                      amount: newAmount
                  }),
              })
              .then(response => response.json())
              .then(updated => {
                  card.querySelector("h3").textContent = `₹${updated.amount} - ${updated.category}`;
              });
          }
      });

      expenseList.appendChild(card);
  }
});
