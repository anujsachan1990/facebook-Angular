var app = angular.module('myApp', []);
app.run(function($rootScope, Facebook) {

    $rootScope.Facebook = Facebook;

})

app.factory('Facebook', function() {
    var self = this;
    this.auth = null;
    this.userInfo = null;
    this.friendlist = null;

    return {
        getAuth: function() {
            return self.auth;
        },
        getUserData: function() {
            return self.userInfo;
        },
        login: function() {
            $(".btn").hide();
            FB.login(function(response) {
                if (response.authResponse) {
                    self.auth = response.authResponse;

                    FB.api(
                        "/me/picture?redirect=0&height=200&type=normal&width=200",
                        function(response) {
                            var str = response.data.url;
                            if (response && !response.error) {
                                document.getElementById('profilePic').innerHTML = '<img src="' + str + '">';
                            }
                        }
                    );

                    FB.api(
                        "/me",
                        function(response) {
                            if (response && !response.error) {
                                document.getElementById('basicInfo').innerHTML = "Name: " + response.name + "<br/>Gender:" + response.gender;
                            }
                        }
                    );


                    FB.api('me/friends?fields=first_name,gender,location,last_name', function(response) {
                        console.log('Got friends: ', response);
                        setTimeout(function() {
                            $.each(response.data, function(v, i) {
                                var userId = response.data[v].id;
                                var userName = response.data[v].first_name.concat(" " + response.data[v].last_name);
                                $(".facebook-login").fadeOut();
                                $("#test img.loading").fadeOut();
                                $(".profileDiv").fadeIn();
                                $(".fade").removeClass("in");
                                $("#test ul").append('<li style="list-style:decimal" class="friendlist"><span>' + userName + '</span><img src="https://graph.facebook.com/' + userId + '/picture?type=large"/></li>');
                            });
                        }, 1000);
                    });
                } else {
                    console.log('Facebook login failed', response);
                }
            }, {
                scope: 'read_friendlists'
            });

        },
        // Here we run a very simple test of the Graph API after login is
        // successful.  See statusChangeCallback() for when this call is made.
        testAPI: function() {
            console.log('Welcome!  Fetching your information.... ');

        },

        logout: function() {

            FB.logout(function(response) {
                if (response) {
                    self.auth = null;
                } else {
                    console.log('Facebook logout failed.', response);
                }

            })

        },
        loginCheck: function() {
            FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                    alert("logged In");
                    var uid = response.authResponse.userID;
                    var accessToken = response.authResponse.accessToken;
                } else if (response.status === 'not_authorized') {
                    alert("not_authorized");
                } else {
                    alert("not logged in");
                }
            });
        }
    }

});

$(window).load(function() {
  
      FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                  
                    var uid = response.authResponse.userID;
                    var accessToken = response.authResponse.accessToken;
                      $(".btn").click(function(){
                        $(".fade").addClass("in");
                      $("#test").append("<img class='loading' src='http://preloaders.net/preloaders/131/3D%20snake.gif'>")
                      });
                      
                } else if (response.status === 'not_authorized') {
                    alert("not_authorized");
                } else {
                    alert("not logged in");
                }
            });

});






window.fbAsyncInit = function() {
    FB.init({
        appId: '530294353650337',
        version: 'v1.0',
    });
};

// Load the SDK Asynchronously
(function(d) {
    var js, id = 'facebook-jssdk',
        ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));
