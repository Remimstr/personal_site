<script>
  export let status;
  export let error;

  const dev = process.env.NODE_ENV === "development";
</script>

<svelte:head>
  <title>{status}</title>
</svelte:head>

<div class="text-center m-4">
  <h1>{status}</h1>
  <p>{error.message}</p>
</div>

{#if dev && error.stack}
  <pre>{error.stack}</pre>
{/if}

<style>
  p {
    margin: 1em auto;
  }
</style>
