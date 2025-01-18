const apiUrl = "http://localhost:8080/api/expenses";

// Fetch expenses and display them
function fetchExpenses() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const expenseList = document.getElementById("expense-list");
            expenseList.innerHTML = "";
            data.forEach(expense => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${expense.name}</td>
                    <td>${expense.amount}</td>
                    <td>${expense.category}</td>
                    <td>${expense.date}</td>
                    <td><button onclick="deleteExpense(${expense.id})">Delete</button></td>
                `;
                expenseList.appendChild(row);
            });
        });
}

// Add a new expense
const form = document.getElementById("expense-form");
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const expense = {
        name: document.getElementById("name").value,
        amount: parseFloat(document.getElementById("amount").value),
        category: document.getElementById("category").value,
        date: document.getElementById("date").value
    };

    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(expense)
    }).then(() => {
        fetchExpenses();
        form.reset();
    });
});

// Delete an expense
function deleteExpense(id) {
    fetch(`${apiUrl}/${id}`, {
        method: "DELETE"
    }).then(() => fetchExpenses());
}

// Initial fetch
fetchExpenses();