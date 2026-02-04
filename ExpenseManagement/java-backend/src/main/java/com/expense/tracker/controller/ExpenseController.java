package com.expense.tracker.controller;

import com.expense.tracker.model.Expense;
import com.expense.tracker.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    @Autowired
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public List<Expense> getExpenses(@RequestParam(required = false) String category,
                                     @RequestParam(required = false) String sort) {
        // Default sort to date_desc if not provided, consistent with TS implementation
        if (sort == null) {
            sort = "date_desc";
        }
        return expenseService.getExpenses(category, sort);
    }

    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody Expense expense) {
        Expense created = expenseService.createExpense(expense);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpense(@PathVariable Long id) {
        return expenseService.getExpense(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        if (expenseService.getExpense(id).isPresent()) {
            expenseService.deleteExpense(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
