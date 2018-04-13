module.exports.jogo = function(app, req, res) {
	if(req.session.autorizado) {
		res.render('jogo');
	} else {
		res.send('asdasd');
	}
}

module.exports.sair = function(app, req, res) {
	req.session.destroy(function(err){
		res.render('index', {validacao: {}});
	});
}