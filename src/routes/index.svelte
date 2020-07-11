<script>
    import Typewriter from "svelte-typewriter";
    import ProductDesign from "../components/ProductDesign.svelte";
    import ProjectsSection from "../components/ProjectsSection.svelte";
</script>

<main>
    <nav class="flex items-center justify-between flex-wrap text-white bg-orange-500 p-5">
        <span class="font-semibold text-xl text-white tracking-tight mr-6">Remi Marchand</span>

        <div class="block flex-grow">
            <span class="ml-4">Resume</span>
            <span class="ml-4">Github</span>
        </div>

        <button class="m">
            Contact
        </button>
    </nav>
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

