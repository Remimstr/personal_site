<script>
		import Carousel from "@beyonk/svelte-carousel";
		import tippy from "sveltejs-tippy";

		const logos = [
				{
            image: "logos/react.png",
						name: "React",
						description: "React is my goto web development library. I've used it at Acerta for over 2 years"
				},
				{
            image: "logos/typescript.png",
						name: "TypeScript",
						description: "Since converting Acerta's front-end to TypeScript, I can't imagine going back. I LOVE type safety, code completion, and more!"
				},
				{
            image: "logos/echarts.png",
						name: "Echarts",
						description: "Echarts is an extremely powerful charting library with a very well documented object-based API."
				},
				{
            image: "logos/docker.png",
						name: "Docker",
						description: "The tool that needs no introduction, I've wrapped a number of webapps into Docker containers for deployment."
				},
				{
            image: "logos/moqups.png",
						name: "Moqups",
						description: "Before designing website mocks in Moqups, I wrote them out by hand. This tool is a fantastic way to convey ideas."
				},
				{
            image: "logos/styled-components.png",
						name: "Styled Components",
						description: "One of the best ways to deal with CSS in a big front-end project, I love how Styled Components makes JS/CS interop so easy!"
				},
				{
            image: "logos/tailwind-css.svg",
						name: "Tailwind CSS",
						description: "When building a custom UI from scratch, I now reach for tailwind. Despite a learning curve that looks daunting, it's not that hard."
				},
				{
            image: "logos/svelte.png",
						name: "Svelte",
						description: "Being that it's the new kid on the block, I haven't spent a lot of time with Svelte, but building this website with it was a joy!"
				},
        {
            image: "logos/antd.jpeg",
            name: "Antd",
            description: "The heavy-lifting enterprise library for UI components that doesn't look google-y. Would recommend."
        },
				{
				    image: "logos/rust.svg",
						name: "Rust",
						description: "I think Rust is the coolest thing since sliced bread. I'm taking every opportunity I can to learn it."
				}
		]

    function makeTippyProps(content) {
		  return {
				content: `<div class="tippy-tooltip">${content}</div>`,
				allowHTML: true,
				placement: "bottom"
      }
    };

    let carousel;

		function enter() {
		  carousel.pause();
		}

		function leave() {
		  carousel.resume();
		}

		export let hasBeenVisited;
</script>

<style>
		.carousel-section {
				opacity: 0;
        animation: show-carousel-section 1s 2s;
				animation-fill-mode: forwards;
		}

		@keyframes show-carousel-section {
				from {}
				to { opacity: 1; }
		}

		:global(.tippy-tooltip) {
				text-align: center;
				font-size: 1rem;
		}
</style>

<div class="flex flex-col items-center" class:carousel-section={!hasBeenVisited}>
    <h2 class="accordion-section m-2">My Favourite Tech</h2>
    <hr class="w-full block border border-blue-400 line"/>
		<div class="w-full lg:w-3/5 md:w-4/5">
			<Carousel perPage={{ 800: 6, 500: 3 }} easing="ease-in-out" autoplay=2000 dots={false} controls={false} bind:this={carousel}>
				{#each logos as logo (logo)}
					<div class="flex flex-col slide-content cursor-pointer" on:mouseenter={enter} on:mouseleave={leave}>
						<img class="h-12 object-scale-down m-3" src={logo.image} alt="{logo.name} logo" use:tippy={makeTippyProps(logo.description)} />
					</div>
				{/each}
			</Carousel>
		</div>
</div>
