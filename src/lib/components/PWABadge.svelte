<script lang="ts">
  import { useRegisterSW } from "virtual:pwa-register/svelte";
  import Button from "./ui/button/button.svelte";

  // periodic sync is disabled, change the value to enable it, the period is in milliseconds
  // You can remove onRegisteredSW callback and registerPeriodicSync function
  const period = 1000 * 60 * 60;

  /**
   * This function will register a periodic sync check every hour, you can modify the interval as needed.
   */
  function registerPeriodicSync(swUrl: string, r: ServiceWorkerRegistration) {
    if (period <= 0) return;

    setInterval(async () => {
      if ("onLine" in navigator && !navigator.onLine) return;

      const resp = await fetch(swUrl, {
        cache: "no-store",
        headers: {
          cache: "no-store",
          "cache-control": "no-cache",
        },
      });

      if (resp?.status === 200) await r.update();
    }, period);
  }

  const { needRefresh, updateServiceWorker, offlineReady } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0) return;
      if (r?.active?.state === "activated") {
        registerPeriodicSync(swUrl, r);
      } else if (r?.installing) {
        r.installing.addEventListener("statechange", (e) => {
          const sw = e.target as ServiceWorker;
          if (sw.state === "activated") registerPeriodicSync(swUrl, r);
        });
      }
    },
  });

  function close() {
    needRefresh.set(false);
  }

  let toast = $derived($needRefresh);
  let message = $derived(
    $needRefresh
      ? "New content available, click on reload button to update."
      : "",
  );
</script>

{#if toast}
  <div
    class="bg-background text-foreground fixed right-0 bottom-0 z-20 m-4 rounded-[5px] border p-3 text-left shadow"
    role="alert"
    aria-labelledby="toast-message"
  >
    <div class="mb-2">
      <span id="toast-message" class="text-sm">
        {message}
      </span>
    </div>
    <div class="mr-1.5 rounded-sm px-1 py-2.5">
      {#if $needRefresh}
        <Button
          variant="outline"
          type="button"
          onclick={() => updateServiceWorker(true)}
          size="sm"
        >
          Reload
        </Button>
      {/if}
      <Button size="sm" variant="destructive" type="button" onclick={close}
        >Close</Button
      >
    </div>
  </div>
{/if}
