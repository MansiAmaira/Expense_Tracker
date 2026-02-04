package com.expense.tracker.service;

import com.expense.tracker.model.Expense;
import com.expense.tracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    @Autowired
    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public List<Expense> getExpenses(String category, String sortOrder) {
        Sort sort = Sort.by("date");
        if ("date_desc".equals(sortOrder)) {
            sort = sort.descending();
        } else {
            sort = sort.ascending();
        }

        if (category != null && !category.isEmpty()) {
            return expenseRepository.findByCategory(category, sort);
        } else {
            return expenseRepository.findAll(sort);
        }
    }

    public Optional<Expense> getExpense(Long id) {
        return expenseRepository.findById(id);
    }

    public Expense createExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
}
