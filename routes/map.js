var request = require('request'),
	step = require('step'),
	extend = require('util')._extend,
	protein = require('../public/resources/protein.json'),
	common = require('../public/resources/common.json');

module.exports.init = function(app){
	app.get('/', buildMap);
	app.get('/city/:city', getMoreItems)
}

function getMoreItems(req, res) {
 	var city = req.params.city; 
       
	// Configure the request
	var options = {
	    method: 'GET',
	    json: true,
	    url: common.feedsvcr + 'keyword=new&num=' + common.numItems + '&algo=highbids' + (common.cities[city].postal ? "&zip=" + common.cities[city].postal : "") + (common.cities[city].distance ? "&distance=" + common.cities[city].distance : "")
	}

	console.log(options);
	var items = {};

	step(
		function getCollections() {
		    request(options, this.parallel());
		},
		function renderPage(err, city) {
		    if (!err && city.body) {
                if (city.body && city.body.ack == 'SUCCESS') {
                	console.log(city.body);
                	items.city = [];
                	for (var i in city.body.items) {
                		if (city.body.items[i].postal) {
							items.city.push(city.body.items[i]);
                		}
                	}
                } else {
                	console.log(err);
                    //TODO: error handling
	        	}
	        }
	        console.log(items);
	        res.send(items);
	    }
	)
}

function buildMap(req, res){
	
	// Configure the request
	var options = {
	    method: 'GET',
	    json: true
	}

	var worldOptions = extend({}, options);
	worldOptions.url = common.feedsvcr + 'keyword=new&num=' + common.numItems + '&algo=highbids' + (common.cities.world.postal ? "&zip=" + common.cities.world.postal : "") + (common.cities.world.distance ? "&distance=" + common.cities.world.distance : "");

	var nycOptions = extend({}, options);
	nycOptions.url = common.feedsvcr + 'keyword=new&num=' + common.numItems + '&algo=highbids' + (common.cities.nyc.postal ? "&zip=" + common.cities.nyc.postal : "") + (common.cities.nyc.distance ? "&distance=" + common.cities.nyc.distance : "");

	var miamiOptions = extend({}, options);
	miamiOptions.url = common.feedsvcr + 'keyword=new&num=' + common.numItems + '&algo=highbids' + (common.cities.miami.postal ? "&zip=" + common.cities.miami.postal : "") + (common.cities.miami.distance ? "&distance=" + common.cities.miami.distance : "");

	var londonOptions = extend({}, options);
	londonOptions.url = common.feedsvcr + 'keyword=new&num=' + common.numItems + '&algo=highbids' + (common.cities.london.postal ? "&zip=" + common.cities.london.postal : "") + (common.cities.london.distance ? "&distance=" + common.cities.london.distance : "");
	londonOptions.headers = {};
    londonOptions.headers["X-EBAY-FISNG-GEOINFO"] = common.cities.london.geoInfo;

	var berlinOptions = extend({}, options);
	berlinOptions.url = common.feedsvcr + 'keyword=new&num=' + common.numItems + '&algo=highbids' + (common.cities.berlin.postal ? "&zip=" + common.cities.berlin.postal : "") + (common.cities.berlin.distance ? "&distance=" + common.cities.berlin.distance : "");
	berlinOptions.headers = {};
    berlinOptions.headers["X-EBAY-FISNG-GEOINFO"] = common.cities.berlin.geoInfo;
	
	var sydneyOptions = extend({}, options);
	sydneyOptions.url = common.feedsvcr + 'keyword=new&num=' + common.numItems + '&algo=highbids' + (common.cities.sydney.postal ? "&zip=" + common.cities.sydney.postal : "") + (common.cities.sydney.distance ? "&distance=" + common.cities.sydney.distance : "");
	sydneyOptions.headers = {};
    sydneyOptions.headers["X-EBAY-FISNG-GEOINFO"] = common.cities.sydney.geoInfo;

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
				cities: common.cities
			});
	    }
	)
};