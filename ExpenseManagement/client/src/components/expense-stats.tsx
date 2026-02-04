import { useExpenses } from "@/hooks/use-expenses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, TrendingDown, DollarSign, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function ExpenseStats() {
  const { data: expenses, isLoading } = useExpenses();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  const total = expenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;
  const count = expenses?.length || 0;
  
  // Calculate average (mock logic for now, could be more complex)
  const average = count > 0 ? total / count : 0;

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      <Card className="shadow-lg border-primary/10 bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <DollarSign className="w-24 h-24 text-primary" />
        </div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Expenses
          </CardTitle>
          <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center text-primary">
            <DollarSign className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-display tracking-tight text-primary">
            ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Lifetime spending
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Transactions
          </CardTitle>
          <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
            <Wallet className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-display text-foreground">
            {count}
          </div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center">
            <span className="text-emerald-500 flex items-center mr-1">
              <ArrowUpRight className="h-3 w-3 mr-0.5" /> +2
            </span>
            since last week
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Average Spend
          </CardTitle>
          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <TrendingDown className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-display text-foreground">
            ${average.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Per transaction
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
