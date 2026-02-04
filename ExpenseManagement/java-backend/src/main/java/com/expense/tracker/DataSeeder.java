package com.expense.tracker;

import com.expense.tracker.model.Expense;
import com.expense.tracker.repository.ExpenseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ExpenseRepository expenseRepository;

    public DataSeeder(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (expenseRepository.count() == 0) {
            LocalDateTime today = LocalDateTime.now();
            LocalDateTime yesterday = today.minusDays(1);
            LocalDateTime firstOfMonth = LocalDateTime.of(today.getYear(), today.getMonth(), 1, 0, 0);

            expenseRepository.save(new Expense(new BigDecimal("120.50"), "Food", "Grocery shopping at Local Market", today));
            expenseRepository.save(new Expense(new BigDecimal("45.00"), "Transport", "Uber ride to office", yesterday));
            expenseRepository.save(new Expense(new BigDecimal("1500.00"), "Utilities", "Internet Bill", firstOfMonth));
        }
    }
}
