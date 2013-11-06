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
