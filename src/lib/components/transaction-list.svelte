<script lang="ts">
  import { db, type Category } from "$lib/db";
  import Dexie, { liveQuery } from "dexie";
  import Button from "./ui/button/button.svelte";
  import {
    Briefcase,
    Bus,
    Film,
    Gift,
    Ellipsis,
    Soup,
    TrendingUp,
    Zap,
  } from "@lucide/svelte";
  import { cn, formatCurrency, formatDate, getRangeByPeriod } from "$lib/utils";
  import type { Component } from "svelte";
  import { toast } from "svelte-sonner";
  import TransactionItem from "./transaction-item.svelte";

  type TxInfo = "all" | "income" | "expense";
  const { start, end } = getRangeByPeriod("30d");
  const PAGE_SIZE = 7;
  let page = $state(0);
  let transactions = liveQuery(() =>
    db.tx
      .where("createdAt")
      .between(start, Dexie.maxKey, true, true)
      .reverse()
      .offset(page * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .toArray(),
  );

  let filterType = $state<TxInfo>("all");

  const filteredTransactions = $derived(
    filterType == "all"
      ? $transactions
      : $transactions.filter((t) => t.type === filterType),
  );

  type CategoryConfig = {
    icon: Component;
    label: string;
    color: string;
  };

  export const categoryConfig: Record<Category, CategoryConfig> = {
    food: { icon: Soup, label: "Food & Drink", color: "#f97316" },
    transport: { icon: Bus, label: "Transport", color: "#3b82f6" },
    utilities: { icon: Zap, label: "Utilities", color: "#eab308" },
    entertainment: { icon: Film, label: "Entertainment", color: "#8b5cf6" },

    salary: { icon: Briefcase, label: "Salary", color: "#22c55e" },
    freelance: { icon: TrendingUp, label: "Freelance", color: "#14b8a6" },
    investment: { icon: TrendingUp, label: "Investment", color: "#0ea5e9" },
    gift: { icon: Gift, label: "Gift", color: "#ec4899" },

    other: { icon: Ellipsis, label: "Other", color: "#6b7280" },
  };
</script>

<div class="bg-card text-card-foreground rounded-lg pt-2.5 shadow-md">
  <h2 class="mb-4 px-2 text-xl font-bold">Transactions</h2>
  <div class="mb-6 flex gap-2 px-2.5">
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
  <div class="flex flex-col">
    {#if !filteredTransactions}
      <p class="text-muted-foreground py-8 text-center">
        No transactions yet. Add one to get started!
      </p>
    {:else}
      {#each filteredTransactions as transaction (transaction.id)}
        {@const {
          icon: Icon,
          label,
          color,
        } = categoryConfig[transaction.category]}
        <TransactionItem {transaction}>
          <div
            class="bg-muted text-muted-foreground group flex items-center justify-between rounded-lg border-t p-1.5 px-4 first:border-none"
          >
            <div class="flex-1">
              <div class="flex items-center gap-3">
                <div
                  class="bg-primary flex h-10 w-10 items-center justify-center rounded-full text-lg"
                  style={`background-color: ${color};`}
                >
                  <Icon class="text-foreground" />
                </div>
                <div class="flex flex-col">
                  <p class="font-semibold">
                    {label}
                  </p>
                  <p class="text-sm">
                    {transaction.description || "\u00A0"}
                  </p>
                </div>
              </div>
            </div>
            <div class="flex flex-col items-end gap-4 text-sm">
              <span
                class={cn(
                  "text-lg font-semibold",
                  transaction.type === "income"
                    ? "text-green-600"
                    : "text-red-600",
                )}
              >
                {transaction.type === "income" ? "+" : "-"}{formatCurrency(
                  transaction.amount,
                  $currency,
                )}
              </span>
              <span>{formatDate(transaction.createdAt)}</span>
            </div>
          </div>
        </TransactionItem>
      {/each}
    {/if}
    <Button
      variant="outline"
      class="m-2 self-end-safe"
      onclick={() => toast.warning("feature not ready")}>Show More</Button
    >
  </div>
</div>
