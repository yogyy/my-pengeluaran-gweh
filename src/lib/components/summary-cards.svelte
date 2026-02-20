<script lang="ts">
  import { db } from "$lib/db";
  import { cn, formatCurrency, getRangeByPeriod } from "$lib/utils";
  import Dexie, { liveQuery } from "dexie";
  import TransactionForm from "./transaction-form.svelte";
  import { m } from "../../paraglide/messages.js";
  import { currency } from "$lib/store/currency.js";

  const { start, end } = getRangeByPeriod("30d");

  const totals = liveQuery(async () => {
    let income = 0;
    let expense = 0;

    await db.tx
      .where("[type+createdAt]")
      .between(["income", start], ["income", Dexie.maxKey], true, true)
      .each((r) => {
        income += r.amount;
      });

    await db.tx
      .where("[type+createdAt]")
      .between(["expense", start], ["expense", Dexie.maxKey], true, true)
      .each((r) => {
        expense += r.amount;
      });

    return { income, expense, balance: income - expense };
  });

  let balance = $derived($totals?.balance ?? 0);
</script>

<div class="grid gap-4 pb-4 md:grid-cols-2">
  <div class="bg-card border-accent rounded-lg border p-6 shadow-md">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium">{m.cash()}</p>
        <p
          class={cn(
            "mt-2 text-xl font-bold md:text-3xl",
            balance < 0 ? "text-destructive italic" : "",
          )}
        >
          {formatCurrency(balance, $currency)}
        </p>
      </div>
    </div>
  </div>

  <TransactionForm />
</div>
