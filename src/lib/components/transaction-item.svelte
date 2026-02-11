<script lang="ts">
  import * as ContextMenu from "$lib/components/ui/context-menu/index.js";
  import { db, type Tx } from "$lib/db";
  import { Pen, Trash } from "@lucide/svelte";
  import type { Snippet } from "svelte";

  let { children, transaction }: { children: Snippet<[]>; transaction: Tx } =
    $props();
</script>

<ContextMenu.Root>
  <ContextMenu.Trigger aria-label={transaction.category}
    >{@render children()}</ContextMenu.Trigger
  >
  <ContextMenu.Content>
    <ContextMenu.Item disabled><Pen />Edit</ContextMenu.Item>
    <ContextMenu.Item
      variant="destructive"
      onclick={() => db.tx.delete(transaction.id)}
    >
      <Trash />
      Delete
    </ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>
