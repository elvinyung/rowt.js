// rowt.js - a simple URL router. 

var routeObject = {};

var routeHandler = function() {
  urlHash = location.hash.substring(1);

  for (routeRegex in routeObject)
  {
    var routeParamNames = routeObject[routeRegex][0];
    var routeAction = routeObject[routeRegex][1]
    var routeRegex = new RegExp(routeRegex);

    var routeMatch = routeRegex.exec(urlHash);
    if (!!routeMatch)
    {
      routeMatch = routeMatch.slice(1);

      var routeParams = {};
      for (index in routeParamNames)
      {
        routeParams[routeParamNames[index]] = routeMatch[index];
      }

      routeAction(routeParams);
      break;
    }
  }

};

var rowt = function(routes) {
  if (!("onhashchange" in window))
  {
    throw "onhashchange not supported in this browser";
  }

  // convert each route rule into a regex
  for (route in routes)
  {
    var routeRegex = '';
    var routeParamNames = [];

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
        
        routeRegex += '/';
        if (paramType == 'int')
        {
           routeRegex += '(\d+)';
        }
        else if (paramType == 'float')
        {
          routeRegex += '(\d+\.\d+)';
        }
        else
        {
          routeRegex += '(.+)';
        }
      }
      else if (!token)
      {

      }
      else
      {
        routeRegex += '/' + token;
      }
    }
    routeRegex += '$';

    routeObject[routeRegex] = [routeParamNames, routes[route]];
  }

  window.onhashchange = routeHandler;
};
