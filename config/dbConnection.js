var mongo = require('mongodb');

var mongoDB = function() {
	console.log('entrou na funcao de conexao');
	var db = new mongo.Db(
		'got',
		new mongo.Server(
			'localhost',
			27017,
			{}
		),
		{}
	);

	return db;
}

module.exports = function() {
	return mongoDB;
}