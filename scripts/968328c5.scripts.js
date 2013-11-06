"use strict";angular.module("hotreminderApp",["hotreminderApp.services.notification","hotreminderApp.services.db","hotreminderApp.filters.filterStateBy","google"]).config(["$routeProvider",function(a){a.when("/main",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/notification_test",{templateUrl:"views/notification_test.html",controller:"NotificationTestCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).when("/:params",{templateUrl:"views/login.html",controller:"LoginCtrl"}).otherwise({redirectTo:"/main"})}]),angular.module("hotreminderApp.services.notification",[]).factory("Notification",["$rootScope",function(){return{types:{WARNING:{title:"Warning !",icon:"http://cdn2.iconfinder.com/data/icons/lullacons/large-alert.png"}},enableNotifications:function(){0!=webkitNotifications.checkPermission()&&webkitNotifications.requestPermission()},addNotifications:function(a,b){webkitNotifications.createNotification(a.icon,a.title,b).show()}}}]),angular.module("hotreminderApp.services.db",[]).factory("Db",["$rootScope","$location",function(a){var b,c,d=!0;return{init:function(){b||(b=new Firebase("https://hotreminder.firebaseio.com/subjects"),console.log("Connected to subjects db. Ref: "+b))},setUser:function(a){return c=a,console.log("connection: "+a.name+", "+a.id),a},getSubjects:function(c){return b?(b.on("value",function(b){null!==b.val()?d?a.$apply(function(){c(b.val())}):c(b.val()):console.log("no values in DB"),d=!1}),void 0):(console.log("no subjects ref while getting values"),void 0)},getUser:function(){return c},setState:function(a,d){b.child(a).child("states").child(c.id).update({state:d})},addSubject:function(a,d){console.log("Db.addSubject "+a+", "+d),(new Date).getTime(),d||(d=""),states={},b.push({title:a,content:d,author:{name:c.name,id:c.id},states:states})},deleteSubject:function(a){b.child(a).remove()},newSubject:function(a,b,c,d,e,f){return{id:a,title:b,content:c,author:d,states:e,date:f}}}}]),angular.module("google",[]).factory("Google",["$rootScope","$routeParams",function(a,b){var c,d=function(a){if(!a)return!1;var b=a.match(/access_token=([^&]+)/);return!!b&&b[1]},e={host:"https://accounts.google.com/o/oauth2/auth",clientId:"156435181273.apps.googleusercontent.com"},f=function(c){var f=d(b.params);f?$.ajax({url:"https://www.googleapis.com/oauth2/v1/userinfo?access_token="+f,beforeSend:function(a){a.setRequestHeader("Authorization","OAuth "+f),a.setRequestHeader("Accept","application/json")},success:function(a){c(a)}}):a.authUrl=e.host+"?response_type=token&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&client_id="+e.clientId+"&redirect_uri="+window.location};return{login:function(a,b){return f(function(d){d?(c=d,a(c)):b()}),c},logout:function(){c=null},getUser:function(){return c}}}]),angular.module("hotreminderApp.filters.filterStateBy",[]).filter("filterStateBy",["$rootScope","Db",function(a,b){return function(a,c){return a?a.filter(function(a){return"new"!=c||a.states&&a.states[b.getUser().id]&&a.states[b.getUser().id].state?a.states&&a.states[b.getUser().id]&&a.states[b.getUser().id].state&&a.states[b.getUser().id].state==c:!0}):[]}}]),angular.module("hotreminderApp").controller("MainCtrl",["$scope","$location","Google","Db","Notification",function(a,b,c,d,e){var f=c.getUser();return f&&f.id?(d.init(),a.subjects=[],a.user=f,d.getSubjects(function(b){a.subjects=[];for(var c in b)a.subjects.push(d.newSubject(c,b[c].title,b[c].content,b[c].author,b[c].states,b[c].date));console.log(a.subjects.length+" subjects")}),a.addSubject=function(a,b){d.addSubject(a,b)},a.deleteSubject=function(a){d.deleteSubject(a)},a.setState=function(a,b){d.setState(a,b)},a.enableNotifications=function(){e.enableNotifications()},a.addNotification=function(){e.addNotifications(e.types.WARNING,this.notification)},void 0):(b.path("/"),void 0)}]),angular.module("hotreminderApp").controller("LoginCtrl",["$rootScope","$location","Google","Db",function(a,b,c,d){c.login(function(){a.$apply(function(){var e=c.getUser();a.user=e,d.setUser(e),b.path("#/main")})}),a.logout=function(){c.logout(),a.user=null,b.path("/")}}]),angular.module("hotreminderApp").controller("AboutCtrl",["$rootScope",function(){}]),angular.module("hotreminderApp").controller("NotificationTestCtrl",["$scope","Notification",function(a,b){a.enableNotifications=function(){b.enableNotifications()},a.addNotification=function(){b.addNotifications(b.types.WARNING,this.notification)}}]);