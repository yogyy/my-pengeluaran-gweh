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
  import { m } from "../../paraglide/messages.js";

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
      toast.warning(m.form_warn(), {
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
    toast.success(m.form_success(), {
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
    {m.add_new_tx()}
  </Dialog.Trigger>
  <Dialog.Content class="p-0 ">
    <div class="bg-card text-card-foreground w-full rounded-lg p-6 shadow-md">
      <h2 class="mb-4 text-xl font-bold">{m.form_title()}</h2>

      <div class="mb-4">
        <label
          for="type"
          class="text-muted-foreground mb-2 block text-sm font-medium"
        >
          {m.form_type()}
        </label>

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
            <Label for="income" class="w-full py-2.5">{m.form_type_1()}</Label>
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
            <Label for="expense" class="w-full py-2.5">{m.form_type_2()}</Label>
          </div>
        </RadioGroup.Root>
      </div>

      <div class="mb-4">
        <label for="amount" class="mb-1 block text-sm font-medium"
          >{m.form_ammount()}</label
        >
        <Input
          id="amount"
          type="number"
          bind:value={amount}
          placeholder={m.form_ammount_placeholder()}
          step="0.01"
          onkeydown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(e);
            }
          }}
          class="w-full px-3 py-2"
        />
      </div>

      <div class="mb-4">
        <label for="category" class="mb-1 block text-sm font-medium"
          >{m.form_category()}</label
        >
        <NativeSelect.Root id="category" bind:value={category}>
          <NativeSelect.Option value=""
            >{m.form_select_cat({
              type: m.form_type(),
            })}</NativeSelect.Option
          >
          {#each type === "income" ? incomeCategories : expenseCategories as cat}
            <NativeSelect.Option value={cat}>{cat}</NativeSelect.Option>
          {/each}
        </NativeSelect.Root>
      </div>

      <div class="mb-4">
        <label for="description" class="mb-1 block text-sm font-medium">
          {m.form_desc()}
        </label>
        <Input
          id="description"
          type="text"
          bind:value={description}
          placeholder={m.form_desc_placeholder()}
          onkeydown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(e);
            }
          }}
          class="w-full px-3 py-2"
        />
      </div>

      <DatePicker bind:value={date} />

      <Button
        onclick={(event) => {
          handleSubmit(event);
        }}
        class="bg-background hover:bg-accent text-card-foreground w-full px-4 py-2"
      >
        {m.form_button()}
      </Button>
    </div>
  </Dialog.Content>
</Dialog.Root>
