<script>
  import ProjectCard from "./ProjectCard.svelte";
  const projects = ["Acerta", "COVID-19 Globeview", "Other"];
</script>

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
    from {}
    to { transform: scaleY(1); }
  }

  .line {
    opacity: 0;
    animation: show-line 1s 2s;
    animation-fill-mode: forwards;
  }

  @keyframes show-line {
    from {}
    to { opacity: 1; }
  }
</style>


<div>
  <h1 class="text-2xl sm:text-4xl md:text-5xl accordion-section">Projects</h1>
  <hr class="block border border-blue-400 mt-4 line"/>
  <div class="flex flex-wrap justify-center accordion-section">
    {#each projects as project (project)}
      <div class="max-w-xs lg:max-w-lg md:max-w-md sm:max-w-sm m-6">
        <ProjectCard />
      </div>
    {/each}
  </div>
  <hr class="block border border-blue-400 mt-4 line"/>
</div>
