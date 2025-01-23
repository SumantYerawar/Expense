package com.expense.backend.controller;

import com.expense.backend.model.Expense;
import com.expense.backend.model.User;
import com.expense.backend.repository.ExpenseRepository;
import com.expense.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{userId}")
    public List<Expense> getAllExpenses(@PathVariable Long userId) {
        return expenseRepository.findByUserId(userId);
    }

    @PostMapping("/{userId}")
    public ResponseEntity<?> createExpense(@PathVariable Long userId, @RequestBody Expense expense) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        expense.setUser(user);
        return ResponseEntity.ok(expenseRepository.save(expense));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        expenseRepository.deleteById(id);
        return ResponseEntity.ok("Expense Deleted Successfully");
    }
}
