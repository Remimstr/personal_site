<script>
  import Nav from "../components/Nav.svelte";
  export let segment;
</script>

<main class="flex flex-col">
  <Nav {segment} />
  <slot />
</main>
