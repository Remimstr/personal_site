---
title: COVID-19 Globeview
link: https://covid19globe.remimstr.com
---

## The Concept

As COVID-19 was beginning to spread outside of China in mid-February of 2020, many people (myself included) began to pay attention. Eager to get my hands on all the COVID information that I could, I dug up statistics, news articles, visualizations, and more. Then, one day after having already sifted through half a dozen of such sources, it occurred to me that I hadn't yet seen a view of the virus' spread on a 3D globe.

Based on work I'd done at Acerta using the powerful graphing library [echarts](https://echarts.apache.org/), and having seen the globe view examples and perused the API out of curiosity, I knew I could build this tool without too much effort and that the result would be impressive. On the night of Friday March 13, I began what effectively turned into a weekend hackathon to build this project as quickly as possible and release it to the world!

## Design

From the outset, the design of this project was very simple and clear; the globe would fill the entire screen I would put additional information in the corners and the edges of the screen. I decided to use the echarts globe almost exactly as presented in its excellent documentation. Filling in the rest of the screen would be title, "About" section with credits, and various controls.

Throughout the course of building the project, the other pieces fell into place and the final design contains allow the user to interact with the chart in three ways:

- The bottom left corner contains an interactive legend mapping the colours to the number of cases
- The top right corner provides summary statistics for the highlighted region
- The right side of the page contains a timeline with play/pause functionality

![alt text](covid-globe-annotated.png "Logo Title Text 1")

## Technology Choices & Data

This project was built in the illustrious [vanilla.js](https://vanilla-js.com/) framework. All jokes aside, given that modern features like `async/await` and promised-based requests via `fetch` are now supported in modern browsers, I was interested in exploring a pure vanilla approach to making a front-end.

I obtained the data for this project from the [John Hopkins COVID-19 Data Repository](https://github.com/CSSEGISandData/COVID-19). While more data was available, I was only able to use data beginning on March 1st because that is the point at which they added geographical coordinates to their data set. I retroactively updated the app to only use data until March 21st due to the fact that the data changed and because of technical limitations that I will explain shortly.

As alluded to previously, echarts was recruited to do the bulk of the heavy lifting for rendering the globe and providing most of the accessory functionality.

## Building the Foundation

Getting that inital "something" running for this project was very straightforward. First, I initialized a new npm project, added some simple CSS to the default HTML page to give echarts the whole screen to play with and then set to making the globe.

The code required to get the globe up and running was incredibly simple (considering what you get in return for your effort) and looks something like this:

```javascript
import WorldTopology from "./world.topo.bathy.200401.jpg";
import Starfield from "./starfield.jpg";

var chart = echarts.init(document.getElementById("app"));
chart.setOption({
  globe: {
    viewControl: {
      autoRotate: false,
    },
    shading: "realistic",
    baseTexture: WorldTopology,
    heightTexture: WorldTopology,
    environment: Starfield,
    realisticMaterial: {
      roughness: 0.9,
    },
    light: {
      ambient: {
        intensity: 0.8,
        shadow: true,
      },
      main: {
        intensity: 0.8,
      },
    },
  },
});
```

I then wrote a helper function that constructs a query to the Github API for COVID data for the current date. This ensured that the user is always looking at current data. After recieving the data, I had to parse the CSV into JSON series that echarts could understand. Using a nifty package called [papaparse](https://papaparse.com), I queried columns by name and translated them into a JS object with fields such as `country`, `longitude`, and `confirmed` (with each of these fields being arrays of equal length).

## Intermission: Release to the World

After adding some additional touches such as the title and "About" section, I was ready to release my baby to the world. I requested the subdomain from my hosting provider, built the code, and copied it to the server. I published to Facebook and reddit "r/programming" and was thrilled with peoples' reactions!

The reddit community was wonderfully supportive of the project and provided excellent suggestions to improve the tool. Based on the feedback I received, I decided to prioritize the following items for the next release:

- Cross-browser support was a little lacking particularly on iOS devices
- Labels clipped into the globe cutting off information

The first issue was easily solved by including the correct polyfills. The second issue turned out to be effectively impossible to solve without input from the team at echarts so I came up with a workaround (outlined below).

## Adding a Timeline

Because John Hopkins offered daily updates on COVID, I knew that an interactive timeline would be a really cool feature to have. Fortunately echarts provides a feature that does exactly that, called a "timeline". I tweaked my data fetching code to make an API request per date starting from March 1st through to the current date and the transformed each one into an echarts-appropriate object; the result is an echarts "option" that contains an array of data series.

At this point, a problem that started out being relatively harmless began to manifest itself into a serious problem: Github throttling. Github only allows unauthenticated users to make 50 API requests per IP address per hour. I knew there were a couple of solutions to this problem:

- Provide my Github credentials in the bundled code to make authenticated requests (**VERY BAD** - never do this!)
- Download the data to my own server (I don't have a great host for this and I didn't know if it could handle the traffic)
- Attempt to cache data from repeat requests as a stop-gap issue until 50 days had elapsed

I chose the last option, which worked decently well albiet with some significant challenges and risks.

## Caching API Requests

I knew that a service worker could help me cache data fetched from the API so I implemented a service worker that listens to `fetch` requests and serves them from the cache if they exists already. This solution was acceptable in this scenario because I knew the data was not going to change (and thus the cache become stale) and the cache would never grow too big.

Once I implemented the service worker, the app behaved in such a way that on initial page load, the user would make `x` requests to Github, and on each refresh, requests would be served from the cache instead (limiting the total number of requests to 1 per day, regardless of the number of site visits).

## Tooltip Clipping Workaround

After a decent bit of fruitless investigation into the tooltip clipping issue, I decided to get rid of the tooltips altogether. In its stead, I built the "Statistics" section in the top right corner to report everything that was previously in the tooltip (country/region name and case counts). I realized that it could also be irritating to have the stats change unexpectedly when a user was navigating the globe and accidentally hovered over a new region so I implemented controls below to set whether statistics were to be updated on "hover" or "click".

My implementation of the "hover" vs. "click" settings toggle was rudimentary but effective. I record whether the user has selected to update the "Statistics" section on click in a state value called `shouldClick`. Then, I have event handlers set up to listen for both `mouseover` and `click` that trigger in a mutually exclusive fashion (ie. based on the value of `shouldClick`, only one event will be processed).

## Release to the World v2

On March 15th, I released my updated version to the world with significantly less fanfare than the first iteration. However, the updates were well received and I was pleased that the tool had become more interactive and feature-rich (especialy with the introduction of the timeline). Given that this was the end of my "hackathon" weekend, I began to wind down development and think about putting the project into a maintenance state.

## Ethical Dilemma

Shortly after releasing the updated dashboard to the world, I stumbled across a couple of articles that had me wondering if I should have created this project in the first place:

- [Ten Considerations Before You Create Another Chart About COVID-19](https://medium.com/nightingale/ten-considerations-before-you-create-another-chart-about-covid-19-27d3bd691be8)
- [Mapping coronavirus, responsibly](https://www.esri.com/arcgis-blog/products/product/mapping/mapping-coronavirus-responsibly/?fbclid=IwAR1l_T73emqkZhsWFOpr0DtE86aKec7Opd8QXrnhrfhqWLXA79WdV_vPdwY)

Based on the recommendations of these articles, I decided that my initial approach to building this dashboard _was_ a little careless but that I could take a few steps to mitigate the potential damage it could cause:

- Reduce sensationalism by converting the color scheme from yellow, orange, and red to shades of blue
- Cease to actively promote and update the project to minimize its spread
- Monitor website traffic so that if viewership spiked, I could take it down if it became too popular

Fortunately the project never became popular to the point where I felt I had to consider taking it down. The subdomain had ~10k total hits for the month, an indetermine number of which may have been bots.

## Final Thoughts

This project was really interesting on a couple of fronts. From a social perspective, I learned that I should think harder about the impact of my work, especially when working with data that is so meaningful to so many people.

From a techical perspective, I learned that vanilla JS is quite feature-rich these days, though not to the point where building feature-rich UIs is an enjoyable experience. In subsequent projects of this scope I have reached for more powerful tools such as React and Svelte. Finally, I learned some other technical goodies such as parsing CSVs in JS, making requests to the Github API, and navigating service workers.

If I hadn't been so laser-focused on building this project and getting it out there as quickly as possible, I would've possibly made more thoughtful design choices, such as serving COVID data from my own backend, or creating an automated deployment system. But then again, if I hadn't taken this approach, this project may have never reached the stage where I can discuss it as I just have.

Thus I think the most important lesson I learned from this project is that a messy, imperfect project seen by many is better than a perfect one seen by none.
