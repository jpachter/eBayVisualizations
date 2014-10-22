(function($){
	var geocoder = new google.maps.Geocoder(),
		map,
		// TODO: throw into a config file
		cities = [
			{
				"name": "Las Vegas, NV",
				"zoom": 8,
			}, 
			{
				"name": "Miami, FL",
				"zoom": 7
			},
			{
				"name": "Paris, FR",
				"zoom": 10
			},
			{
				"name": "New York, NY",
				"zoom": 12
			}
		],
		panInterval = 6000;

	function updateCity(city, lat, lon) {
	   for (var i in cities) {
	     if (cities[i].name == city.name) {
	        cities[i].lat = lat;
	        cities[i].lon = lon;
	        break; //Stop this loop, we found it!
	     }
	   }
	};

	function populateAllCityCoordinates() {
		for (var i in cities) {
			setCoordinates(cities[i]);
		}
	};
	
	function setCoordinates(city) {
		geocoder.geocode( { 'address': city.name}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				updateCity(city, results[0].geometry.location.k, results[0].geometry.location.B);
			} else {
			  alert('Geocode was not successful for the following reason: ' + status);
			}
		});
	};

	$(document).ready(function() {
		var template = 'http://{S}tiles.mapbox.com/v3/examples.map-i86l3621/{Z}/{X}/{Y}.png';
		var subdomains = [ 'a.', 'b.' ];
		var provider = new MM.TemplatedLayer(template, subdomains);
		map = new MM.Map('map', provider);
	  
	    window.setInterval(function() {
	    	var randomCity = cities[Math.floor((Math.random() * 4))];
			easey().map(map)
				.to(map.locationCoordinate({lat: randomCity.lat, lon: randomCity.lon}))
				.zoom(randomCity.zoom)
				.optimal();
	    }, panInterval);

	});

	populateAllCityCoordinates();

})(jQuery);
