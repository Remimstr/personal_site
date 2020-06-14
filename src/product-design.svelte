<script>
  import Pro from "../public/assets/pro.svg";
  import D from "../public/assets/d.svg";
  import UctDe from "../public/assets/uctde.svg";
  import Ign from "../public/assets/ign.svg";
  import Sig from "../public/assets/sig.svg";
</script>

<style>
    .piece {
        float: left;
        position: relative;
    }
		.circle {
				width: 38px;
				height: 38px;
				border: 1px green solid;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				transform: rotate(45deg);
				animation:
				    spin 1s 1s;
        animation-fill-mode: forwards;
		}

		@keyframes spin {
				from {}
				to { transform: rotate(360deg)}
		}

		.inv-circle-section {
				top: -19px;
				height: 38px;
				width: 25px;
				left: -13px;
				position: absolute;
				border-top: 1px goldenrod solid;
				border-bottom: 1px goldenrod solid;
				border-right: 1px goldenrod solid;
        background: radial-gradient(
            circle closest-corner
		        at -6px 50%,
		        transparent 19px,
		        goldenrod 19px,
		        transparent 20px,
		        transparent 50%
        );
				animation:
				  inv-circle-rotate 1s 1s;
		}

		@keyframes inv-circle-rotate {
				from {}
				to { transform: rotate3D(1, 0, 0, 180deg)}
		}

		.d {
				transform: rotate3D(1, 0, 0, 180deg);
				animation:
				  d-rotate 1s 1s;
        animation-fill-mode: forwards;
    }

		@keyframes d-rotate {
				from {}
				to { transform: rotate3D(0, 0, 0, 0deg) }
		}

		.rect {
				top: 19px;
        transform-style: preserve-3d;
        transition: transform .3s;
				animation: rect-rotate 1s 1s;
				animation-fill-mode: forwards;
		}
    .top {
		    height: 38px;
        border: 1px red solid;
        transform: translateZ(19px);
		    background: repeating-linear-gradient(
		        45deg,
		        red 10px,
		        white 20px
		    )
    }
    .bottom {
		    height: 38px;
        border: 1px red solid;
        transform: rotateX(-90deg) translateZ(-19px);
    }

    @keyframes rect-rotate {
        100% { transform: rotateX(90deg) translateZ(19px); }
    }

		.upper-tri {
				position: relative;
				border-top: 1px maroon solid;
				border-right: 1px maroon solid;
				left: 2px;
				background:
						linear-gradient(
								37deg,
								transparent 50%,
								maroon 50%,
								maroon calc(50% + 1px),
								transparent calc(50% + 1px)
						)
						no-repeat;
				background-size: 100% 100%;
        transform-origin: 0 0;
				transform: rotate(53deg);
				animation:
					upper-tri-rotate 1s 1s;
        animation-fill-mode: forwards;
		}

		@keyframes upper-tri-rotate {
				from {}
				to { transform: rotate(0deg)}
		}

		.lower-tri {
				position: absolute;
        border-bottom: 1px solid turquoise;
				border-left: 1px solid turquoise;
				background:
						linear-gradient(
								37deg,
								transparent 50%,
								turquoise 50%,
								turquoise calc(50% + 1px),
								transparent calc(50% + 1px)
						)
						no-repeat;
				background-size: 100% 100%;
				transform-origin: 0 100%;
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
</style>

<span class="flex justify-center items-center">
	<div class="piece circle">
		<Pro/>
	</div>
	<div class="piece">
		<div class="inv-circle-section"/>
	</div>
	<div class="d">
	  <D/>
	</div>
	<div class="piece rect">
		<p class="top"/>
		<p class="bottom">
				<UctDe />
		</p>
	</div>
	<div class="piece">
		<div class="lower-tri">
			<Sig />
		</div>
		<div class="upper-tri">
			<Ign />
		</div>
	</div>
</span>
