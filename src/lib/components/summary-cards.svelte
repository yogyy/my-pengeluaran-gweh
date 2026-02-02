<script lang="ts">
  import { db } from "$lib/db";
  import { cn, formatCurrency, getRangeByPeriod } from "$lib/utils";
  import { liveQuery } from "dexie";
  import TransactionForm from "./transaction-form.svelte";

  const { start, end } = getRangeByPeriod("30d");

  const totals = liveQuery(async () => {
    const rows = await db.tx
      .where("createdAt")
      .between(start, end, true, true)
      .toArray();

    const income = rows
      .filter((tx) => tx.type === "income")
      .reduce((acc, r) => acc + r.amount, 0);

    const expense = rows
      .filter((tx) => tx.type === "expense")
      .reduce((acc, r) => acc + r.amount, 0);

    return { income, expense, balance: income - expense };
  });

  let balance = $derived($totals?.balance ?? 0);
</script>

<div class="grid gap-4 pb-4 md:grid-cols-2">
  <div class="bg-card border-accent rounded-lg border p-6 shadow-md">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium">Cash</p>
        <p
          class={cn(
            "mt-2 text-xl font-bold md:text-3xl",
            balance < 0 ? "text-destructive italic" : "",
          )}
        >
          {formatCurrency(balance)}
        </p>
      </div>
    </div>
  </div>

  <TransactionForm />
</div>
