'use strict';

angular.module('hotreminderApp')
  .controller('MainCtrl', function ($scope) {
    $scope.subjects = [
      {subject: 'Script pour recharger la base', author: 'Franck L.'},
      {subject: 'On ne passe plus de TU, la priorité c\'est les TI', author: 'Amandine V.'},
      {subject: 'On gèle les commits mardi soir', author: 'Mickael F.'}
    ];
  });
