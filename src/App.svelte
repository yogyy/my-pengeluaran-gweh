<script lang="ts">
  import SummaryCards from "$lib/components/summary-cards.svelte";
  import TransactionList from "$lib/components/transaction-list.svelte";
  import PWABadge from "$lib/components/PWABadge.svelte";
  import { Toaster } from "$lib/components/ui/sonner";
  import ChartPieDonutText from "$lib/components/chart-pie-donut-text.svelte";
  import { ModeWatcher } from "mode-watcher";
  import { m } from "./paraglide/messages.js";
  import Menu from "$lib/components/menu.svelte";
</script>

<main class="bg-background text-foreground min-h-screen p-4 md:p-8">
  <div class="mx-auto max-w-4xl">
    <div class="relative mb-8 flex justify-between">
      <div class="">
        <h1 class="mb-2 text-4xl font-bold">{m.title()}</h1>
        <p class="text-muted-foreground">
          {m.description()}
        </p>
      </div>
      <Menu />
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
