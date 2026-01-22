<script lang="ts">
  import Input from "./ui/input/input.svelte";
  import Button from "./ui/button/button.svelte";
  import * as NativeSelect from "$lib/components/ui/native-select/index.js";
  import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
  import { cn } from "$lib/utils";
  import { Label } from "$lib/components/ui/label/index.js";
  import DatePicker from "./date-picker.svelte";
  import { db } from "$lib/db";
  import {
    getLocalTimeZone,
    today,
    type CalendarDate,
  } from "@internationalized/date";

  let type: "expense" | "income" = $state("expense");
  let amount = $state("");
  let category = $state("");
  let description = $state("");
  let todayDate = today(getLocalTimeZone());

  let date = $state<CalendarDate | undefined>(todayDate);

  const incomeCategories = [
    "Salary",
    "Freelance",
    "Investment",
    "Gift",
    "Other",
  ];
  const expenseCategories = [
    "Food",
    "Transport",
    "Utilities",
    "Entertainment",
    "Other",
  ];

  async function handleSubmit(event: Event) {
    event.preventDefault();
    if (!amount || !category || !date) {
      alert("Please fill in all fields");
      return;
    }

    await db.tx.add({
      id: crypto.randomUUID(),
      type,
      amount: parseFloat(amount),
      description,
      category,
      date: date.toDate(getLocalTimeZone()).toString(),
      createdAt: Date.now(),
    });
    amount = "";
    category = "";
    description = "";
    date = undefined;
  }
</script>

<div class="bg-card rounded-lg shadow-md p-6 text-card-foreground">
  <h2 class="text-xl font-bold mb-4">Add Transaction</h2>

  <!-- Type Selector -->
  <div class="mb-4">
    <label
      for="type"
      class="block text-sm font-medium mb-2 text-muted-foreground">Type</label
    >

    <RadioGroup.Root value={type} class="flex gap-2 mb-4">
      <div
        class={cn(
          `flex-1 border px-2 rounded-lg font-medium transition-colors flex gap-2 items-center justify-start`,
          type === "income"
            ? "border-input [&>div]:bg-primary"
            : "bg-input/20 border-transparent"
        )}
      >
        <RadioGroup.Item
          onclick={() => (type = "income")}
          value="income"
          id="income"
        />
        <Label for="income" class="w-full py-2.5">Income</Label>
      </div>
      <div
        class={cn(
          `flex-1 border px-2 rounded-lg font-medium transition-colors flex gap-2 items-center justify-start`,
          type === "expense"
            ? "border-input [&>div]:bg-primary"
            : "bg-input/20 border-transparent"
        )}
      >
        <RadioGroup.Item
          onclick={() => (type = "expense")}
          value="expense"
          id="expense"
        />
        <Label for="expense" class="py-2.5 w-full">Expense</Label>
      </div>
    </RadioGroup.Root>
  </div>

  <!-- Amount Input -->
  <div class="mb-4">
    <label for="amount" class="block text-sm font-medium mb-1">Amount</label>
    <Input
      id="amount"
      type="number"
      bind:value={amount}
      placeholder="Rp 0"
      step="0.01"
      onkeydown={(e) => {
        if (e.key === "Enter") {
          handleSubmit(e);
        }
      }}
      class="w-full px-3 py-2"
    />
  </div>

  <!-- Category Select -->
  <div class="mb-4">
    <label for="category" class="block text-sm font-medium mb-1">Category</label
    >
    <NativeSelect.Root id="category" bind:value={category}>
      <NativeSelect.Option value="">Select {type} category</NativeSelect.Option>
      {#each type === "income" ? incomeCategories : expenseCategories as cat}
        <NativeSelect.Option value={cat}>{cat}</NativeSelect.Option>
      {/each}
    </NativeSelect.Root>
  </div>

  <!-- Description Input -->
  <div class="mb-4">
    <label for="description" class="block text-sm font-medium mb-1"
      >Description</label
    >
    <Input
      id="description"
      type="text"
      bind:value={description}
      placeholder="Enter description"
      onkeydown={(e) => {
        if (e.key === "Enter") {
          handleSubmit(e);
        }
      }}
      class="w-full px-3 py-2"
    />
  </div>

  <!-- Date Input -->
  <DatePicker bind:value={date} />

  <!-- Submit Button -->
  <Button
    onclick={(event) => handleSubmit(event)}
    class="w-full py-2 px-4 bg-background hover:bg-accent text-card-foreground"
  >
    Add Transaction
  </Button>
</div>
