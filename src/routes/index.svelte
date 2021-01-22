<script>
  import Tailwindcss from "./tailwind.svelte";
  import Typewriter from "svelte-typewriter";
  import ProductDesign from "../components/ProductDesign.svelte";
  import ProjectsSection from "../components/ProjectsSection.svelte";
  import Carousel from "../components/Carousel.svelte";
  import { writable } from "svelte/store";

  let IS_VISITED_KEY = "visited";
  let visited;

  if (typeof window !== "undefined") {
    visited = writable(sessionStorage.getItem(IS_VISITED_KEY) || "0");
  }

  export let hasBeenVisited;

  if (visited) {
    visited.subscribe((value) => {
      hasBeenVisited = value === "1";
    });
  }

  let showContent = typeof hasBeenVisited !== "undefined";

  import { afterUpdate } from "svelte";

  afterUpdate(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(IS_VISITED_KEY, "1");
    }
  });

  let frontEndDevText = "<div>&lta&gtWeb Development&lt/a&gt</div>";
</script>

<Tailwindcss />

<title> Home - Remi Marchand </title>

<div class="flex flex-col flex-grow">
  <div class="flex-grow px-4 py-4 text-center">
    <!-- Don't wrap the project section to ensure it's always
		             visible so that `svelte export` know which links to follow -->
    {#if showContent}
      <div class="text-2xl sm:text-4xl md:text-5xl">
        {#if !hasBeenVisited}
          <Typewriter interval={65}>
            {@html frontEndDevText}
          </Typewriter>
        {:else}
          {@html frontEndDevText}
        {/if}
      </div>
      <div class="w-full">
        <ProductDesign {hasBeenVisited} />
      </div>
    {/if}
    <ProjectsSection {hasBeenVisited} />
  </div>
  <div class="flex-shrink px-4 py-4">
    <Carousel {hasBeenVisited} />
  </div>
</div>
