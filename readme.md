# rowt.js
### by [Elvin Yung](https://github.com/elvinyung)

## Description
Clienside JS hash routing thing. 

## Instructions
Include `rowt.js` somewhere in your webpage.

Initialize routing by calling `rowt()` with an object in which each key is a routing rule (a string in the format of `/word/:parameter`), paired with a function which takes in a `routeParams` argument.
