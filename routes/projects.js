var express = require('express');
var router = express.Router();

var REST = require('../config/database.js');


router.get('/get', function(req, res, next) {
	let getResult = new REST();
	getResult.executeAndReturn('SELECT * FROM PROJECTS', res);
});

router.get('/todos', function(req, res, next) {
	let getResult = new REST();
	getResult.executeAndReturn('SELECT * FROM PROJECT_TODOS' + ' where project_id = ' + req.query.ID, res);
});


// [project_id, title, subtitle, text, status(did or didn't)]
router.post('/posttodo', function(req, res, next) {
	// let postTodo = new REST();
	console.log(req.body);
});



module.exports = router;
