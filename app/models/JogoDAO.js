var ObjectId = require('mongodb').ObjectId;

function JogoDAO(connection) {	
	this._connection = connection();
}

JogoDAO.prototype.gerarParametros = function(usuario) {
	this._connection.open( function(err, mongoclient){
		mongoclient.collection("jogo", function(err, collection){
			collection.insert({
				usuario: usuario,
				moeda: 15,
				suditos: 10,
				temor: Math.floor((Math.random() * 1000)),
				sabedoria: Math.floor((Math.random() * 1000)),
				comercio: Math.floor((Math.random() * 1000)),
				magia: Math.floor((Math.random() * 1000))
			});
			mongoclient.close();
		});
	});
}

JogoDAO.prototype.iniciaJogo = function (usuario, casa, callback) {
    this._connection.open(function (err, mongoclient) {
        mongoclient.collection("jogo", function (err, collection) {
            collection.findOne({usuario: usuario}, function (err, result) {
                callback(result);
            }); 
            mongoclient.close();
        });
    });
}

JogoDAO.prototype.acao = function (acao) {
	this._connection.open( function(err, mongoclient){
		mongoclient.collection("acao", function(err, collection) {

			var date = new Date();
			var tempo = null;

			switch(acao.acao) {
				case "1": tempo = 1 * 60 * 60000; break;
				case "2": tempo = 2 * 60 * 60000; break;
				case "3": tempo = 5 * 60 * 60000; break;
				case "4": tempo = 5 * 60 * 60000; break;
			}

			acao.acao_termina = date.getTime() + tempo;
			collection.insert(acao);
			
		});

		mongoclient.collection("jogo", function(err, collection) {
			var moedas = null;

			switch(acao.acao) {
				case "1": moedas = -2 * acao.quantidade; break;
				case "2": moedas = -3 * acao.quantidade; break;
				case "3": moedas = -1 * acao.quantidade; break;
				case "4": moedas = -1 * acao.quantidade; break;
			}

			collection.update (
				{usuario: acao.usuario},
				{$inc: {moeda: moedas}}
			);

			mongoclient.close();

		});
	});	
}

JogoDAO.prototype.getAcoes = function (usuario, callback) {
    this._connection.open(function (err, mongoclient) {
        mongoclient.collection("acao", function (err, collection) {

        	var date = new Date();
        	var momento_atual = date.getTime();

        	collection.find({usuario: usuario, acao_termina: {$gt:momento_atual}}).toArray(function(err, result) {
				callback(result);
            }); 
            mongoclient.close();
        });
    });	
}

JogoDAO.prototype.revogarAcao = function (_id, callback) {
	this._connection.open(function (err, mongoclient) {
        mongoclient.collection("acao", function (err, collection) {

        	collection.remove(
        		{_id: ObjectId(_id)},
        		callback
        	);

            mongoclient.close();
        });
    });	

}

module.exports = function() {
	return JogoDAO;
}