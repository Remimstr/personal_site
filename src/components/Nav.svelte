<script>
	export let segment;
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

<nav class="flex items-center justify-between flex-wrap text-white bg-orange-500 p-5">
    <span class="font-semibold text-xl tracking-tight mr-6">
		    <a class='text-white {segment === undefined ? "selected" : ""}' href=".">Remi Marchand</a>
    </span>

    <ul class="block flex-grow font-normal list-none">
		    <li class="float-left ml-5"><a class="text-white" href="https://resume.remimstr.com">Resume</a></li>
		    <li class="float-left ml-5"><a class="text-white" href="https://github.com/remimstr">Github</a></li>
    </ul>

    <button class="m">
        Contact
    </button>
</nav>
