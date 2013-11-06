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
