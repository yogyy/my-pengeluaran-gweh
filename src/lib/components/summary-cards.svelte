<script lang="ts">
  import { db } from "$lib/db";
  import { formatCurrency } from "$lib/utils";
  import { Banknote, BanknoteArrowDown, BanknoteArrowUp } from "@lucide/svelte";
  import { liveQuery } from "dexie";

  const totalIncome = liveQuery(async () => {
    const rows = await db.tx.where("type").equals("income").toArray();

    return rows.reduce((acc, r) => acc + r.amount, 0);
  });

  const totalExpense = liveQuery(async () => {
    const rows = await db.tx.where("type").equals("expense").toArray();

    return rows.reduce((acc, r) => acc + r.amount, 0);
  });

  let balance = $state(0);

  $effect(() => {
    balance = $totalIncome - $totalExpense;
  });
</script>

<div class="grid md:grid-cols-3 gap-4">
  <!-- Income Card -->
  <div
    class="bg-card text-card-foreground rounded-lg shadow-md p-6 border border-accent"
  >
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium">Total Income</p>
        <p class="text-xl md:text-3xl font-bold text-green-600 mt-2">
          {formatCurrency($totalIncome)}
        </p>
      </div>
      <BanknoteArrowUp class="text-green-600" size="32" />
    </div>
  </div>

  <!-- Expense Card -->
  <div class="bg-card rounded-lg shadow-md p-6 border border-accent">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium">Total Expenses</p>
        <p class="text-xl md:text-3xl font-bold text-red-600 mt-2">
          {formatCurrency($totalExpense)}
        </p>
      </div>
      <BanknoteArrowDown class="text-red-600 text-4xl" size="32" />
    </div>
  </div>

  <!-- Balance Card -->
  <div class="bg-card rounded-lg shadow-md p-6 border border-accent">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium">Balance</p>
        <p class="text-xl md:text-3xl font-bold mt-2">
          {formatCurrency(balance)}
        </p>
      </div>
      <Banknote class="text-blue-600 text-4xl" size="32" />
    </div>
  </div>
</div>
