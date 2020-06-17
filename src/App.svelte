<script>
    import { onMount } from "svelte";
    import Typewriter from "svelte-typewriter";
    import Vivus from "vivus";
    import ProductDesign from "./ProductDesign.svelte";

    onMount(() => {
        new Vivus("design-svg", { duration: 400 }, () => {})
    })
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
		    <Typewriter interval={70}>
            <h1 class="md:text-5xl">Front End Development</h1>
        </Typewriter>
        <div class="w-full">
            <ProductDesign />
        </div>
    </div>
</main>

<style global>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>
