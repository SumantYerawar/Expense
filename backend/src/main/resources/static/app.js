document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("login-btn");
    const registerBtn = document.getElementById("register-btn");
    const authSection = document.getElementById("auth-section");
    const expenseSection = document.getElementById("expense-section");
    const authForm = document.getElementById("auth-form");
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");

    let currentUser = null;

    loginBtn.addEventListener("click", () => {
        authSection.style.display = "block";
        expenseSection.style.display = "none";
        document.getElementById("form-title").textContent = "Login";
    });

    registerBtn.addEventListener("click", () => {
        authSection.style.display = "block";
        expenseSection.style.display = "none";
        document.getElementById("form-title").textContent = "Register";
    });

    authForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const endpoint = document.getElementById("form-title").textContent === "Login"
            ? "http://localhost:8080/api/users/login"
            : "http://localhost:8080/api/users/register";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();

            if (response.ok) {
                currentUser = data;
                alert(`Welcome, ${data.username}!`);
                authSection.style.display = "none";
                expenseSection.style.display = "block";
                fetchExpenses();
            } else {
                alert(data);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });

    expenseForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const name = document.getElementById("expense-name").value;
        const amount = parseFloat(document.getElementById("expense-amount").value);
        const category = document.getElementById("expense-category").value;
        const date = document.getElementById("expense-date").value;

        try {
            const response = await fetch(`http://localhost:8080/api/expenses/${currentUser.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, amount, category, date })
            });
            if (response.ok) {
                fetchExpenses();
                expenseForm.reset();
            } else {
                alert("Failed to add expense");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });

    async function fetchExpenses() {
        try {
            const response = await fetch(`http://localhost:8080/api/expenses/${currentUser.id}`);
            const expenses = await response.json();
            expenseList.innerHTML = "";
            expenses.forEach((expense) => {
                const li = document.createElement("li");
                li.textContent = `${expense.name} - $${expense.amount} (${expense.category}) on ${expense.date}`;
                expenseList.appendChild(li);
            });
        } catch (error) {
            console.error("Error:", error);
        }
    }
});
