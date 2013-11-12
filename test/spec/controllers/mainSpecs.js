'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('hotreminderApp'));

  var MainCtrl,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope     = $rootScope.$new();
    MainCtrl  = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should have a scope', function () { // just for me :)
    expect(scope).not.toBe(undefined);
  });

  it('should not have any user logged at start', function () {
    expect(scope.user).toBe(null); // and not undefined
  });

  it('should not have any subjects at start', function () {
    expect(scope.subjects.length).toBe(0);
  });
});
