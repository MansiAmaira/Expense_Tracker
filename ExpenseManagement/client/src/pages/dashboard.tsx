import { useState } from "react";
import { useExpenses, useDeleteExpense } from "@/hooks/use-expenses";
import { ExpenseForm } from "@/components/expense-form";
import { ExpenseStats } from "@/components/expense-stats";
import { Layout } from "@/components/layout";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2, 
  Calendar, 
  Filter,
  ArrowUpDown
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<'date_desc' | 'date_asc'>('date_desc');
  
  const { data: expenses, isLoading, isError } = useExpenses({ 
    category: categoryFilter,
    sort: sortOrder 
  });
  
  const { mutate: deleteExpense } = useDeleteExpense();

  const filteredExpenses = expenses?.filter(expense => 
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSort = () => {
    setSortOrder(prev => prev === 'date_desc' ? 'date_asc' : 'date_desc');
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1 text-lg">
              Track, manage, and optimize your spending.
            </p>
          </div>
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 rounded-xl px-6">
                <Plus className="mr-2 h-5 w-5" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-display">New Expense</DialogTitle>
                <DialogDescription>
                  Enter the details of your transaction below.
                </DialogDescription>
              </DialogHeader>
              <ExpenseForm onSuccess={() => setIsAddOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <ExpenseStats />

        <div className="bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/20">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search transactions..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-background border-border/60 focus:bg-background transition-colors rounded-xl"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-xl shrink-0">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setCategoryFilter("all")}>
                    All Categories
                  </DropdownMenuItem>
                  {["Food", "Transport", "Utilities", "Entertainment", "Shopping", "Health", "Other"].map(cat => (
                    <DropdownMenuItem key={cat} onClick={() => setCategoryFilter(cat)}>
                      {cat}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSort}
                className="rounded-xl shrink-0"
                title="Sort by Date"
              >
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
               Showing {filteredExpenses?.length || 0} transactions
            </div>
          </div>

          <div className="relative min-h-[400px]">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-24" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                  <Filter className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold">Failed to load expenses</h3>
                <p className="text-muted-foreground mt-2">Please check your connection and try again.</p>
              </div>
            ) : filteredExpenses?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-12 text-center min-h-[400px]">
                <div className="bg-muted rounded-full p-4 mb-4">
                  <Calendar className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">No expenses found</h3>
                <p className="text-muted-foreground mt-2 max-w-sm">
                  {searchTerm 
                    ? "Try adjusting your search or filters to find what you're looking for." 
                    : "You haven't logged any expenses yet. Add your first transaction to get started."}
                </p>
                {!searchTerm && (
                   <Button 
                     className="mt-6" 
                     onClick={() => setIsAddOpen(true)}
                   >
                     Add First Expense
                   </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead className="w-[180px] pl-6">Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right pr-6">Amount</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredExpenses?.map((expense) => (
                      <motion.tr 
                        key={expense.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="group hover:bg-muted/30 border-border/40 transition-colors"
                      >
                        <TableCell className="pl-6 font-medium text-muted-foreground">
                          {format(new Date(expense.date), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {expense.description}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground font-normal border-0">
                            {expense.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6 font-mono font-medium text-foreground">
                          ${Number(expense.amount).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive cursor-pointer"
                                onClick={() => deleteExpense(expense.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
