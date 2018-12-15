var longi;
var lati;
var marker;

function initMap() { //load new instance of map
  var map = new google.maps.Map(document.getElementById('map-section'), { //show map on load
    zoom: 8,
    center: {lat: 43.07167, lng: -70.76236}
  });
  var geocoder = new google.maps.Geocoder();
  google.maps.event.addListener(map, 'click', function(event) { //geolocate on click of map
    placeMarker(event.latLng);
  });
  function placeMarker(location) { //pin placemarker to map
      if (marker == undefined){
        marker = new google.maps.Marker({
          position: location,
          map: map, 
          animation: google.maps.Animation.DROP
        });
      }
      else{
          marker.setPosition(location);
      }
      map.setCenter(location);
      longi = location.lng();
      lati = location.lat();
      tube();
  }
  document.getElementById('submit').addEventListener('click', function(event) { //geolocate on location search
    event.preventDefault();
    geocodeAddress(geocoder, map);
  });
};

function tube(){ //to find youtube videos based on location searched
  var radius = $("#rad").val().trim();
  var queryURL = "https://www.googleapis.com/youtube/v3/search?type=video&part=snippet&location=" + lati + "," + longi + "&locationRadius=" + radius + "miles&key=AIzaSyC3hyycsztOR8N1flGac1ocYQF1PGt6F6M"; //build URL
  $("#currentLat").text(lati.toFixed(6));
  $("#currentLong").text(longi.toFixed(6));
  
  $.ajax({ //grab youtube search results from API
    url: queryURL,
    method: "GET"
  }).then(function(response) { //load top 5 results
    var results = response.data;
    if (response.pageInfo.totalResults !== 0) {
      for (var i = 0; i < response.items.length; i++) {             
        $("#cardThumb" + i).html("<iframe width='100%' src='https://www.youtube.com/embed/" + response.items[i].id.videoId + "' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>");
        $("#youtubeLink" + [i]).html("<a href='https://www.youtube.com/watch?v=" + response.items[i].id.videoId + "' class='btn btn-danger' target='_blank'>" + response.items[i].snippet.channelTitle + "</a>");
      }
      $("#videoIframe").html("<iframe width='100%' src='https://www.youtube.com/embed/" + response.items[0].id.videoId + "' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>");
    }
  });
}
  
function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('address').value;
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') { //if server returns valid results, set lat/long based on address entered
      lati = results[0].geometry.location.lat();
      longi = results[0].geometry.location.lng();
      tube();
      resultsMap.setCenter(results[0].geometry.location);
    }
  });
}

function initialize() { //update video map & video thumbnails
  var latlng = new google.maps.LatLng(42.55308, 9.140625);
  $("#mainVideo").html(popularThumbnailArray[0]);
  var myOptions = {
    zoom: 2,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    streetViewControl: false,
    mapTypeControl: false,
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
};

$("#history").on("click", function() { //load additional results for searched location on button click
  $("#additionalDiv").css("display", "none")
  $("#historyDiv").css("display", "block")
});
$("#recently").on("click", function() { //load trending results based on other users' searches 
    $("#historyDiv").css("display", "none")
    $("#additionalDiv").css("display", "block")
});