$(document).ready(function() {
    /////////////////////////////////////////////////////BIG VARIABLES/////////////////////////////////////////////////////
    
        var userThumbnailArray = [];
        var userThumbnailPath;
        var popularThumbnailArray = [];
        var popularThumbnailPath;
        var address = "";
        var urlGoogle = "https://maps.googleapis.com/maps/api/geocode/json";
        var apiKeyGoogle = "AIzaSyCXz3ctOfdCYgcEHTokEyM5Dso_kiMJDeY";
        var urlYoutube = "https://www.googleapis.com/youtube/v3/search";
        var apiKeyYoutube = "AIzaSyC3hyycsztOR8N1flGac1ocYQF1PGt6F6M";
        var lat;
        var long;
        var popularSearchArray = []; //added
        var j = 0;
    /////////////////////////////////////////////////////FIREBASE/////////////////////////////////////////////////////
    
        var config = {
            apiKey: "AIzaSyB4FzGqNZs6sYG5wsokxnFHJJutJSdbLTY",
            authDomain: "tube-the-earth.firebaseapp.com",
            databaseURL: "https://tube-the-earth.firebaseio.com",
            projectId: "tube-the-earth",
            storageBucket: "",
            messagingSenderId: "686431765231"
        };
    
        firebase.initializeApp(config);
        var database = firebase.database();
    
    ///////////////////////////////////////////////GLOBAL FUNCTIONS/////////////////////////////////////////////////////
    
    function mapsAjax(address, urlGoogle) {
    
        var geocoder = new google.maps.Geocoder();
    
        return new Promise(function(resolve, reject) {
            if (geocoder) {
                geocoder.geocode({ 'address': address }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        var lat = results[0].geometry.location.lat();
                        var lng = results[0].geometry.location.lng();
                        resolve({
                            lat: lat,
                            lng: lng
                        });
                    }
                    else {
                        reject("Geocoding failed: " + status);
                    }
                });
            } else {
                reject('no geocoder');
            }
        });
    }
    
    function youtubeAjax(urlYoutube) {
        return $.ajax({
            url: urlYoutube,
            method: "GET"
        })
    };
    ////////////////ANYTIME A NEW ITEM IS ADDED TO THE DATABASE, AND ON LOAD////////////////    
    database.ref().on("child_added", function(snapshot) {
    
        function loadFromDatabase(snapshot) {
            snapshot.forEach(function(childSnapshot) { //for each child in database...
                var popularSearchItem = childSnapshot.val(); //grab value of searched location
                popularSearchArray.push(popularSearchItem); //added
                $("#history1").html(popularSearchArray[0]);
                $("#history2").html(popularSearchArray[1]);
                $("#history3").html(popularSearchArray[2]);
                $("#history4").html(popularSearchArray[3]);
                var newMapsURL = urlGoogle;
                newMapsURL += "?" + $.param({ //convert each location in database to lat/long; modify URL lookup for each item in database
                    'address': popularSearchItem,
                    'key': apiKeyGoogle
                });
    
                mapsAjax(popularSearchItem, newMapsURL) //call to google maps API to grab data for each item in database
                .then (function(results) {
                    lat = results.lat;
                    long = results.lng;
                                        
                    var newYoutubeURL = urlYoutube;
                    newYoutubeURL += "?" + $.param({ //modify youtube API url for each location item in database
                        'type': 'video',
                        'maxResults': 50,
                        'part': 'snippet',
                        'videoEmbeddable': true,
                        'location': lat + "," + long,
                        'locationRadius': '10mi',
                        'key': apiKeyYoutube,
                        'chart': 'mostPopular'
                    })
                    youtubeAjax(newYoutubeURL) //call to youtube api to grab data for each item in database
                    .then (function(response) {
                        popularThumbnailPath = response.items[0].snippet.thumbnails.default.url;
                        var popularThumbnailId = response.items[0].id.videoId;
                        //var popularThumbnail = $("<img id='popular'>" + "<br><br>"); //?????????????????????????????
                        //popularThumbnail.attr("src", popularThumbnailPath); //assign src for thumbnail img //?????????????????
                        var link = "http://www.youtube.com/embed/";
                        link += popularThumbnailId;
                        console.log(link); //correct
                        var popularThumbnail = $("<iframe width='100%' src='https://www.youtube.com/embed/" + popularThumbnailId + "'frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>").appendTo('#historyDiv');
                        console.log(popularThumbnail);
                        popularThumbnailArray.push(popularThumbnail);
                        if (popularThumbnailArray.length >= 6) {
                            popularThumbnailArray.shift();
                            $("#historyDiv").html(popularThumbnailArray);
                        }
                        else {
                            $("#historyDiv").html(popularThumbnailArray); //push updated contents of thumbnail array to page
                        }
                    //replace("watch?v=", "v/");
                    })
                })
            
        });
    }
        loadFromDatabase(snapshot);
    });
    
    ////////////////ON SEARCH BUTTON CLICK...////////////////
    
    $("#submit").on("click", function() {
        //$(historyDiv).empty();
        address = $("#address").val().trim();
        event.preventDefault();
        function saveSearch() {
            database.ref().push({
                address: address, //save each new location entered by user to database
            });
        };
        saveSearch();
    });
    
})
