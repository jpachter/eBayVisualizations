var request = require('request'),
	step = require('step'),
	extend = require('util')._extend,
	protein = require('../public/resources/protein.json'),
	cities = require('../public/resources/cities.json');

module.exports.init = function(app){
	app.get('/', buildMap);
}

function buildMap(req, res){
	
	// Configure the request
	var options = {
	    method: 'GET',
	    json: true
	}

	var worldOptions = extend({}, options);
	worldOptions.url = 'http://localhost:8080/feedservice/visualization?keyword=new&num=10&algo=highbids';

	var nycOptions = extend({}, options);
	nycOptions.url = 'http://localhost:8080/feedservice/visualization?keyword=new&zip=10016&distance=30&num=10&algo=highbids';

	var miamiOptions = extend({}, options);
	miamiOptions.url = 'http://localhost:8080/feedservice/visualization?keyword=new&zip=33030&distance=60&num=10&algo=highbids';

	var londonOptions = extend({}, options);
	londonOptions.url = 'http://localhost:8080/feedservice/visualization?keyword=new&zip=WC2E7NA&distance=60&num=10&algo=highbids';
	londonOptions.headers = {};
    londonOptions.headers["X-EBAY-REST-SITEID"] = 3;
    londonOptions.headers["X-EBAY-FISNG-GEOINFO"] = "EBAY-GB,en-GB_GB,GBP";

	var berlinOptions = extend({}, options);
	berlinOptions.url = 'http://localhost:8080/feedservice/visualization?keyword=neu&zip=10178&distance=45&num=10&algo=highbids';
	berlinOptions.headers = {};
    berlinOptions.headers["X-EBAY-REST-SITEID"] = 77;
    berlinOptions.headers["X-EBAY-FISNG-GEOINFO"] = "EBAY-DE,de-DE_DE,EUR";
	
	var sydneyOptions = extend({}, options);
	sydneyOptions.url = 'http://localhost:8080/feedservice/visualization?keyword=new&zip=2000&distance=30&num=10&algo=highbids';
	sydneyOptions.headers = {};
    sydneyOptions.headers["X-EBAY-REST-SITEID"] = 15;
    sydneyOptions.headers["X-EBAY-FISNG-GEOINFO"] = "EBAY-AU,en-AU_AU,AUD";

	var items = {};

	step(
		function getCollections() {
		    request(worldOptions, this.parallel());
		    request(nycOptions, this.parallel());
		    request(miamiOptions, this.parallel());
		    request(londonOptions, this.parallel());
		    request(berlinOptions, this.parallel());
		    request(sydneyOptions, this.parallel());
		},
		function renderPage(err, world, nyc, miami, london, berlin, sydney) {
		    if (!err && world.body) {
                if (world.body && world.body.ack == 'SUCCESS') {
                	items.world = [];
                	for (var i in world.body.items) {
                		if (world.body.items[i].postal) {
							items.world.push(world.body.items[i]);
                		}
                	}
                } else {
                	console.log(err);
                    //TODO: error handling
	        	}
	        }

	        if (!err && nyc.body) {
                if (nyc.body && nyc.body.ack == 'SUCCESS') {
                	items.nyc = [];
                	for (var i in nyc.body.items) {
                		if (nyc.body.items[i].postal) {
                			items.nyc.push(nyc.body.items[i]);
                		}
                	}
                } else {
                	console.log(err);
                    //TODO: error handling
	        	}
	    	}

	        if (!err && miami.body) {
                if (miami.body && miami.body.ack == 'SUCCESS') {
                	items.miami = [];
                	for (var i in miami.body.items) {
                		if (miami.body.items[i].postal) {
							items.miami.push(miami.body.items[i]);
						}
                	}
                } else {
                	console.log(err);
                    //TODO: error handling
	        	}
	    	}

	        if (!err && london.body) {
                if (london.body && london.body.ack == 'SUCCESS') {
                	items.london = [];
                	for (var i in london.body.items) {
                		if (london.body.items[i].postal) {
                			items.london.push(london.body.items[i]);
                		}
                	}
                } else {
                	console.log(err);
                    //TODO: error handling
	        	}
	    	}

	        if (!err && berlin.body) {
                if (berlin.body && berlin.body.ack == 'SUCCESS') {
                	items.berlin = [];
                	for (var i in berlin.body.items) {
                		if (berlin.body.items[i].postal) {
                			items.berlin.push(berlin.body.items[i]);
                		}
                	}
                } else {
                	console.log(err);
                    //TODO: error handling
	        	}
	    	}

	    	if (!err && sydney.body) {
                if (sydney.body && sydney.body.ack == 'SUCCESS') {
                	items.sydney = [];
                	for (var i in sydney.body.items) {
                		if (sydney.body.items[i].postal) {
                			items.sydney.push(sydney.body.items[i]);
                		}
                	}
                } else {
                	console.log(err);
                    //TODO: error handling
	        	}
	    	}

	    	res.render('map', {
				items: items,
				cities: cities
			});
	    }
	)
};