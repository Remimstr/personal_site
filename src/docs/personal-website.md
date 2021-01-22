---
title: This Website
---

## Finding my Way

Right from the beginning, I found the process of developing a personal website uniquely challenging. Starting from a completely blank slate and trying to decide how best to put myself and my work on display for the world was not an easy task. Like a number of projects that begin unclear, this one had multiple failed starts before I sat down and had a stern talk with myself and said "Remi, just get something out there!".

This website began with two failed starts, both of which are fairly interesting.

### Failed Start #1

My first idea was to build a terminal emulator whereby the user could discover and perform commands such as `cd` and `open resume` to navigate the directory structure and follow links. Like with my COVID dashboard, I began writing this in vanilla.js, a process which quite frankly became painful very quickly.

Ultimately I ditched this idea for a couple of reasons. First, it felt quite regressive to be giving up the richness of the web for a "quirky" but ultimately clunky and bizzare web experience. Second, it was clear that building an entire terminal emulator in the browser was going to be a lot of work, and there would always be glaringly obvious incomplete and missing features (which would leave a bad impression on my visitors). Finally, I didn't feel like this design showed off my work very well; I would have to count on this one tool to show of my work which didn't seem wise.

### Failed Start #2

The second failed start revolved around acknowledging my background in Biology/Bioinformatics and building a website featured around an animation of DNA. I had the idea that it would unravel to reveal distinct sections of the website focused on both my biology and programming work. I began work on building a 3d model of DNA in JS using a fun little tool called [zdog](https://zzz.dog).

While I was enjoying the work and making significant progress on building an accurate (possibly the first on the internet!) JavaScript model of DNA, the concept clearly wasn't solid enough to build an entire website around. One core assumption of this design was that I could divide my experience into distinct "sciency" and "non-sciency" sections. However, after thinking about it for a while, I felt that similarly to the "terminal-based" version of the website, this design didn't accurately represent me. After all, while I revere science and the scientific process, I love building stuff.

## Keep it Simple Stupid

When I decided it was finally time to stop mucking around, in the spirit of keeping things simple, I had a pretty clear idea that I wanted my site to have the following features:

- A couple of splashy animations on the homescreen to show off my design and development sensibilities
- A "card" for each project to give visitors a taste of my work without getting into too much detail
- A page for each project to give visitors insight into my process and work (this!)

Of course it wouldn't be a `remimstr` website without my signature orange (a favourite color and nod to my dutch heritage if you were curious). This gave me a helfup starting point for the simple menu and will surely dictate other facets of the website as it grows.

## Tech Choices

Because this was an entirely front-end project, I wanted to take the opportunity to learn some new technology. Writing this website in React would have been quite easy but given my 2+ years of experience of React at Acerta, I would likely not have learned much. Instead, I chose to use Svelte along with TailwindCSS to make up my simple front-end stack. In retrospect, I am quite pleased with this tech stack and the learning curve for both of these technologies was really quite miniscule. The challenges in developing this website instead lie within the custom CSS I wrote for the fully custom "Product Design" animation and the application structure surrounding Svelte + Sapper + Markdown.

## The "Splashy" Homescreen Animations

Ok I have to confesss that of the two animations on the homescreen ("Web Development" and "Product Design"), one took at most 15 minutes, and the other took 5+ hours. The "Web Development" typewriter effect is one for which I admittedly cheaped out and used a third party library: [svelte-typewriter](https://github.com/henriquehbr/svelte-typewriter). Upon learning that I was going to have to take a JS approach and render each character one-by-one, I devolved into my primal form of a lazy JS developer and I can't say I regret that decision very much ¯\\_(ツ)_/¯.

In contrast to this feature, creating the "Product Design" animation was a lot of work. Fortunately I knew right from the beginning how I wanted it to look. I began with pen and paper, drawing out the word "Product Design" and then overlaying the various shapes on top (the circle, rectangle, semi-circle, and triangles). Then I cracked open The GIMP and typed out my letters, sliced them into their various components using shape overlays, and then converted them into SVG paths. I made sure to very mindful of the dimensions of each SVG that I exported.

The next task was to import the SVGs and along with other DOM elements, build them into a cohesive Svelte component. The various shapes that I created, pre-animation, out of `div`s ranged in complexity from being nearly trivial (such as the circle and rectangle) to fiendishly difficult (each of the triangles and the semi-circle). For example, rendering the triangles with an outline required that I make use of a linear gradient, which took me reading through a number of examples on the w3 schools website to understand. The resulting code looks like this:

```JavaScript
background:
		linear-gradient(
				37deg,
				transparent 50%,
				maroon 50%,
				maroon calc(50% + var(--border-width)),
				transparent calc(50% + var(--border-width))
		)
		no-repeat;
```

Rendering the semi-circle that fits into the circle was even more difficult and involved reading even more w3 schools examples. The resulting code for that looks like this:

```JavaScript
background: radial-gradient(
		circle closest-corner
		at calc(var(--border-width) * -6) 50%,
		transparent calc(var(--offset) - var(--border-width)),
		goldenrod calc(var(--offset) - var(--border-width)),
		transparent calc(var(--offset)),
		transparent 50%
```

Next, the task of applying animations to each of these components using keyframes was its own learning experience. Here the rotating rectangle takes the cake for being the most difficult animation. It consists of two very carefully aligned top and bottom pieces that are both translated in the z-axis so when rotated to the horizontal position they align to the top and bottom of the animation respectively. Then, fairly intuitively, the pieces are offset by `90deg` in the x-axis, making the animation quite simply to rotate each piece by `90deg`. The other pieces were fairly straightforward to animate because they were just varied rotations.

One factor that turned out to be fairly challenging was making the component resizable. To ensure the CSS didn't devolve into a completely unmaintainable plate of spaghetti code, I created a few css variables, `--height` and `--border-width` that I could change from within media queries. This solution worked extremely well for the purposes of keeping the main CSS code abstract.

I am quite pleased with how the homescreen animations turned out; I think they are showy enough without being obnoxious and in the case of the "Product Design" animation in particular, show off my skills in design and CSS.

## To Be Continued... (writeup incomplete)
