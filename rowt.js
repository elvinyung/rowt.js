// rowt.js - a simple URL router. 

var _routeObject;
var _routeIgnore = ['_'];

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

  for (routeRegex in _routeObject)
  {
    var routeParamNames = _routeObject[routeRegex][0];
    var routeParamTypes = _routeObject[routeRegex][1];
    var routeAction = _routeObject[routeRegex][2];
    var routeRegex = new RegExp(routeRegex);

    var routeMatch = routeRegex.exec(urlHash);
    if (!!routeMatch)
    {
      routeMatch = routeMatch.slice(1);

      var routeParams = {};
      for (index in routeParamNames)
      {
        typeConvert = typeConversionFns[routeParamTypes[index]];
        routeParamVal = typeConvert(routeMatch[index])
        routeParams[routeParamNames[index]] = routeParamVal;
      }

      routeAction(routeParams);
      return;
    }
  }

};

var registerRoute = function(route, routeAction) {
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
    else if (token[0] == '{' && token[token.length-1] == '}')
    {
      //handle `{param}` cases
      var regexStr = token(1, token.length-1);
      if (!!(new Regexp(regexStr)))
      {
        routeRegex += regexStr;
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

  _routeObject[routeRegex] = [routeParamNames, routeParamTypes, routeAction];
}

var initRowt = function() {
  if (!("onhashchange" in window))
  {
    throw "onhashchange not supported in this browser";
  }

  _routeObject = _routeObject || {};
  window.onhashchange = routeHandler;

  return {
    addRoute: function(route, routeAction) {
      registerRoute(route, routeAction);
    },
    addRoutes: function(routeDict) {
      for (route in routeDict) {
        registerRoute(route, routeDict[route]);
      }
    },
    removeRoute: function(route) {
      if (!_routeObject[route]) {
        return;
      };
      delete _routeObject[route]; 
    },
    getRoute: function(route) {
      return _routeObject[route];
    },
    otherwiseRoute: function(routeAction) {
      _routeObject.otherwise = routeAction;
    }
  };
};
