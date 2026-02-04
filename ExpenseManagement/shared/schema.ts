
import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(), // Using numeric for currency to handle decimals properly
  category: text("category").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertExpenseSchema = createInsertSchema(expenses).omit({ 
  id: true, 
  createdAt: true 
}).extend({
  // Ensure amount is a positive number (handled as string by numeric type in drizzle-zod, but we can validate regex or coerce)
  // Actually, for numeric, drizzle-zod expects string. We can add custom validation if needed.
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid number with up to 2 decimal places"),
  date: z.coerce.date() // Allow string input for dates
});

export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type CreateExpenseRequest = InsertExpense;
export type ExpenseResponse = Expense;
