<script>
    import Typewriter from "svelte-typewriter";
    import ProductDesign from "../components/ProductDesign.svelte";
    import ProjectsSection from "../components/ProjectsSection.svelte";
</script>

<main>
    <div class="px-4 py-4 text-center">
		    <Typewriter interval={65}>
            <h1 class="text-2xl sm:text-4xl md:text-5xl">{@html `&lta&gtFront End Development&lt/a&gt`}</h1>
        </Typewriter>
        <div class="w-full">
            <ProductDesign />
        </div>
        <ProjectsSection />
    </div>
</main>

