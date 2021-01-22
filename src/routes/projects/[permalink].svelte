<script context="module">
  import { findProject } from "./_find_project";

  export function preload(page) {
    const project = findProject(page.params.permalink);

    return { project };
  }
</script>

<script>
  export let project;
</script>

<title>
  {project.title} - Projects
</title>

<div class="flex items-center">
  <h1>{project.title}</h1>
  {#if project.link}
    <a class="ml-6" href={project.link}>Visit</a>
  {/if}
</div>

{@html project.html}
