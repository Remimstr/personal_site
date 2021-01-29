<script>
  import ProjectCard from "./ProjectCard.svelte";
  import projects from "../projects.json";
  export let hasBeenVisited;
</script>

<div>
  <h2 class="m-2" class:accordion-section={!hasBeenVisited}>Projects</h2>
  <hr class="block border border-blue-400" class:line={!hasBeenVisited} />
  <div
    class="flex flex-wrap justify-center mt-2"
    class:accordion-section={!hasBeenVisited}
  >
    {#each projects as project (project)}
      <div class="max-w-xs lg:max-w-lg md:max-w-md sm:max-w-sm m-4">
        <ProjectCard {...project} />
      </div>
    {/each}
  </div>
</div>

<style>
  .accordion-section {
    overflow: hidden;
    height: auto;
    transform: scaleY(0);
    transform-origin: top;

    animation: show-accordion 1s 2s;
    transition: transform 0.3s ease;
    animation-fill-mode: forwards;
  }

  @keyframes show-accordion {
    from {
    }
    to {
      transform: scaleY(1);
    }
  }

  .line {
    opacity: 0;
    animation: show-line 1s 2s;
    animation-fill-mode: forwards;
  }

  @keyframes show-line {
    from {
    }
    to {
      opacity: 1;
    }
  }
</style>
