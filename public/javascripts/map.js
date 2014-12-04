(function($){
	var geocoder = new google.maps.Geocoder(),
		geoCoderRequestInterval = 1500,
		numGeocoded = 0,
		map,
		panInterval = 6500,
		areaCount = 0,
		itemStartDelay = 9000,
		$window = $(window),
		$points = $('.point'),
		rotationNum = 0,
		geoCoderQueue = [];

	function populateAllCoordinates() {
		$('.point, .area').each(function() {
			var $this = $(this);
			geoCoderQueue.push($this);
		});
		setCoordinates();
	};

	function setCoordinates() {
		window.setInterval(function() {
			if (geoCoderQueue.length) {
				setCoordinatesFromPoint(geoCoderQueue.shift());
			}
		}, geoCoderRequestInterval);
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
				//console.log('Geocode success!');
			} else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {    
			  	//console.log('Geocode was not successful for the following reason: ' + status + '. Retrying after ' + geoCoderRequestInterval + ' ms.');
			  	window.setTimeout(function() {
			  		setCoordinatesFromPoint($point);
			  	}, geoCoderRequestInterval);
	        } else {
			  //console.log('Geocode was not successful for the following reason: ' + status);
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
			$points.each(function() {
				var $this = $(this);
				$this.animate({
					opacity: 0,
				}, Math.random()*500+500, function() {
					$this.remove();
				});
			});
			window.setTimeout(function() {
				panToCity();
				// Add new items
				$.ajax({
	                type: 'GET',
	                dataType: "JSON",
	                url: '/city/' + $area.data('city') + '?algo=' + (rotationNum % 2 == 0 ? 'highwatches' : 'highbids'),
	                success: function(data) {
						for (i = 0; i < data.city.length; i++) {
							var curCity = data.city[i];
							geoCoderQueue.push($("<div data-postal=\"" + curCity.postal + "\"data-watch-count=\"" + curCity.watchCount +  "\"data-title=\"" 
							+ curCity.title + "\" data-image-url=\"" + curCity.largeImageUrl + "\" data-bid-count=\"" + curCity.bidCount + "\" data-price-string=\"" 
							+ curCity.priceString + "\" class=\"point\"></div>").appendTo($area));;
						}
	                },
	                error: function(e) {
	                    // TODO: error handling
	                }
            	});
            	if (areaCount == 1) {
            		rotationNum++;
            	}
			}, 1000);
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

		var $infoModule = $('.info-module').first(),
			$infoImageContainer = $('.image-container', $infoModule),
			$infoText = $('p', $infoModule),
			$scroller = $('.scroller');

		$infoImageContainer.html('<img src=\'' + $currentPoint.data('imageUrl') + '\'>')
		$infoImageContainer.imagefill();
		$infoText.html((rotationNum % 2 == 0 ? $currentPoint.data('bidCount') + ' bids' : $currentPoint.data('watchCount') + ' watches')
			+ '<br>' + $currentPoint.data('priceString'));

		$infoImageContainer.imagesLoaded().done(function(img) {

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

				$currentPoint.animate({
					width: 25,
					height: 25,
					opacity: 1,
					left: $currentPoint.position().left + 200,
					top: $currentPoint.position().top + 200
				}, 500, 'easeInQuint');
				$currentPoint.animate({
					opacity: .6
				}, 4000, 'linear');
				$infoModule.animate( {
					opacity: .6
				}, 4000, 'linear');
				$scroller.animate( {
					left: 350
				}, 4000, 'linear', function() {
					$scroller.removeAttr('style');
					$infoModule.clone().removeAttr('style').insertBefore($infoModule);
					if ($scroller.children().size() >= 10) {
						$scroller.children().last().remove();
					}
					moveThroughItems($area, level+1);
				});
		 	});
		});
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
