<script lang="ts">
  import SummaryCards from "$lib/components/summary-cards.svelte";
  import TransactionForm from "$lib/components/transaction-form.svelte";
  import TransactionList from "$lib/components/transaction-list.svelte";
  import PWABadge from "$lib/components/PWABadge.svelte";
  import { Toaster } from "$lib/components/ui/sonner";
  import ChartPieDonutText from "$lib/components/chart-pie-donut-text.svelte";
  import { ModeWatcher } from "mode-watcher";
  import DarkModeToggle from "$lib/components/dark-mode-toggle.svelte";
</script>

<main class="bg-background text-foreground min-h-screen p-4 md:p-8">
  <div class="mx-auto max-w-4xl">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="mb-2 text-4xl font-bold">Expense Tracker</h1>
      <p class="text-muted-foreground">
        Manage your income and expenses efficiently
      </p>
    </div>
    <!-- Summary Cards -->
    <SummaryCards />
    <ChartPieDonutText />
    <!-- Main Content -->
    <div class="mt-8 gap-8">
      <!-- Transactions List -->
      <div class="md:col-span-2">
        <TransactionList />
      </div>
    </div>
  </div>
</main>
<PWABadge />
<Toaster position="top-left" />
<ModeWatcher />
