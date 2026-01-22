<script lang="ts">
  import Calendar from "$lib/components/ui/calendar/calendar.svelte";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
  import {
    getLocalTimeZone,
    today,
    type CalendarDate,
  } from "@internationalized/date";

  const id = $props.id();

  let open = $state(false);
  let {
    value = $bindable(),
  }: {
    value: CalendarDate | undefined;
  } = $props();
  let todayDate = today(getLocalTimeZone());
</script>

<div class="flex flex-col gap-3 mb-4">
  <Label for="{id}-date" class="px-1 w-full">Date</Label>

  <Popover.Root bind:open>
    <Popover.Trigger id="{id}-date">
      {#snippet child({ props })}
        <Button
          {...props}
          variant="outline"
          class="justify-between font-normal w-full"
        >
          {value
            ? value.toDate(getLocalTimeZone()).toLocaleDateString()
            : todayDate}
          <ChevronDownIcon />
        </Button>
      {/snippet}
    </Popover.Trigger>
    <Popover.Content class="w-auto overflow-hidden p-0" align="center">
      <Calendar
        type="single"
        years={[2020, 2021, 2023, 2024, 2025, 2026]}
        bind:value
        captionLayout="dropdown"
        onValueChange={() => {
          open = false;
        }}
        maxValue={todayDate}
      />
    </Popover.Content>
  </Popover.Root>
</div>
