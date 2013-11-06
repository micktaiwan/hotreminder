'use strict';

angular.module('hotreminderApp', [
    'hotreminderApp.services.notification',
    'hotreminderApp.services.db',
    'hotreminderApp.filters.filterStateBy',
    'google'
    ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/notification_test', {
        templateUrl: 'views/notification_test.html',
        controller: 'NotificationTestCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/:params', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .otherwise({
        redirectTo: '/main'
      });
  });

'use strict';

angular.module('hotreminderApp').constant('CONFIG', {
  firebaseUrl: 'https://hotreminder.firebaseio.com'
});

'use strict';

angular.module('hotreminderApp.services.notification', []).factory('Notification', function($rootScope){

  return {

      types : {
          WARNING : {
              title : 'HotReminder',
              icon : 'http://cdn2.iconfinder.com/data/icons/lullacons/large-alert.png'
          },
          INFO : {
              title : 'HotReminder',
              icon : 'https://cdn2.iconfinder.com/data/icons/color-svg-vector-icons-2/512/information_info_about_question-128.png'
          }
      },

      enableNotifications : function(){
          if (webkitNotifications.checkPermission() != 0) {
              webkitNotifications.requestPermission();
          }
      },

      addNotifications : function(type, text){
          webkitNotifications.createNotification(
              type.icon,
              type.title,
              text
          ).show();
      }
  }

});

'use strict';

angular.module('hotreminderApp.services.db', []).factory('Db', function($rootScope, $location, CONFIG) {

  var user;

  var subjects    = [];
  var subjects_ref = new Firebase(CONFIG.firebaseUrl + '/subjects');
  console.log("Connected to subjects db. Ref: " + subjects_ref);

  function safeApply(scope, fn) {
    (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
  };

  return {

    setUser: function(u) {
      user = u;
      console.log('connection: '+u.name + ", " + u.id);
      return u;
    },

    getSubjects : function(callbackSuccess) {
      subjects_ref.on('value', function(snapshot) {
        if(snapshot.val() !== null) {
          safeApply($rootScope, function(){
            callbackSuccess(snapshot.val());
            return;
          });
        }
        else { console.log('no values in DB'); }
      });
    },

    getUser: function() {return user;},

    setState: function(id, state) {
      subjects_ref.child(id).child('states').child(user.id).update({state : state});
      },

    addSubject : function(title, content) {
      console.log('Db.addSubject '+ title + ", " + content);
      var date = (new Date()).getTime();
      if(!content) content = '';
      var states = {} // no associations is done at all
      subjects_ref.push({title: title, content: content, author: {name: user.name, id: user.id}, states: states});
    },

    deleteSubject : function(id) {
      subjects_ref.child(id).remove();
    },

    newSubject : function (id, title, content, author, states, date) {
      return {
        id: id,
        title: title,
        content: content,
        author: author,
        states: states,
        date: date,

        hasStateForCurrentUser: function(state) {
          return(states && states[user.id] && states[user.id].state && states[user.id].state == state);
        },
        hasNoState: function() {
          return(!states || !states[user.id] || !states[user.id].state);
        },



      }
    },

  };

});

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

angular.module('hotreminderApp.filters.filterStateBy', []).filter('filterStateBy', ['$rootScope', 'Db', function($rootScope, Db) {
  return function (subjects, state) {
    if(!subjects) return [];
    return subjects.filter(function(s) {
      if(state=='new' && (!s.states || !s.states[Db.getUser().id] || !s.states[Db.getUser().id].state))
        return true;
      return s.hasStateForCurrentUser(state);
    });
  };
}]);

'use strict';

angular.module('hotreminderApp')

  .controller('MainCtrl', function ($rootScope, $scope, $location, Google, Db, Notification) {

    var u = Google.getUser();
    if(!u || !u.id ) {
      $location.path('/');
      return;
    }

    $scope.subjects = [];
    $scope.user = u;

    $scope.addNotification = function(type, notif){
      Notification.addNotifications(type, notif);
    };

    Db.getSubjects(function(values) {
      $scope.subjects = []; // we reinitialize all subjects
      //  $scope.subjects.push(values[i]);
      for(var i in values) {
        $scope.subjects.push(Db.newSubject(i, values[i].title, values[i].content, values[i].author, values[i].states, values[i].date));
      };
      console.log($scope.subjects.length+' subjects');
      //$scope.addNotification(Notification.types.INFO, $scope.subjects.length+' subjects');
    });

    $scope.addSubject = function(title, content) {
      Db.addSubject(title, content);
    };
    $scope.deleteSubject = function(id) {
      Db.deleteSubject(id);
    };
    $scope.setState = function(subject, state) {
      Db.setState(subject, state);
    };

  });

'use strict';

angular.module('hotreminderApp')
  .controller('LoginCtrl', function ($rootScope, $location, Google, Db) {

    Google.login(function(){
      $rootScope.$apply(function(){
        var u = Google.getUser();
        //console.log(u);
        $rootScope.user = u;
        Db.setUser(u);
        $location.path('#/main');
      });
    });

    $rootScope.logout = function() {
      Google.logout();
      $rootScope.user = null;
      $location.path('/');
      return;
    }


  });

'use strict';

angular.module('hotreminderApp')
  .controller('AboutCtrl', function ($rootScope) {


  });

'use strict';

angular.module('hotreminderApp')
  .controller('NotificationTestCtrl', function ($scope, Notification) {

    $scope.enableNotifications = function() {
        Notification.enableNotifications();
    };

    $scope.addNotification = function(){
        Notification.addNotifications(Notification.types.WARNING, this.notification);
    };

  });
