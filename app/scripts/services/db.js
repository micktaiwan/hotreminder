angular.module('hotreminderApp.services.db', []).factory('Db', function($rootScope, $location) {

  var subjects;
  var user;
  var firstConnection = true;

  return {

    init : function() {
      subjects = new Firebase('https://dev-hotreminder.firebaseio.com/subjects');
      console.log("db subjects ref: "+subjects);
    },

    setUser: function(u) {
      user = u;
      console.log('connection: '+u.name + ", " + u.id);
      return u;
    },

    getSubjects : function(callbackSuccess) {
      if (!subjects) {
        console.log('no subjects ref while getting values');
        //$location.path('/');
        return;
      }
      subjects.on('value', function(snapshot) {
        if(snapshot.val() !== null) {
          if(firstConnection){
            $rootScope.$apply(function(){
              callbackSuccess(snapshot.val());
            });
          } else {
            callbackSuccess(snapshot.val());
          }
        }
        else { console.log('no values in DB'); }
        firstConnection = false;
      });
    },

    getUser: function() {return user;},

    setState: function(id, state) {
      subjects.child(id).child('states').child(user.id).update({state : state});
      },

    addSubject : function(title, content) {
      console.log('Db.addSubject '+ title + ", " + content);
      date = (new Date()).getTime();
      if(!content) content = '';
      states = {} // no associations is done at all
      subjects.push({title: title, content: content, author: {name: user.name, id: user.id}, states: states});
    },

    deleteSubject : function(id) {
      subjects.child(id).remove();
    },

    newSubject : function (id, title, content, author, states, date) {
      return {
        id: id,
        title: title,
        content: content,
        author: author,
        states: states,
        date: date
      }
    },

  };

});
