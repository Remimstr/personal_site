<script>
  export let title;
  export let description;
  export let image = undefined;
  export let readMore;
  export let projectLink = undefined;
</script>

<template>
  <div
    data-cy="project-card"
    class="w-full lg:flex lg:max-w-full border rounded-lg shadow hover:shadow-md"
  >
    {#if image}
      <div
        class="h-48 lg:h-auto lg:w-32 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
        style="background-image: url({image})"
        title="{title} Screenshot"
      />
    {/if}
    <div class="flex justify-between flex-col text-left mt-4 ml-4 mr-4 mb-2">
      <h1 class="font-bold">{title}</h1>
      <p>
        {description}
        <a href={readMore} class="cursor-pointer">Learn More</a>
      </p>

      {#if projectLink}
        <a href={projectLink} class="self-end cursor-pointer">Link</a>
      {/if}
    </div>
  </div>
</template>
