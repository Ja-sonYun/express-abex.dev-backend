const mysql = require('mysql');
const accounts = require('../.accounts.json');

module.exports = class REST {
	constructor() {
		this.connection = mysql.createConnection(accounts.mysql);
	}

	// Does it work??
	// #sqlInjectionByPass(query) {
	// }

	executeAndReturn(query, res) {
		this.connection.connect();
		this.connection.query(query, (error, rows, fields) => {
			if(error) throw error;

			res.writeHead(200, {
				'Access-Control-Allow-Origin:*',
				'Content-Type':'application/json',
				'charset':'utf-8'
			});

			if(rows.length > 0) {
				res.write(JSON.stringify([rows]));
			} else {
				res.write(JSON.stringify([]));
			}
			res.end();
			this.connection.destroy();
		});
	}
}
