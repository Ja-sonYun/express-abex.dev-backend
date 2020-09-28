var express = require('express');
var router = express.Router();

var REST = require('../config/database.js');


router.get('/get', function(req, res, next) {
	let getResult = new REST();
	getResult.execute('SELECT * FROM PROJECTS', res);
});

module.exports = router;
