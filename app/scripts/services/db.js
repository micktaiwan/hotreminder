angular.module('hotreminderApp.services.db', []).factory('Db', function($rootScope, $location) {

  var subjects;
  var user;
  var firstConnection = true;

  return {

    init : function() {
      subjects = new Firebase('https://hotreminder.firebaseio.com/subjects');
      console.log("db subjects ref: "+subjects);
    },

    setUser: function(u) {
      user = u;
      console.log('connection: '+u.displayName);
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

<<<<<<< HEAD
    user: function() {return user;},

    addSubject : function(title, content) {
      console.log('Db.addSubject '+ title + ", " + content);
      date = (new Date()).getTime();
      if(!content) content = '';
      states = {} // no associations is done at all
      subjects.push({title: title, content: content, author: user.displayName, states: states});
=======
    addSubject : function(title, content, author) {
      console.log('Db.sddSubject '+ title + ", " + content + ", " + author);
      date = (new Date()).getTime();
      if(!content) content = '';
      states = {
        'user_id_1': {state: 'new'}
      }
      subjects.push({title: title, content: content, author: author, states: states});
>>>>>>> be2e101f6b128e804207f63124eb5d54c72996df
    },

/*    deleteItem : function(id){
        ref.child(id).remove();
    },
*/
/*    newItem : function (id, label, amount, type, date) {
      return {
        id: id,
        label: label,
        amount : amount,
        type: type,
        date: new Date(date),
        period_date: function (period_start_date) {
          if(!period_start_date) {period_start_date = new Date();}
          if(this.type=="O" || this.type=="OC" || this.type=="I" || this.type=="IC") {
            if(new Date(this.date) > period_start_date) {
              return this.date;
            } else {
              return (new Date(this.date)).setMonth(period_start_date.getMonth());
            }
          }
          return this.date;
        }
      }
    },
*/

  };

});
