'use strict';

angular.module('google', [])

    .factory('Google', function ($rootScope) {

        var initLoaded = false;
        var user;
        var clientId = '156435181273.apps.googleusercontent.com';
        var apiKey   = 'AIzaSyD_mjw5MP9VbxNN1120BVo8_Fi-BUyQ-Wk';
        var scopes   = 'https://www.googleapis.com/auth/plus.me';

        var handleClientLoad = function() {
          gapi.client.setApiKey(apiKey);
          window.setTimeout(checkAuth,1);
        };

        var checkAuth = function() {
          gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
        };

        var handleAuthResult = function(authResult) {
          var authorizeButton = document.getElementById('authorize-button');
          if (authResult && !authResult.error) {
            authorizeButton.style.visibility = 'hidden';
            makeApiCall();
          } else {
            authorizeButton.style.visibility = '';
            authorizeButton.onclick = handleAuthClick;
          }
        };

        var handleAuthClick = function(event) {
          gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
          return false;
        };

        var makeApiCall = function() {
          gapi.client.load('plus', 'v1', function() {
              console.log(gapi.client.plus);
              var request = gapi.client.plus.people.get({
                  'userId': 'me'
                    });
              request.execute(function(resp) {
                  console.log(resp);
                  if(resp.error) {
                    var heading = document.createElement('h4');
                    heading.appendChild(document.createTextNode(resp.error.message));
                    document.getElementById('content').appendChild(heading);
                  }
                  else {
                    var heading = document.createElement('h4');
                    var image = document.createElement('img');
                    image.src = resp.image.url;
                    heading.appendChild(image);
                    heading.appendChild(document.createTextNode(resp.displayName));
                    document.getElementById('content').appendChild(heading);
                  }
                });
            });
        };

        return {

            isReady : function(callbackSuccess){
                isReady(callbackSuccess);
            },

            login: function(callbackSuccess, callbackError){
                handleClientLoad();
                return;
            },

            getUser: function(){
                return user;
            }

        }

    });
