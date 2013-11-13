'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('hotreminderApp'));

  var MainCtrl,
      scope,
      createController;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, Google) {
    scope     = $rootScope.$new();
    createController = function () {
      MainCtrl  = $controller('MainCtrl', {
        $scope: scope
      });
    };
  }));

  it('should initialize', function () {
    createController();
    expect(scope).not.toBe(undefined);
  });

  it('should not have any user logged at start', function () {
    createController();
    expect(scope.user).toBe(null); // and not undefined
  });

  it('should not have any subjects at start', function () {
    createController();
    expect(scope.subjects.length).toBe(0);
  });

  it('should redirect to / if no user is logged on', function () {
    createController();

    inject(function($route, $location, $rootScope, $httpBackend) {

/*        expect($route.current).toBeUndefined();
        expect($location.path()).toBe('/');
        //$httpBackend.whenGET('/').respond({});
        $httpBackend.expectGET("view/login.html");
        //$httpBackend.flush();
        $rootScope.$digest();
*/
        //$location.path('/main');

/*        expect($route.current.templateUrl).toBe('partials/phone-detail.html');
        expect($route.current.controller).toBe(PhoneDetailCtrl);

        $location.path('/otherwise');
        $rootScope.$digest();

        expect($location.path()).toBe('/phones/');
        expect($route.current.templateUrl).toEqual('partials/phone-list.html');
        expect($route.current.controller).toBe(PhoneListCtrl);
*/
      });


  });


  it('should get subjects if a user is logged in', inject(function (Google, Db) {
    var returned_user;
    Google.login(function(user){
      returned_user = user;
      console.log(user);
    });
    createController();
    expect(scope.user).toBe(returned_user);
    expect(scope.lastUpdates.length).toBe(1);
    // simulating getting subjects
    //Db.getSubjects(scope.getSubjectsCallback);
    expect(scope.subjects.length).toBe(1);
  }));


});
