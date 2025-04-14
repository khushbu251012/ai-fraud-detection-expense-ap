const { jsPDF } = window.jspdf;

const token = localStorage.getItem("access_token");
const username = localStorage.getItem("username") || "Test User"; // Add this in login page on success

// Call API and load charts
async function loadReports() {
  try {
    const res = await fetch("/api/expenses/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const expenses = await res.json();

    // Category-wise grouping
    const categoryTotals = {};
    const monthlyTotals = {};

    expenses.forEach(exp => {
      // Category-wise sum
      if (!categoryTotals[exp.category]) {
        categoryTotals[exp.category] = 0;
      }
      categoryTotals[exp.category] += exp.amount;

      // Monthly-wise sum
      const month = new Date(exp.date).toLocaleString("default", { month: "short" });
      if (!monthlyTotals[month]) {
        monthlyTotals[month] = 0;
      }
      monthlyTotals[month] += exp.amount;
    });

    // Draw Category Chart
    const ctx1 = document.getElementById("categoryChart").getContext("2d");
    new Chart(ctx1, {
      type: "pie",
      data: {
        labels: Object.keys(categoryTotals),
        datasets: [{
          data: Object.values(categoryTotals),
          backgroundColor: ['#f39c12', '#e74c3c', '#2ecc71', '#3498db', '#9b59b6', '#1abc9c']
        }]
      }
    });

    // Draw Monthly Trend Chart
    const sortedMonths = Object.keys(monthlyTotals).sort((a, b) => new Date(`1 ${a} 2023`) - new Date(`1 ${b} 2023`));
    const ctx2 = document.getElementById("trendChart").getContext("2d");
    new Chart(ctx2, {
      type: "line",
      data: {
        labels: sortedMonths,
        datasets: [{
          label: "Monthly Spending",
          data: sortedMonths.map(m => monthlyTotals[m]),
          borderColor: "#2ecc71",
          fill: false
        }]
      }
    });

    // PDF download logic
    document.getElementById("download-report").addEventListener("click", () => {
      const doc = new jsPDF();

      // 📋 Category Table
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Summary by Category:", 20, 35);
      let y = 45;
      doc.text("Category", 25, y);
      doc.text("Amount (Rs.)", 120, y);
      y += 10;
      for (let cat in categoryTotals) {
        doc.text(cat, 25, y);
        doc.text(categoryTotals[cat].toFixed(2).toString(), 120, y);
        y += 10;
      }

      // 📈 Monthly Table
      y += 10;
      doc.text("Monthly Trend:", 20, y);
      y += 10;
      doc.text("Month", 25, y);
      doc.text("Amount (Rs.)", 120, y);
      y += 10;
      for (let month of sortedMonths) {
        doc.text(month, 25, y);
        doc.text(monthlyTotals[month].toFixed(2).toString(), 120, y);
        y += 10;
      }

      // 🥧 Add Pie Chart
      const chartCanvas = document.getElementById("categoryChart");
      if (chartCanvas) {
        const imgData = chartCanvas.toDataURL("image/png");
        doc.text("Spending by Category Chart:", 20, y + 10);
        doc.addImage(imgData, "PNG", 30, y + 20, 150, 90);
      }

      // 💾 Save PDF
      doc.save("spending_report.pdf");
    });

  } catch (error) {
    console.error("Error loading report:", error);
  }
}

// Call on page load
loadReports();
