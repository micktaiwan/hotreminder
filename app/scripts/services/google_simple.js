// Done very quickly :)

'use strict';

angular.module('google', []).factory('Google', function ($rootScope, $routeParams) {

    var user;

    var extractToken = function(hash) {
      if(!hash) return false;
      var match = hash.match(/access_token=([^&]+)/);
      return !!match && match[1];
    };

    var setting = {
      'host':     "https://accounts.google.com/o/oauth2/auth",
      'clientId': '156435181273.apps.googleusercontent.com'
    };

    var doAuth = function(callback) {
      var token = extractToken($routeParams.params);
      if (token) {
        $.ajax({ // FIXME: use Angular's $ressource ?
            url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token='+token,
            beforeSend: function (xhr) {
              xhr.setRequestHeader('Authorization', "OAuth " + token);
              xhr.setRequestHeader('Accept',        "application/json");
            },
            success: function (response) {
              callback(response);
            }
        });
      } else {
        $rootScope.authUrl = setting.host +
          "?response_type=token" +
          "&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile" +
          "&client_id="    + setting.clientId +
          "&redirect_uri=" + window.location;
      }
    };

    return {

      login: function(callbackSuccess, callbackError){
        doAuth(function(response){
          if (response) {
            user = response;
            callbackSuccess(user);
          } else {
            callbackError();
          }
        });
        return user;
      },

      logout: function() {
        user = null;
      },

      getUser: function(){
        return user;
      }

    }

  });
