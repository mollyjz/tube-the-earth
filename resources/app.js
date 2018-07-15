var longi;
var lati;
var marker;

function initMap() {
  var map = new google.maps.Map(document.getElementById('map-section'), {
    zoom: 8,
    center: {lat: 43.07167, lng: -70.76236}
  });
  var geocoder = new google.maps.Geocoder();
  google.maps.event.addListener(map, 'click', function(event) {
    placeMarker(event.latLng);
    console.log(event.latlng);
  });
  function placeMarker(location) {
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
  document.getElementById('submit').addEventListener('click', function(event) {
    event.preventDefault()
    geocodeAddress(geocoder, map);
  });
};

function tube(){
  var radius = $("#rad").val().trim();
  var queryURL = "https://www.googleapis.com/youtube/v3/search?type=video&part=snippet&location=" + lati + "," + longi + "&locationRadius=" + radius + "miles&key=AIzaSyC3hyycsztOR8N1flGac1ocYQF1PGt6F6M";
  $("#currentLat").text(lati.toFixed(6));
  $("#currentLong").text(longi.toFixed(6));
  
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
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
    if (status === 'OK') {
      lati = results[0].geometry.location.lat();
      longi = results[0].geometry.location.lng();
      tube();
      resultsMap.setCenter(results[0].geometry.location);
    }
  });
}
function initialize() {
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

$("#history").on("click", function() {
  $("#additionalDiv").css("display", "none")
  $("#historyDiv").css("display", "block")
});
$("#recently").on("click", function() {
    $("#historyDiv").css("display", "none")
    $("#additionalDiv").css("display", "block")
});
