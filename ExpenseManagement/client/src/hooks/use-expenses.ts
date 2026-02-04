import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type ExpenseInput } from "@shared/routes";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

// Fetch expenses list
export function useExpenses(filters?: { category?: string; sort?: 'date_desc' | 'date_asc' }) {
  const queryParams = new URLSearchParams();
  if (filters?.category && filters.category !== "all") queryParams.append("category", filters.category);
  if (filters?.sort) queryParams.append("sort", filters.sort);

  return useQuery({
    queryKey: [api.expenses.list.path, filters],
    queryFn: async () => {
      const url = `${api.expenses.list.path}?${queryParams.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch expenses");
      return api.expenses.list.responses[200].parse(await res.json());
    },
  });
}

// Fetch single expense
export function useExpense(id: number) {
  return useQuery({
    queryKey: [api.expenses.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.expenses.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch expense");
      return api.expenses.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// Create expense
export function useCreateExpense() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ExpenseInput) => {
      // Ensure date is properly coerced or handled if API expects specific format
      // Zod schema on backend expects date object/string, sending ISO string is safest for JSON
      const payload = {
        ...data,
        date: data.date instanceof Date ? data.date.toISOString() : data.date
      };

      const res = await fetch(api.expenses.create.path, {
        method: api.expenses.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to create expense");
      }
      return api.expenses.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.expenses.list.path] });
      toast({
        title: "Expense logged",
        description: "Your expense has been successfully recorded.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Delete expense
export function useDeleteExpense() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.expenses.delete.path, { id });
      const res = await fetch(url, { method: api.expenses.delete.method });
      
      if (!res.ok) {
        if (res.status === 404) throw new Error("Expense not found");
        throw new Error("Failed to delete expense");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.expenses.list.path] });
      toast({
        title: "Expense deleted",
        description: "The expense has been removed from your history.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
