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
  import { m } from "../../paraglide/messages.js";
  import { currency } from "$lib/store/currency.js";

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
    food: { icon: Soup, label: m.tsx_food(), color: "#f97316" },
    transport: { icon: Bus, label: m.tsx_transport(), color: "#3b82f6" },
    utilities: { icon: Zap, label: m.tsx_util(), color: "#eab308" },
    entertainment: { icon: Film, label: m.tsx_entertain(), color: "#8b5cf6" },

    salary: { icon: Briefcase, label: m.tsx_salary(), color: "#22c55e" },
    freelance: { icon: TrendingUp, label: m.tsx_freelance(), color: "#14b8a6" },
    investment: { icon: TrendingUp, label: m.tsx_invest(), color: "#0ea5e9" },
    gift: { icon: Gift, label: m.tsx_gift(), color: "#ec4899" },

    other: { icon: Ellipsis, label: m.tsx_other(), color: "#6b7280" },
  };
</script>

<div class="bg-card text-card-foreground rounded-lg pt-2.5 shadow-md">
  <h2 class="mb-4 px-2 text-xl font-bold">Transactions</h2>
  <div class="mb-6 flex gap-2 px-2.5">
    <Button
      onclick={() => (filterType = "all")}
      class={cn(
        "rounded-lg px-4 py-2 font-medium",
        filterType === "all"
          ? "bg-primary "
          : "bg-secondary text-secondary-foreground",
      )}
    >
      {m.tsx_all_btn()}
    </Button>
    <Button
      onclick={() => (filterType = "income")}
      class={cn(
        "rounded-lg px-4 py-2 font-medium",
        filterType === "income"
          ? "bg-primary "
          : "bg-secondary text-secondary-foreground",
      )}
    >
      {m.tsx_in_btn()}
    </Button>
    <Button
      onclick={() => (filterType = "expense")}
      class={cn(
        "rounded-lg px-4 py-2 font-medium",
        filterType === "expense"
          ? "bg-primary "
          : "bg-secondary text-secondary-foreground",
      )}
    >
      {m.tsx_out_btn()}
    </Button>
  </div>
  <div class="flex flex-col">
    {#if !filteredTransactions}
      <p class="text-muted-foreground py-8 text-center">
        {m.tsx_no_item()}
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
            class="bg-muted text-muted-foreground group flex touch-none items-center justify-between rounded-lg border-t p-1.5 px-4 first:border-none"
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
      onclick={() => toast.warning(m.tsx_more_warn())}
      >{m.tsx_more_btn()}</Button
    >
  </div>
</div>
