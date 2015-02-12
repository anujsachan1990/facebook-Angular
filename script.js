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
                                $("#test ul").append('<li style="list-style:decimal" class="friendlist"><span>' + userName + '</span><img src="https://graph.facebook.com/' + userId + '/picture?type=large"/></li>');
                            });
                        }, 1000);
                    });

                    // FB.api('/me/friendlists', function(response1) {

                    //        $.each(response1.data, function(key, value) {
                    //            console.log(key + ": " + value.id);
                    //            FB.api(value.id + "/members", function(response2) {
                    //                $.extend(self.friendlist, response2);
                    //                $.each(response2.data, function(key, friends) {
                    //                    console.log(friends.name);
                    //                    $("body").append("<li style='list-style:decimal' class='friendlist'>" + friends.name + "</li>");
                    //                });
                    //            });
                    //        });
                    //        self.userInfo = response1;
                    //        return response1;
                    //    });
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
                    // the user is logged in and has authenticated your
                    // app, and response.authResponse supplies
                    // the user's ID, a valid access token, a signed
                    // request, and the time the access token 
                    // and signed request each expire
                    alert("logged In");
                    var uid = response.authResponse.userID;
                    var accessToken = response.authResponse.accessToken;
                } else if (response.status === 'not_authorized') {
                    // the user is logged in to Facebook, 
                    // but has not authenticated your app
                    alert("not_authorized");
                } else {
                    // the user isn't logged in to Facebook.
                    alert("not logged in");
                }
            });

        }

    }

})

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
