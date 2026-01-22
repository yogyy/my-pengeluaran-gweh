<script lang="ts">
  import SummaryCards from "$lib/components/summary-cards.svelte";
  import TransactionForm from "$lib/components/transaction-form.svelte";
  import TransactionList from "$lib/components/transaction-list.svelte";
  import PWABadge from "$lib/components/PWABadge.svelte";
</script>

<main class="min-h-screen bg-background p-4 md:p-8 text-foreground">
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-2">Expense Tracker</h1>
      <p class="text-muted-foreground">
        Manage your income and expenses efficiently
      </p>
    </div>

    <!-- Summary Cards -->
    <SummaryCards />

    <!-- Main Content -->
    <div class="grid md:grid-cols-3 gap-8 mt-8">
      <!-- Form -->
      <div class="md:col-span-1">
        <TransactionForm />
      </div>

      <!-- Transactions List -->
      <div class="md:col-span-2">
        <TransactionList />
      </div>
    </div>
  </div>
</main>

<PWABadge />
