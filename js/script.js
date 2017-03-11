

// $(function myLocation() {
//   var output = document.getElementById("map");

//   if (!navigator.geolocation){
//     output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
//     return;
//   }

//   function success(position) {
//     var latitude  = position.coords.latitude;
//     var longitude = position.coords.longitude;

//     output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

//     var img = new Image();
//     img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";

//     output.appendChild(img);
//   }

//   function error() {
//     output.innerHTML = "Unable to retrieve your location";
//   }

//   output.innerHTML = "<p>Locating…</p>";

//   navigator.geolocation.getCurrentPosition(success, error);
// });

// $('select').onChange(function(){
//   var cithName = $(this).value;
//   $('#map').innerHTML(cithName);
// });

$( "#province" ).change(function(e) {
    $( "#map" ).text("");
    $( "#province option:selected" ).each(function() {
    $("select:not('#province')").hide();
    var idName = $( this ).val();
    var idName = '#'+idName; 
    $( idName ).show();
    });
    // url = "http://dd.weatheroffice.ec.gc.ca/citypage_weather/xml/BC/s0000002_f.xml";
   
});

var xhr = new XMLHttpRequest();
xhr.onload= function() {
  if(xhr.status ===200){
    // document.write("sure it is right");
    // $('#map').text(xhr.responseText);
    var response = xhr.responseXML;
    console.log(response)
    
    var entry = response.getElementsByTagName('entry')
    var entryLength = entry.length;
    console.log(entryLength)
    var Summery = entry[1].getElementsByTagName('summery');
    console.log(entry[1].textContent)
    var theText = entry[1].textContent;
    // $('#map').html(entry[1].textContent);
    var temWhere = theText.search("Temperature:");
    console.log(temWhere);
    var myTotalText = theText.slice(temWhere, temWhere+26);
    var conWhere = theText.search("Condition:");
    myTotalText += '<br>'
    myTotalText += theText.slice(conWhere, conWhere+27);
    $('#map').html(myTotalText);
  }
}

$( "select.cities" ).change(function(e) {
    var url = "http://weather.gc.ca/rss/city/";
   $( "select option:selected" ).each(function() {
      url += $( this ).val();
    });
    $( "#map" ).text( url );
    // url = "http://dd.weatheroffice.ec.gc.ca/citypage_weather/xml/BC/s0000002_f.xml";
    // url="http://weather.gc.ca/rss/city/bc-7_e.xml";
    url = "data1.xml"
    xhr.open('GET', url, true);
    xhr.send(null);
});


// $.ajax({

//   // The 'type' property sets the HTTP method.
//   // A value of 'PUT' or 'DELETE' will trigger a preflight request.
//   type: 'GET',

//   // The URL to make the request to.
//   url: 'http://weather.gc.ca/rss/city/bc-7_e.xml',

//   // The 'contentType' property sets the 'Content-Type' header.
//   // The JQuery default for this property is
//   // 'application/x-www-form-urlencoded; charset=UTF-8', which does not trigger
//   // a preflight. If you set this value to anything other than
//   // application/x-www-form-urlencoded, multipart/form-data, or text/plain,
//   // you will trigger a preflight request.
//   contentType: 'text/plain',

//   xhrFields: {
//     // The 'xhrFields' property sets additional fields on the XMLHttpRequest.
//     // This can be used to set the 'withCredentials' property.
//     // Set the value to 'true' if you'd like to pass cookies to the server.
//     // If this is enabled, your server must respond with the header
//     Access-Control-Allow-Credentials: true
//     // withCredentials: true
//   },

//   headers: {
//     // Set any custom headers here.
//     // If you set any non-simple headers, your server must include these
//     // headers in the 'Access-Control-Allow-Headers' response header.
//   },

//   success: function() {
//     // Here's where you handle a successful response.
//   },

//   error: function() {
//     // Here's where you handle an error response.
//     // Note that if the error was due to a CORS issue,
//     // this function will still fire, but there won't be any additional
//     // information about the error.
//   }
// });



