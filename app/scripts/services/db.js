'use strict';

angular.module('hotreminderApp.services.db', []).factory('Db', function($rootScope, $location, CONFIG) {

  var user;

  var subjects    = [];
  var subjects_ref = new Firebase(CONFIG.firebaseUrl + '/subjects');
  console.log("Connected to subjects db. Ref: " + subjects_ref);

  function safeApply(scope, fn) {
    (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
  };

  return {

    setUser: function(u) {
      user = u;
      console.log('connection: '+u.name + ", " + u.id);
      return u;
    },

    getSubjects : function(callbackSuccess) {
      subjects_ref.once('value', function(snapshot) {
        if(snapshot.val() !== null) {
          safeApply($rootScope, function(){
            callbackSuccess(snapshot.val());
            return;
          });
        }
        else { console.log('no values in DB'); }
      });
    },

    onAddingSubject: function(callbackSuccess) {
      subjects_ref.off('child_added');
      subjects_ref.on('child_added', function(snapshot) {
        safeApply($rootScope, function(){
          callbackSuccess(snapshot.val());
          return;
        });
      });
    },

    onDeletingSubject: function(callbackSuccess) {
      subjects_ref.off('child_removed');
      subjects_ref.on('child_removed', function(snapshot) {
        safeApply($rootScope, function(){
          callbackSuccess(snapshot.val());
          return;
        });
      });
    },

    getUser: function() {return user;},

    setState: function(id, state) {
      subjects_ref.child(id).child('states').child(user.id).update({state : state});
      },

    edit: function(id, obj) {
      subjects_ref.child(id).update(obj);
      },

    addSubject : function(title, content) {
      console.log('Db.addSubject '+ title + ", " + content);
      var date = (new Date()).getTime();
      if(!content) content = '';
      var states = {}
      var comments = {}
      var id = subjects_ref.push().name(); // generate a unique id based on timestamp
      subjects_ref.child(id).set({id: id, comments: comments, creationDate: date, modificationDate: date, title: title, content: content, author: {name: user.name, id: user.id}, states: states});
      return id;
    },

    deleteSubject : function(id) {
      subjects_ref.child(id).remove();
    },

    addComment : function(sid, text) {
      if(!sid) {console.log("no subject id"); return null;}
      var id = subjects_ref.child(sid).child('comments').push().name(); // generate a unique id based on timestamp
      var comment = {id: id, text: text, author: {id: user.id, name: user.name}, date: (new Date()).getTime()};
      subjects_ref.child(sid).child('comments').child(id).set(comment);
      return comment;
    },

    deleteComment : function(sid, cid) {
      subjects_ref.child(sid).child('comments').child(cid).remove();
    },

    newSubject : function (obj, callbackForAddingComment) {
      var comments_ref = new Firebase(CONFIG.firebaseUrl + '/subjects/'+obj.id+'/comments');
      comments_ref.on('child_added', function(snapshot) {
        safeApply($rootScope, function(){
          callbackForAddingComment(obj.id, snapshot.val());
          return;
        });
      });

      obj.hasStateForCurrentUser= function(state) {
          return(this.states && this.states[user.id] && this.states[user.id].state && this.states[user.id].state == state);
        };

      obj.hasNoState= function() {
          return(!this.states || !this.states[user.id] || !this.states[user.id].state);
        };

      return obj;
    },

  };

});
