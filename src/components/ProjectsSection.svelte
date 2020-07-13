<script>
  import ProjectCard from "./ProjectCard.svelte";
  const projects = [
    {
      title: "COVID-19 Globeview",
      description: "A cool idea turned weekend hackathon, I built a website to visualize the spread of COVID-19 on a Globe.",
      image: "covid-globe.png",
      readMore: "./projects/covid-19-globeview",
      projectLink: "https://covid19globe.remimstr.com"
    },
    {
      title: "Product Development @ Acerta",
      description: "Over the course of my 2+ years at Acerta, I have worked on product design, development, and planning. Constantly remaining in touch with the needs of the business, I effortlessly switch between building demos, mocks, and writing code.",
      readMore: "./projects/acerta-linepulse"
    },
    {
      title: "This Website",
      description: "What started out a simple personal website using cutting-edge new front-end tech (Svelte and Tailwind CSS) turned into an unexpectedly interesting project once I introduced advanced CSS animations and markdown parsing.",
      readMore: "./projects/personal-website",
    }
  ]
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
  <h2 class="m-2 accordion-section">Projects</h2>
  <hr class="block border border-blue-400 line"/>
  <div class="flex flex-wrap justify-center accordion-section">
    {#each projects as project (project)}
      <div class="max-w-xs lg:max-w-lg md:max-w-md sm:max-w-sm m-6">
        <ProjectCard {...project} />
      </div>
    {/each}
  </div>
</div>
