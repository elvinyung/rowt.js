# rowt.js
### by [Elvin Yung](https://github.com/elvinyung)

## Description
Clienside JS hash routing thing. 

## Instructions
Include `rowt.js` somewhere in your webpage.

Initialize routing by attaching `initRowt()` to a variable. This returns an object containing the routing methods (see **Routing Functions**, below).

## Routing Functions
* `addRoute(route, routeAction)`: Registers the route `route`, a string, to `routeAction`, a function which consumes an object of route parameters.
* `addRoutes(routeDict)`: Registers all route-action pairs (respectively a string and a function).
* `removeRoute(route)`: Removes the route action function associated with the given `route` string.
* `getRoute(route)`: Returns the route action function associated with the given `route` string.