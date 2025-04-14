document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem('access_token');
  if (!token) {
    alert("Please login first.");
    window.location.href = "/login/";
    return;
  }

  const expenseContainer = document.getElementById('expenseList');

  // 🔁 STEP 1: Fetch user expenses
  async function fetchExpenses() {
    try {
      const response = await fetch('/api/expenses/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const expenses = await response.json();
      console.log("📥 Fetched Expenses:", expenses);

      expenseContainer.innerHTML = ''; // clear previous

      // 🔁 STEP 2: Loop & check each expense
      for (let exp of expenses) {
        const isFraud = await checkFraud(exp);
        const row = createExpenseRow(exp, isFraud);
        expenseContainer.appendChild(row);
      }

    } catch (error) {
      console.error("❌ Error fetching expenses:", error);
      alert("Error loading expenses.");
    }
  }

  // 🔍 STEP 3: Check each expense with fraud API
  async function checkFraud(exp) {
    try {
      const response = await fetch('/api/fraud/check/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: exp.amount,
          category: exp.category,
          description: exp.description,
          date: exp.date
        })
      });

      const data = await response.json();
      console.log("🔎 Fraud Check Result:", data);
      return data.is_fraud;

    } catch (err) {
      console.error("❌ Error checking fraud:", err);
      return false;
    }
  }

  // 🧾 STEP 4: Create table row
  function createExpenseRow(exp, isFraud) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>₹${exp.amount}</td>
      <td>${exp.category}</td>
      <td>${exp.description}</td>
      <td>${isFraud ? '🚨 Fraud' : '✅ Safe'}</td>
    `;
    tr.style.backgroundColor = isFraud ? '#ffdddd' : '#ddffdd';
    return tr;
  }

  // ⏱️ On load
  fetchExpenses();
});
