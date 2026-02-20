<script>
  import * as NativeSelect from "$lib/components/ui/native-select/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { getLocale, setLocale } from "../../paraglide/runtime.js";
  import { m } from "../../paraglide/messages.js";
  import Button from "./ui/button/button.svelte";
  import DarkModeToggle from "./dark-mode-toggle.svelte";
  import { Menu } from "@lucide/svelte";
  import { currency } from "$lib/store/currency.js";

  let currentLang = $state(getLocale());

  $effect(() => {
    setLocale(currentLang);
  });
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline" size="icon-lg"><Menu /></Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end" class="space-y-2">
    <div class="flex items-center justify-between gap-2.5">
      <span>{m.menu_theme()}</span>
      <DarkModeToggle />
    </div>
    <div class="flex items-center justify-between gap-2.5">
      <span>{m.menu_language()}</span>
      <NativeSelect.Root
        aria-label={m.label_select_lang()}
        bind:value={currentLang}
      >
        <NativeSelect.Option value="en">English</NativeSelect.Option>
        <NativeSelect.Option value="id">Indonesia</NativeSelect.Option>
      </NativeSelect.Root>
    </div>
    <div class="flex items-center justify-between gap-2.5">
      <span>{m.menu_currency()}</span>
      <NativeSelect.Root
        aria-label={m.label_select_lang()}
        bind:value={$currency}
      >
        <NativeSelect.Option value="USD">$ USD</NativeSelect.Option>
        <NativeSelect.Option value="IDR">Rp IDR</NativeSelect.Option>
      </NativeSelect.Root>
    </div>
  </DropdownMenu.Content>
</DropdownMenu.Root>
