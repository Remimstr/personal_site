<script>
  import Pro from "./product_design_helpers/pro.svelte";
  import D from "./product_design_helpers/d.svelte";
  import UctDe from "./product_design_helpers/uctde.svelte";
  import Ign from "./product_design_helpers/ign.svelte";
  import Sig from "./product_design_helpers/sig.svelte";

  export let hasBeenVisited = false;
</script>

<style>
		:root {
				--border-width: 2px;
				--height: 55px;
				--half-height: calc(var(--height) / 2);
		}
    .piece {
        float: left;
        position: relative;
    }
		.circle {
				width: var(--height);
        min-width: var(--height);
				border: var(--border-width) green solid;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
		}

		.circle-transformed {
        transform: rotate(75deg);
        animation:
                spin 1s 1s;
        animation-fill-mode: forwards;
		}

		@keyframes spin {
				from {}
				to { transform: rotate(360deg); }
		}

		.inv-circle-section {
				--offset: var(--half-height);
				/* This relationship is spurious */
				--width: calc(var(--height) / 1.44);
				top: calc(0px - var(--offset));
				height: calc(var(--height));
				width: var(--width);
				min-width: var(--width);
				/* This relationship may be spurious */
				left: calc(var(--width) - var(--height) + var(--border-width) / 2);
				position: absolute;
				border: var(--border-width) goldenrod solid;
				border-left: none;
        background: radial-gradient(
            circle closest-corner
		        at calc(var(--border-width) * -6) 50%,
		        transparent calc(var(--offset) - var(--border-width)),
		        goldenrod calc(var(--offset) - var(--border-width)),
		        transparent calc(var(--offset)),
		        transparent 50%
        );
		}

		.inv-circle-section-transformed {
        animation:
						inv-circle-rotate 1s 1s;
		}

		@keyframes inv-circle-rotate {
				from {}
				to { transform: rotate3D(1, 0, 0, 180deg); }
		}

		.d {
				height: var(--height);
				/* This relationship is spurious */
				width: calc(var(--height) / 2.6);
				min-width: calc(var(--height) / 2.6);
				border: var(--border-width) transparent solid;
    }

		.d-transformed {
        transform: rotate3D(1, 0, 0, 180deg);
        animation:
						d-rotate 1s 1s;
        animation-fill-mode: forwards;
		}

		@keyframes d-rotate {
				from {}
				to { transform: rotate3D(0, 0, 0, 0deg); }
		}

		.rect {
				top: calc(var(--half-height));
				/* This relationship is spurious */
        width: calc(var(--height) * 1.9);
				min-width: calc(var(--height) * 1.9);
        transform-style: preserve-3d;
        transition: transform .3s;
				animation: rect-rotate 1s 1s;
				animation-fill-mode: forwards;
		}

    .top {
		    height: var(--height);
        border: var(--border-width) red solid;
        transform: translateZ(var(--half-height));
		    background: repeating-linear-gradient(
		        45deg,
		        lightcoral 10px,
		        white 20px
		    );
    }
    .bottom {
		    height: var(--height);
        border: var(--border-width) red solid;
        transform: rotateX(-90deg) translateZ(calc(0px - var(--half-height)));
    }

    .plain-rect {
		    /* To compensate for when the rect makes the component occupy more space */
		    margin: calc(var(--half-height)) 0;
        width: calc(var(--height) * 1.9);
        min-width: calc(var(--height) * 1.9);
        border: var(--border-width) red solid;
        height: var(--height);
    }

    @keyframes rect-rotate {
		    from {}
        to { transform: rotateX(90deg) translateZ(var(--half-height)); }
    }

		.upper-tri {
				height: var(--height);
				/* This relationship is spurious */
				width: calc(var(--height) * 1.28);
				min-width: calc(var(--height) * 1.28);
				position: relative;
				border-top: var(--border-width) maroon solid;
				border-right: var(--border-width) maroon solid;
				/* This relationship is spurious */
				left: calc((var(--border-width) * 2) - 1px);
				background:
						linear-gradient(
								37deg,
								transparent 50%,
								maroon 50%,
								maroon calc(50% + var(--border-width)),
								transparent calc(50% + var(--border-width))
						)
						no-repeat;
				background-size: 100% 100%;
        transform-origin: 0 0;
		}

		.upper-tri-transformed {
        transform: rotate(53deg);
        animation:
                upper-tri-rotate 1s 1s;
        animation-fill-mode: forwards;
		}

		@keyframes upper-tri-rotate {
				from {}
				to { transform: rotate(0deg); }
		}

		.lower-tri {
				height: var(--height);
        /* This relationship is spurious */
        width: calc(var(--height) * 1.28);
				min-width: calc(var(--height) * 1.28);
				position: absolute;
        border-bottom: var(--border-width) solid turquoise;
				border-left: var(--border-width) solid turquoise;
				background:
						linear-gradient(
								37deg,
								transparent 50%,
								turquoise 50%,
								turquoise calc(50% + var(--border-width)),
								transparent calc(50% + var(--border-width))
						)
						no-repeat;
				background-size: 100% 100%;
				transform-origin: 0 100%;
		}

		.lower-tri-transformed {
        transform: rotate(-180deg);
        animation:
                rotate-lower-tri 1s 1s;
        animation-fill-mode: forwards;
		}

		@keyframes rotate-lower-tri {
				from {}
				to {
						transform: rotate(-360deg);
				}
		}

    @media only screen and (min-width: 640px) {
        :root {
            --height: 65px;
        }
    }

    @media only screen and (min-width: 768px) {
        :root {
            --border-width: 3px;
            --height: 100px;
        }
    }
</style>

<div class="flex justify-center items-center">
	<div class="piece circle" class:circle-transformed={!hasBeenVisited}>
		<Pro class="h-full w-full"/>
	</div>
	<div class="piece">
		<div class="inv-circle-section" class:inv-circle-section-transformed={!hasBeenVisited}></div>
	</div>
	<div class="d" class:d-transformed={!hasBeenVisited}>
	  <D class="h-full w-full"/>
	</div>
	<div class="piece rect" class:rect={!hasBeenVisited} class:plain-rect={hasBeenVisited}>
		<div class:top={!hasBeenVisited}></div>
		<div class:bottom={!hasBeenVisited}>
				<UctDe class="h-full w-full"/>
		</div>
	</div>
	<div class="piece">
		<div class="lower-tri" class:lower-tri-transformed={!hasBeenVisited}>
			<Sig class="h-full w-full"/>
		</div>
		<div class="upper-tri" class:upper-tri-transformed={!hasBeenVisited}>
			<Ign class="h-full w-full"/>
		</div>
	</div>
</div>

