<script lang="ts">
  import Input from "./ui/input/input.svelte";
  import Button from "./ui/button/button.svelte";
  import * as NativeSelect from "$lib/components/ui/native-select/index.js";
  import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
  import { cn } from "$lib/utils";
  import { Label } from "$lib/components/ui/label/index.js";
  import DatePicker from "./date-picker.svelte";
  import { db, type Category } from "$lib/db";
  import {
    getLocalTimeZone,
    today,
    type CalendarDate,
  } from "@internationalized/date";
  import { toast } from "svelte-sonner";
  import * as Dialog from "$lib/components/ui/dialog/index.js";

  let type: "expense" | "income" = $state("expense");
  let amount = $state("");
  let category = $state<Category>("");
  let description = $state("");
  let todayDate = today(getLocalTimeZone());

  let date = $state<CalendarDate | undefined>(todayDate);

  const incomeCategories = [
    "salary",
    "freelance",
    "investment",
    "gift",
    "other",
  ];
  const expenseCategories = [
    "food",
    "transport",
    "utilities",
    "entertainment",
    "other",
  ];

  let open = $state(false);

  async function handleSubmit(event: Event) {
    event.preventDefault();
    if (!amount || !category || !date) {
      toast.warning("Please fill in all fields", {
        position: "top-center",
        richColors: true,
      });
      return;
    }

    const now = new Date();

    await db.tx.add({
      id: crypto.randomUUID(),
      type,
      amount: parseFloat(amount),
      description,
      category,
      createdAt: date
        ?.toDate(getLocalTimeZone())
        .setHours(
          now.getHours(),
          now.getMinutes(),
          now.getSeconds(),
          now.getMilliseconds(),
        ),
    });
    date = todayDate;
    amount = "";
    category = "";
    description = "";

    open = false;
    toast.success("Transaction added successfully!", {
      richColors: true,
    });
  }

  function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger
    class="bg-background border-accent hover:bg-accent cursor-pointer rounded-lg border p-6 shadow-md"
  >
    Add Transactions
  </Dialog.Trigger>
  <Dialog.Content class="p-0 ">
    <div class="bg-card text-card-foreground w-full rounded-lg p-6 shadow-md">
      <h2 class="mb-4 text-xl font-bold">Add New Records</h2>

      <div class="mb-4">
        <label
          for="type"
          class="text-muted-foreground mb-2 block text-sm font-medium"
          >Type</label
        >

        <RadioGroup.Root value={type} class="mb-4 flex w-full flex-wrap gap-2">
          <div
            class={cn(
              `flex flex-1 items-center justify-start gap-2 rounded-lg border px-2 font-medium transition-colors`,
              type === "income"
                ? "border-input [&>div]:bg-primary"
                : "bg-input/20 border-transparent",
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
              `flex flex-1 items-center justify-start gap-2 rounded-lg border px-2 font-medium transition-colors`,
              type === "expense"
                ? "border-input [&>div]:bg-primary"
                : "bg-input/20 border-transparent",
            )}
          >
            <RadioGroup.Item
              onclick={() => (type = "expense")}
              value="expense"
              id="expense"
            />
            <Label for="expense" class="w-full py-2.5">Expense</Label>
          </div>
        </RadioGroup.Root>
      </div>

      <!-- Amount Input -->
      <div class="mb-4">
        <label for="amount" class="mb-1 block text-sm font-medium">Amount</label
        >
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
        <label for="category" class="mb-1 block text-sm font-medium"
          >Category</label
        >
        <NativeSelect.Root id="category" bind:value={category}>
          <NativeSelect.Option value=""
            >Select {type} category</NativeSelect.Option
          >
          {#each type === "income" ? incomeCategories : expenseCategories as cat}
            <NativeSelect.Option value={cat}>{cat}</NativeSelect.Option>
          {/each}
        </NativeSelect.Root>
      </div>

      <!-- Description Input -->
      <div class="mb-4">
        <label for="description" class="mb-1 block text-sm font-medium">
          Description
        </label>
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
        onclick={(event) => {
          handleSubmit(event);
        }}
        class="bg-background hover:bg-accent text-card-foreground w-full px-4 py-2"
      >
        Add Transaction
      </Button>
    </div>
  </Dialog.Content>
</Dialog.Root>
