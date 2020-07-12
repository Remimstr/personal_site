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

