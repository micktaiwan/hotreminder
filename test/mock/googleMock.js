'use strict';

angular.module('google', []).factory('Google', function ($rootScope, $routeParams) {

    var user;

    return {

      login: function(callbackSuccess, callbackError){
        user = {id:1, name:'test user'};
        callbackSuccess(user);
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
