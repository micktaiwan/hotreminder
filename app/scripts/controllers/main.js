'use strict';

angular.module('hotreminderApp')
  .controller('MainCtrl', function ($scope) {
    $scope.subjects = [
      {id: 1, subject: 'Script pour recharger la base', author: 'Franck L.', content:'Blabla\nJe teste\nComment je converti les retours à la ligne ?', states: [{user_id_1: {state:'new'}}]},
      {id: 2, subject: 'On ne passe plus de TU, la priorité c\'est les TI', author: 'Amandine V.', content: 'Super contenu non ?', states: [{user_id_1: {state:'what'}}]},
      {id: 3, subject: 'On gèle les commits mardi soir', author: 'Mickael F.', content: 'Bla bla', states: [{user_id_1: {state:'ok'}}]},
      {id: 4, subject: 'Avant de committer relisez la page du wiki qui défini la notion de \'fini\'', author: 'Mickael F.', content: 'Ouais parce que c\'est important...', states: [{user_id_1: {state:'ok'}}]}
    ];
    $scope.todo = [
      {subject: 'afficher les sujets par date mais aussi classés par jour (\'Today\', puis \'Yesterday\', puis \'Last week\')', author: 'Mickael'}
    ];
  });
