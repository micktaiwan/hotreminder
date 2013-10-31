'use strict';

angular.module('hotreminderApp')
  .controller('MainCtrl', function ($scope) {
    $scope.subjects = [
      {subject: 'Script pour recharger la base'},
      {subject: 'On ne passe plus de TU, la priorité c\'est les TI'},
      {subject: 'On gèle les commits mardi soir'}
    ];
  });
