angular.module("hotreminderApp.directives.focusOn", ['ui']).directive('focusOn', function(){
  return {
    restrict: 'A',
    link: function($scope, element, attributes) {
    	console.log(element);
    	console.log(attributes);
      $scope.$watch(attributes.focusOn, function() {
          console.log('ok');
          console.log(element);

          element[0].focus();
      });
    }
  };
});
