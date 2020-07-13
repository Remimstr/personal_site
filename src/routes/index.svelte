<script>
    import Typewriter from "svelte-typewriter";
    import ProductDesign from "../components/ProductDesign.svelte";
    import ProjectsSection from "../components/ProjectsSection.svelte";
    import Carousel from "../components/Carousel.svelte";
</script>

<div class="flex flex-col flex-grow">
    <div class="flex-grow px-4 py-4 text-center">
        <Typewriter interval={65}>
            <h1 class="text-2xl sm:text-4xl md:text-5xl">{@html `&lta&gtFront End Development&lt/a&gt`}</h1>
        </Typewriter>
        <div class="w-full">
            <ProductDesign />
        </div>
        <ProjectsSection />
    </div>
	  <div class="flex-shrink px-4 py-4">
        <Carousel />
    </div>
</div>

