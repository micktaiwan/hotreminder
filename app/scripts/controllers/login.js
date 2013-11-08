'use strict';

angular.module('hotreminderApp')
  .controller('LoginCtrl', function ($rootScope, $location, Google, Db) {

    Google.login(function(){
      $rootScope.$apply(function(){
        var u = Google.getUser();
        //console.log(u);
        $rootScope.user = u;
        Db.setUser(u);
        $location.path('/main');
      });
    });

    $rootScope.logout = function() {
      Google.logout();
      $rootScope.user = null;
      $location.path('/');
      return;
    }


  });
