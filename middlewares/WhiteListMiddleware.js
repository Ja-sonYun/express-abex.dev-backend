const REST = require('../config/database.js');

module.exports = function WhiteList(req, res, next) {
	let rest = new REST();
	rest.executeQuery(`select * from DEV_PAGE_WHITE_LIST where ip = '${req.ip}';`).then((row) => {
		if(row.length || req.ip == "::1") { // ::1 for local access
			next();
		} else {
			console.log(req.ip + ' tried to access.');
			res.send({ error: 'This access does not allowed.' });
		}
	});
};
