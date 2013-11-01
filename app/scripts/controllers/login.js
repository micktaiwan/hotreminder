'use strict';

angular.module('hotreminderApp')
  .controller('LoginCtrl', function ($rootScope, $location, Google, Db) {

    Google.login(function(){
      $rootScope.$apply(function(){
        Db.setUser(Google.getUser());
        $location.path('/main');
      });
    });

  });
