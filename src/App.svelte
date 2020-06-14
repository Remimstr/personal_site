<script>
    import { onMount } from "svelte";
    import Typewriter from "svelte-typewriter";
    import Design from "../public/assets/design.svg";
    import Vivus from "vivus";
    import Cube from "./cube.svelte";
    import Pro from "./product-design.svelte";

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
            <h1 class="text-4xl">Front End Development</h1>
        </Typewriter>
        <div class="w-full">
	          <Design id="design-svg" class="display-block m-auto w-48 h-auto" />
        </div>
        <div class="w-full">
            <Pro />
        </div>
    </div>
</main>

<style global>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>
