// rowt.js - a simple URL router. 

var routeObject = {};

var typeConversionFns = {
  'int': parseInt,
  'float': parseFloat,
  'bool': function(str) {
    return (str == 'true');
  },
  'any': function(str) {
    return str;
  }
}

var routeHandler = function() {
  urlHash = location.hash.substring(1).trim();

  for (routeRegex in routeObject)
  {
    var routeParamNames = routeObject[routeRegex][0];
    var routeParamTypes = routeObject[routeRegex][1];
    var routeAction = routeObject[routeRegex][2];
    var routeRegex = new RegExp(routeRegex);

    var routeMatch = routeRegex.exec(urlHash);
    if (!!routeMatch)
    {
      routeMatch = routeMatch.slice(1);

      var routeParams = {};
      for (index in routeParamNames)
      {
        typeConvert = typeConversionFns[routeParamTypes[index]];
        typedRouteParam = typeConvert(routeMatch[index])
        routeParams[routeParamNames[index]] = typedRouteParam;
      }

      routeAction(routeParams);
      break;
    }
  }

};

var addRouteToRouteObj = function(route, routeAction) {
  var routeRegex = '^';
  var routeParamNames = [];
  var routeParamTypes = [];

  var routeTokens = route.split('/');
  for (token in routeTokens)
  {
    token = routeTokens[token];
    if (token.indexOf(':') != -1)
    {
      token = token.split(':');
      var paramType = token[0];
      var paramName = token[1];
      routeParamNames.push(paramName);
      routeParamTypes.push(paramType || 'any');
      
      routeRegex += '\/';
      if (paramType == 'int')
      {
         routeRegex += '(\\d+)';
      }
      else if (paramType == 'float')
      {
        routeRegex += '(\\d+\.\\d+)';
      }
      else
      {
        routeRegex += '([^\/]+)';
      }
    }
    else if (!token)
    {

    }
    else
    {
      routeRegex += '\/' + token;
    }
  }
  routeRegex += '$';

  routeObject[routeRegex] = [routeParamNames, routeParamTypes, routeAction];
}

var rowt = function(routes) {
  if (!("onhashchange" in window))
  {
    throw "onhashchange not supported in this browser";
  }
  
  window.onhashchange = routeHandler;
  
  return {
    // init: 
    init: function(routes) {
      // convert each route rule into a regex
      for (route in routes)
      {
        addRouteToRouteObj(route, routes[route]);
      }
    },
    addRoute: function(route, routeAction) {
      addRouteToRouteObj(route, routeAction);
    },
    removeRoute: function(route) {
      routeObject[route] = null;
    }
  }
};
