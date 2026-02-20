<script lang="ts">
  import * as Chart from "$lib/components/ui/chart/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Arc, PieChart, Text } from "layerchart";
  import Dexie, { liveQuery } from "dexie";
  import { db } from "$lib/db";
  import { formatCurrency, getRangeByPeriod } from "$lib/utils";
  import NumberFlow from "@number-flow/svelte";
  import { m } from "../../paraglide/messages.js";
  import { currency } from "$lib/store/currency.js";

  const CATEGORY_COLORS: Record<string, string> = {
    food: "var(--chart-1)",
    transport: "var(--chart-2)",
    utilities: "var(--chart-3)",
    entertainment: "var(--chart-4)",
    other: "var(--chart-5)",
  };

  const chartConfig = {
    amount: { label: "Amount" },
    food: { label: "Food", color: "var(--chart-1)" },
    transport: { label: "Transport", color: "var(--chart-2)" },
    utilities: { label: "Utilities", color: "var(--chart-3)" },
    entertainment: { label: "Entertainment", color: "var(--chart-4)" },
    other: { label: "Other", color: "var(--chart-5)" },
  } satisfies Chart.ChartConfig;

  const { start, end } = getRangeByPeriod("30d");

  let transactions = liveQuery(() =>
    db.tx
      .where("[type+createdAt]")
      .between(["expense", start], ["expense", Dexie.maxKey], true, true)
      .toArray(),
  );

  let totalExpense = $derived(
    ($transactions ?? []).reduce((acc, r) => acc + r.amount, 0),
  );

  let chartData = $derived.by(() => {
    const tx = $transactions ?? [];

    const summary = tx.reduce<Record<string, number>>((acc, t) => {
      const key = t.category.toLowerCase();
      acc[key] = (acc[key] ?? 0) + t.amount;
      return acc;
    }, {});

    return Object.keys(CATEGORY_COLORS).map((category) => ({
      category,
      amount: summary[category] ?? 0,
      color: CATEGORY_COLORS[category],
    }));
  });

  let selectedPie = $state<number | null>(null);

  let showTooltip = $state(false);

  $effect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    showTooltip = mq.matches;

    const handler = (e: MediaQueryListEvent) => {
      showTooltip = e.matches;
    };

    mq.addEventListener("change", handler);

    return () => mq.removeEventListener("change", handler);
  });
</script>

<Card.Root class="flex flex-col">
  <Card.Header class="items-center">
    <Card.Title>{m.chart_title()}</Card.Title>
    <Card.Description>
      {m.chart_desc()}
      <NumberFlow
        value={totalExpense}
        format={{
          style: "currency",
          currency: "IDR",
          trailingZeroDisplay: "stripIfInteger",
        }}
        class="text-card-foreground"
      />
    </Card.Description>
  </Card.Header>
  <Card.Content class="flex-1">
    <Chart.Container
      config={chartConfig}
      class="mx-auto aspect-square max-h-[250px]"
    >
      <PieChart
        data={chartData}
        key="category"
        value="amount"
        c="color"
        innerRadius={65}
        padding={28}
        props={{
          pie: { motion: "tween" },
        }}
      >
        {#snippet aboveMarks()}
          <Text
            value={selectedPie != null
              ? formatCurrency(chartData[selectedPie].amount, $currency)
              : String(formatCurrency(totalExpense, $currency))}
            textAnchor="middle"
            verticalAnchor="middle"
            class="fill-foreground text-destructive! text-lg! font-bold"
            dy={3}
          />
          <Text
            value={selectedPie != null
              ? chartData[selectedPie].category
              : m.chart_text()}
            textAnchor="middle"
            verticalAnchor="middle"
            class="fill-muted-foreground! text-muted-foreground capitalize"
            dy={22}
          />
        {/snippet}
        {#snippet tooltip()}
          <Chart.Tooltip hideLabel formatValue hidden={!showTooltip} />
        {/snippet}
        {#snippet arc({ props, index })}
          {@const isSelected = index === selectedPie}
          {@const arcProps = isSelected
            ? { ...props, outerRadius: 60, innerRadius: 105 }
            : props}
          <Arc
            {...arcProps}
            onclick={() => (selectedPie = isSelected ? null : index)}
          />
        {/snippet}
      </PieChart>
    </Chart.Container>
  </Card.Content>
  <Card.Footer class="flex flex-wrap justify-center gap-2 text-xs">
    {#each chartData as data}
      {#if data.amount != 0}
        <div class="flex items-center justify-center gap-1.5">
          <div
            class="size-2.5 rounded-[2px]"
            style="background-color: {data.color};"
          ></div>
          <span class="capitalize">{data.category}</span>
        </div>
      {/if}
    {/each}
  </Card.Footer>
</Card.Root>
