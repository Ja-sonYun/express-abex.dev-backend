const mysql = require('mysql');
const accounts = require('../.accounts.json');

module.exports = class REST {
	constructor() {
		this.connection = mysql.createConnection(accounts.mysql);
	}

	// Does it work??
	// #sqlInjectionByPass(query) {
	// }

	executeQuery(query) {
		let that = this; // bind that
		return new Promise(function(resolve, reject) {
			that.connection.query(query, (error, rows, fields) => {
				if(error) reject(error);
				resolve(rows);
			});
		})
	}

	executeQueryWithoutReturn(query) {
		this.connection.query(query, (error, rows, fields) => {
			if(error) return error;
			return true;
		})
	}

	executeAndReturn(query, res) {
		this.connection.connect();
		this.connection.query(query, (error, rows, fields) => {
			if(error) throw error;

			res.writeHead(200, {
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
