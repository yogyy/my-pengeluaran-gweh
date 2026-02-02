<script lang="ts">
  import { db } from "$lib/db";
  import { liveQuery } from "dexie";
  import Button from "./ui/button/button.svelte";
  import { TrendingDown, TrendingUp } from "@lucide/svelte";
  import { formatCurrency, formatDate, getRangeByPeriod } from "$lib/utils";

  type TxInfo = "all" | "income" | "expense";
  const { start, end } = getRangeByPeriod("30d");
  let transactions = liveQuery(() =>
    db.tx
      .where("createdAt")
      .between(start, end, true, false)
      .reverse()
      .limit(7)
      .toArray(),
  );
  let filterType = $state<TxInfo>("all");

  const filteredTransactions = $derived(
    filterType == "all"
      ? $transactions
      : $transactions.filter((t) => t.type === filterType),
  );
</script>

<div class="bg-card text-card-foreground rounded-lg p-6 shadow-md">
  <h2 class="mb-4 text-xl font-bold">Transactions</h2>
  <div class="mb-6 flex gap-2">
    <Button
      onclick={() => (filterType = "all")}
      class={`rounded-lg px-4 py-2 font-medium transition-colors ${
        filterType === "all" ? "bg-primary " : "bg-secondary"
      }`}
    >
      All
    </Button>
    <Button
      onclick={() => (filterType = "income")}
      class={`rounded-lg px-4 py-2 font-medium transition-colors ${
        filterType === "income" ? "bg-primary " : "bg-secondary"
      }`}
    >
      Income
    </Button>
    <Button
      onclick={() => (filterType = "expense")}
      class={`rounded-lg px-4 py-2 font-medium transition-colors ${
        filterType === "expense" ? "bg-primary " : "bg-secondary"
      }`}
    >
      Expense
    </Button>
  </div>
  <div class="space-y-2">
    {#if !filteredTransactions}
      <p class="text-muted-foreground py-8 text-center">
        No transactions yet. Add one to get started!
      </p>
    {:else}
      {#each filteredTransactions as transaction (transaction.id)}
        <div
          class="bg-muted text-muted-foreground flex items-center justify-between rounded-lg p-4"
        >
          <div class="flex-1">
            <div class="flex items-center gap-3">
              <div
                class="bg-primary flex h-10 w-10 items-center justify-center rounded-lg text-lg"
              >
                {#if transaction.type === "income"}
                  <TrendingUp class="text-green-400" />
                {:else}
                  <TrendingDown class="text-red-400" />
                {/if}
              </div>
              <div>
                <p class="font-semibold">
                  {transaction.description}
                </p>
                <p class="text-sm">
                  {transaction.category} • {formatDate(transaction.date)}
                </p>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span
              class={`text-lg font-bold ${
                transaction.type === "income"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {transaction.type === "income" ? "+" : "-"}{formatCurrency(
                transaction.amount,
              )}
            </span>
            <Button
              size="icon-sm"
              variant="destructive"
              title="Delete transaction"
              onclick={async () => await db.tx.delete(transaction.id)}
            >
              ✕
            </Button>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>
