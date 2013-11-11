'use strict';

angular.module('hotreminderApp.services.db', []).factory('Db', function($rootScope, $location, CONFIG) {

  var user;

  var subjects    = [];
  var subjects_ref = new Firebase(CONFIG.firebaseUrl + '/subjects');
  var lastupdates_ref = new Firebase(CONFIG.firebaseUrl + '/lastupdates');
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

    getLastUpdates : function(callbackSuccess) {
      lastupdates_ref.on('value', function(snapshot) {
        if(snapshot.val() !== null) {
          safeApply($rootScope, function(){
            callbackSuccess(snapshot.val());
            return;
          });
        }
        else { console.log('no lastupdates in DB'); }
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
      var author = {name: user.name, id: user.id};

      var id = subjects_ref.push().name(); // generate a unique id based on timestamp
      subjects_ref.child(id).set({id: id, comments: comments, creationDate: date, modificationDate: date, title: title, content: content, author: author, states: states});
      var lu_id = lastupdates_ref.push().name(); // generate a unique id based on timestamp
      lastupdates_ref.child(lu_id).set({id: lu_id, date: date, text: author.name+' added subject '+title, author: author, ref: "subjects", action: "add", object_id: id});
      return id;
    },

    deleteSubject : function(id) {
      var author = {id: user.id, name: user.name};
      var date = (new Date()).getTime();
      var ref = subjects_ref.child(id);
      ref.once('value', function(s) {
        var lu_id = lastupdates_ref.push().name(); // generate a unique id based on timestamp
        lastupdates_ref.child(lu_id).set({id: lu_id, date: date, text: author.name+' deleted subject '+s.val().title, author: author, ref: "subjects", action: "delete", object_id: id});
        subjects_ref.child(id).remove();
      });
    },

    addComment : function(sid, text) {
      if(!sid) {console.log("no subject id"); return null;}
      var author = {id: user.id, name: user.name};
      var date = (new Date()).getTime();
      var id = subjects_ref.child(sid).child('comments').push().name(); // generate a unique id based on timestamp
      var comment = {id: id, text: text, author: author, date: date};
      subjects_ref.child(sid).child('comments').child(id).set(comment);

      var ref = subjects_ref.child(sid);
      ref.once('value', function(s) {
        var lu_id = lastupdates_ref.push().name(); // generate a unique id based on timestamp
        lastupdates_ref.child(lu_id).set({id: lu_id, date: date, text: author.name+' commented on '+s.val().title, author: author, ref: "comments", action: "add", object_id: id, parent_id: sid});
      });
      return comment;
    },

    deleteComment : function(sid, cid) {
      var author = {id: user.id, name: user.name};
      var date = (new Date()).getTime();
      var ref = subjects_ref.child(sid);
      ref.once('value', function(s) {
        var lu_id = lastupdates_ref.push().name(); // generate a unique id based on timestamp
        lastupdates_ref.child(lu_id).set({id: lu_id, date: date, text: author.name+' deleted a comment on '+s.val().title, author: author, ref: "comments", action: "delete", object_id: cid, parent_id: sid});
      });
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
