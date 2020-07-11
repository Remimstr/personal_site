<script>
  import ProjectCard from "./ProjectCard.svelte";
  const projects = ["Acerta", "COVID-19 Dashboard", "Other"];
</script>


<div class="flex flex-wrap justify-center">
  {#each projects as project (project)}
    <div class="max-w-xs lg:max-w-lg md:max-w-md sm:max-w-sm m-6">
      <ProjectCard />
    </div>
  {/each}
</div>
