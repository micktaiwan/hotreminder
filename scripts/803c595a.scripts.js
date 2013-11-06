"use strict";angular.module("hotreminderApp",["hotreminderApp.services.notification","hotreminderApp.services.db","hotreminderApp.filters.filterStateBy","google"]).config(["$routeProvider",function(a){a.when("/main",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/notification_test",{templateUrl:"views/notification_test.html",controller:"NotificationTestCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).when("/:params",{templateUrl:"views/login.html",controller:"LoginCtrl"}).otherwise({redirectTo:"/main"})}]),angular.module("hotreminderApp.services.notification",[]).factory("Notification",["$rootScope",function(){return{types:{WARNING:{title:"HotReminder",icon:"http://cdn2.iconfinder.com/data/icons/lullacons/large-alert.png"},INFO:{title:"HotReminder",icon:"https://cdn2.iconfinder.com/data/icons/color-svg-vector-icons-2/512/information_info_about_question-128.png"}},enableNotifications:function(){0!=webkitNotifications.checkPermission()&&webkitNotifications.requestPermission()},addNotifications:function(a,b){webkitNotifications.createNotification(a.icon,a.title,b).show()}}}]),angular.module("hotreminderApp.services.db",[]).factory("Db",["$rootScope","$location",function(a){function b(a,b){a.$$phase||a.$root.$$phase?b():a.$apply(b)}var c,d=new Firebase("https://dev-hotreminder.firebaseio.com/subjects");return console.log("Connected to subjects db. Ref: "+d),{setUser:function(a){return c=a,console.log("connection: "+a.name+", "+a.id),a},getSubjects:function(c){d.on("value",function(d){null!==d.val()?b(a,function(){c(d.val())}):console.log("no values in DB")})},getUser:function(){return c},setState:function(a,b){d.child(a).child("states").child(c.id).update({state:b})},addSubject:function(a,b){console.log("Db.addSubject "+a+", "+b),(new Date).getTime(),b||(b="");var e={};d.push({title:a,content:b,author:{name:c.name,id:c.id},states:e})},deleteSubject:function(a){d.child(a).remove()},newSubject:function(a,b,d,e,f,g){return{id:a,title:b,content:d,author:e,states:f,date:g,hasStateForCurrentUser:function(a){return f&&f[c.id]&&f[c.id].state&&f[c.id].state==a},hasNoState:function(){return!f||!f[c.id]||!f[c.id].state}}}}}]),angular.module("google",[]).factory("Google",["$rootScope","$routeParams",function(a,b){var c,d=function(a){if(!a)return!1;var b=a.match(/access_token=([^&]+)/);return!!b&&b[1]},e={host:"https://accounts.google.com/o/oauth2/auth",clientId:"156435181273.apps.googleusercontent.com"},f=function(c){var f=d(b.params);f?$.ajax({url:"https://www.googleapis.com/oauth2/v1/userinfo?access_token="+f,beforeSend:function(a){a.setRequestHeader("Authorization","OAuth "+f),a.setRequestHeader("Accept","application/json")},success:function(a){c(a)}}):a.authUrl=e.host+"?response_type=token&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&client_id="+e.clientId+"&redirect_uri="+window.location};return{login:function(a,b){return f(function(d){d?(c=d,a(c)):b()}),c},logout:function(){c=null},getUser:function(){return c}}}]),angular.module("hotreminderApp.filters.filterStateBy",[]).filter("filterStateBy",["$rootScope","Db",function(a,b){return function(a,c){return a?a.filter(function(a){return"new"!=c||a.states&&a.states[b.getUser().id]&&a.states[b.getUser().id].state?a.hasStateForCurrentUser(c):!0}):[]}}]),angular.module("hotreminderApp").controller("MainCtrl",["$rootScope","$scope","$location","Google","Db","Notification",function(a,b,c,d,e,f){var g=d.getUser();return g&&g.id?(b.subjects=[],b.user=g,b.addNotification=function(a,b){f.addNotifications(a,b)},e.getSubjects(function(a){b.subjects=[];for(var c in a)b.subjects.push(e.newSubject(c,a[c].title,a[c].content,a[c].author,a[c].states,a[c].date));console.log(b.subjects.length+" subjects")}),b.addSubject=function(a,b){e.addSubject(a,b)},b.deleteSubject=function(a){e.deleteSubject(a)},b.setState=function(a,b){e.setState(a,b)},void 0):(c.path("/"),void 0)}]),angular.module("hotreminderApp").controller("LoginCtrl",["$rootScope","$location","Google","Db",function(a,b,c,d){c.login(function(){a.$apply(function(){var e=c.getUser();a.user=e,d.setUser(e),b.path("#/main")})}),a.logout=function(){c.logout(),a.user=null,b.path("/")}}]),angular.module("hotreminderApp").controller("AboutCtrl",["$rootScope",function(){}]),angular.module("hotreminderApp").controller("NotificationTestCtrl",["$scope","Notification",function(a,b){a.enableNotifications=function(){b.enableNotifications()},a.addNotification=function(){b.addNotifications(b.types.WARNING,this.notification)}}]);