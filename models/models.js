var path=require('path');
//Postgress DATABASE_URL = postgress://user:passwd@host:port/database
//SQLite DATABASE_URL =SQLITE://:@:/

var url= process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;


//Cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite:
//var sequelize = new Sequelize(null,null,null,
//	{dialect:"sqlite",storage:"quiz.sqlite"}
//	);

//Importar la definicion de la tabla Quiz en quiz.js
//var Quiz = sequelize.import(path.join(__dirname,'quiz'));
//exports.Quiz = Quiz; // exportar definicion de tabla Quiz

// Usar BBDD SQLite o Posgres
var sequelize = new Sequelize(DB_name, user, pwd,
	{dialect: protocol,
		protocol:protocol,
		port: port,
		host: host,
		storage: storage, //solo SQLite (.env)
		omitNull: true // solo Postgres
	}
);

// Importar definicion de la tabla Quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

exports.Quiz = Quiz; // exportar tabla Quiz

//sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function(){
		//success() ejecuta el manejador una vez creada la tabla
		Quiz.count().success(function(count){
				if(count===0){//la tabla se inicializa solo si esta vacia
					Quiz.create({pregunta:'Capital de Italia',
								respuesta:'Roma'
					})
		.success(function(){console.log('Base de datos inicializada')});
				};
		});
});