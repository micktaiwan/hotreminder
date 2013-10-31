'use strict';

angular.module('hotreminderApp')
  .controller('MainCtrl', function ($scope, Notification) {
    $scope.subjects = [
      {show:false, subject: 'Script pour recharger la base', author: 'Franck L.', content:'Blabla\nJe teste\nComment je converti les retours à la ligne ?', states: [{user_id_1: {state:'new'}}]},
      {show:false, subject: 'On ne passe plus de TU, la priorité c\'est les TI', author: 'Amandine V.', content: 'Super contenu non ?', states: [{user_id_1: {state:'new'}}]},
      {show:false, subject: 'On gèle les commits mardi soir', author: 'Mickael F.', content: 'Bla bla', states: [{user_id_1: {state:'new'}}]},
      {show:false, subject: 'Avant de committer relisez la page du wiki qui défini la notion de \'fini\'', author: 'Mickael F.', content: 'Ouais parce que c\'est important...', states: [{user_id_1: {state:'new'}}]}
    ];
    $scope.todo = [
      {subject: 'Firebase :)', author: 'Mickael'}
    ];

    $scope.enableNotifications = function() {
        Notification.enableNotifications();
    };

    $scope.addNotification = function(){
        Notification.addNotifications(Notification.types.WARNING, this.notification);
    };

  });
