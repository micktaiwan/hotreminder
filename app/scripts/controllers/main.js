'use strict';

angular.module('hotreminderApp')
  .controller('MainCtrl', function ($scope, Notification) {
    $scope.subjects = [
      {subject: 'Script pour recharger la base', author: 'Franck L.', content:'Blabla\nJe teste\nComment je converti les retours à la ligne ?'},
      {subject: 'On ne passe plus de TU, la priorité c\'est les TI', author: 'Amandine V.', content: 'Super contenu non ?'},
      {subject: 'On gèle les commits mardi soir', author: 'Mickael F.', content: 'Bla bla', show: true}
    ];
    $scope.todo = [
      {subject: 'afficher les sujets par date mais aussi classés par jour (\'Today\', puis \'Yesterday\', puis \'Last week\')', author: 'Mickael'}
    ];

    $scope.enableNotifications = function() {
        Notification.enableNotifications();
    };

    $scope.addNotification = function(){
        Notification.addNotifications(Notification.types.WARNING, this.notification);
    };

  });
