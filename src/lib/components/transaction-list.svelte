<script lang="ts">
  import { db } from "$lib/db";
  import { liveQuery } from "dexie";
  import Button from "./ui/button/button.svelte";
  import { TrendingDown, TrendingUp } from "@lucide/svelte";
  import { formatCurrency, formatDate } from "$lib/utils";

  type TxInfo = "all" | "income" | "expense";
  let transactions = liveQuery(() => db.tx.toArray());
  let filterType = $state<TxInfo>("all");

  const filteredTransactions = $derived(
    filterType == "all"
      ? $transactions
      : $transactions.filter((t) => t.type === filterType)
  );
</script>

<div class="bg-card text-card-foreground rounded-lg shadow-md p-6">
  <h2 class="text-xl font-bold mb-4">Transactions</h2>
  <div class="flex gap-2 mb-6">
    <Button
      onclick={() => (filterType = "all")}
      class={`px-4 py-2 rounded-lg font-medium transition-colors ${
        filterType === "all" ? "bg-primary " : "bg-secondary"
      }`}
    >
      All
    </Button>
    <Button
      onclick={() => (filterType = "income")}
      class={`px-4 py-2 rounded-lg font-medium transition-colors ${
        filterType === "income" ? "bg-primary " : "bg-secondary"
      }`}
    >
      Income
    </Button>
    <Button
      onclick={() => (filterType = "expense")}
      class={`px-4 py-2 rounded-lg font-medium transition-colors ${
        filterType === "expense" ? "bg-primary " : "bg-secondary"
      }`}
    >
      Expense
    </Button>
  </div>
  <div class="space-y-2">
    {#if !filteredTransactions}
      <p class="text-center text-muted-foreground py-8">
        No transactions yet. Add one to get started!
      </p>
    {:else}
      {#each filteredTransactions as transaction (transaction.id)}
        <div
          class="flex items-center justify-between p-4 bg-muted text-muted-foreground rounded-lg"
        >
          <div class="flex-1">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center text-lg bg-primary"
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
                transaction.amount
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
