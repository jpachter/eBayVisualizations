(function($){
	var geocoder = new google.maps.Geocoder(),
		geoCoderRequestInterval = 800,
		numGeocoded = 0,
		map,
		panInterval = 6500,
		areaCount = 0,
		itemStartDelay = 8000,
		$window = $(window);

	function populateAllCoordinates() {
		var count = 0;
		$('.point, .area').each(function() {
			var $this = $(this);
			window.setTimeout(function() {
				setCoordinatesFromPoint($this);
			}, count++ * geoCoderRequestInterval);
		});
	};

	function setCoordinatesFromPoint($point) {
		if ($point.parent().hasClass('berlin')) {
			var parentCountry = ' Germany';
		}
		if ($point.parent().hasClass('sydney')) {
			var parentCountry = ' Australia';
		}
		geocoder.geocode( { 'address': '' + $point.data('postal') + (parentCountry ? parentCountry : '')}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				$point.data('lat', results[0].geometry.location.k);
				$point.data('lon', results[0].geometry.location.B);
				numGeocoded++;
				console.log('Geocode success!');
			} else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {    
			  	console.log('Geocode was not successful for the following reason: ' + status + '. Retrying after ' + geoCoderRequestInterval + ' ms.');
			  	window.setTimeout(function() {
			  		setCoordinatesFromPoint($point);
			  	}, geoCoderRequestInterval);
	        } else {
			  console.log('Geocode was not successful for the following reason: ' + status);
			  numGeocoded++;
			}
		});
	};

	function panToCity() {
    	// Find next city to pan to
    	var $areas = $('.area'),
    		$nextArea = $($areas.get(areaCount));

    	if (++areaCount == $areas.length) {
    		areaCount = 0;
    	}
		easey().map(map)
			.to(map.locationCoordinate({lat: $nextArea.data('lat'), lon: $nextArea.data('lon')}))
			.zoom($nextArea.data('zoom'))
			.optimal();

		// Give the map some time to ease to the new location before we move through the items.
		window.setTimeout(function() {
			moveThroughItems($nextArea, 0);
		}, itemStartDelay);
	 };

	 function moveThroughItems($area, level) {
		var $points = $(".point", $area);

		// We're done moving through all points! Go to the next city.
		if ($points.length <= level) {
			panToCity();
			return;
		}

		var $currentPoint = $($points.get(level)),
			screenPoint = map.locationPoint(new MM.Location($currentPoint.data('lat'), $currentPoint.data('lon')));
		$currentPoint.css('left', screenPoint.x - 12.5);
		$currentPoint.css('top', screenPoint.y - 12.5);

		// If element is off screen, skip it.
		if ($currentPoint.position().left < 0 || $currentPoint.position().left > $window.width()
			|| $currentPoint.position().top < 0 || $currentPoint.position().top > $window.height()) {
			moveThroughItems($area, level+1);
			return;
		}

		var $infoModule = $('.info-module'),
			$infoImageContainer = $('.image-container', $infoModule),
			$infoText = $('p', $infoModule);

		$infoImageContainer.html('<img src=\'' + $currentPoint.data('imageUrl') + '\'>')
		$infoImageContainer.imagefill();
		// Imagefill shows some jerkiness so push the fadein back a bit
		window.setTimeout(function() {
			$infoModule.animate({
				opacity: 1
			}, 200, 'linear');

			$currentPoint.animate({
				width: 400,
				height: 400,
				opacity: .4,
				left: $currentPoint.position().left - 200,
				top: $currentPoint.position().top - 200
			}, 700, 'easeOutQuint', function() {

				var transitionTime = Math.floor(Math.random()*2500 + 2500);
				$currentPoint.animate({
					width: 25,
					height: 25,
					opacity: 1,
					left: $currentPoint.position().left + 200,
					top: $currentPoint.position().top + 200
				}, 500, 'easeInQuint');
				$currentPoint.animate({
					opacity: 0
				}, transitionTime, 'linear');
				$infoModule.animate( {
					opacity: 0
				}, transitionTime, 'linear');
				window.setTimeout(function() {
					moveThroughItems($area, level+1);
				}, transitionTime);
		 	});
		}, 200);
			
		$infoText.html($currentPoint.data('bidCount') + ' bids<br>' +
			$currentPoint.data('currencyId') + ' ' + $currentPoint.data('currentPrice'));
	};

	$(document).ready(function() {
		var template = 'http://{S}tiles.mapbox.com/v3/examples.map-i86l3621/{Z}/{X}/{Y}.png';
		var subdomains = [ 'a.', 'b.' ];
		var provider = new MM.TemplatedLayer(template, subdomains);
		map = new MM.Map('map', provider);
		populateAllCoordinates();
		var startTimer = window.setInterval(function() {
			if (numGeocoded >= $('.area').first().children().length) {
				panToCity();
				window.clearInterval(startTimer);
			}
		}, 1000);
	});
})(jQuery);
