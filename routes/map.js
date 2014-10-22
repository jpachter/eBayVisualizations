module.exports.init = function(app){
	app.get('/', buildMap);
}

function buildMap(req, res){
	res.render('map');
};