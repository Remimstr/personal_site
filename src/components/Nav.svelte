<script>
	export let segment;

	let menuExpanded = false;
</script>

<!--suppress CssUnusedSymbol -->
<style>
	.selected {
		position: relative;
		display: inline-block;
	}

	.selected::after {
		position: absolute;
		content: '';
		width: calc(100%);
		height: 2px;
		background-color: lightblue;
		display: block;
		bottom: -1px;
	}
</style>

<nav class="flex items-center justify-between flex-wrap text-white bg-orange-500 p-3">
    <span class="font-semibold text-xl tracking-tight mr-8">
		    <a class='text-white {segment === undefined ? "selected" : ""}' href=".">Remi Marchand</a>
    </span>

		<div class="block md:hidden" on:click={() => menuExpanded = !menuExpanded}>
				<button class="flex items-center px-3 py-2 border rounded hover:border-primary hover:text-primary">
            <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
				</button>
		</div>

		<div class="w-full block flex-grow md:flex md:items-center md:w-auto" class:hidden={!menuExpanded}>
					<ul class="block flex-grow font-normal list-none ml-0">
							<li class="block mt-4 md:inline-block md:mt-0 mr-4"><a class="text-white" href="https://resume.remimstr.com">Resume</a></li>
							<li class="block mt-4 md:inline-block md:mt-0 mr-4"><a class="text-white" href="https://github.com/remimstr">Github</a></li>
					</ul>

        <div>
		      <a class='block mt-4 md:inline-block md:mt-0 mr-4 text-white {segment === "about-me" ? "selected" : ""}' href="./about-me">About Me</a>
        </div>
		</div>

</nav>
