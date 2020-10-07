const express = require('express');
const router = express.Router();

const REST = require('../config/database.js');
const WhiteListMiddleware = require('../middlewares/WhiteListMiddleware.js');

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


// develop
let pathToDev = (filename) => {
	return __dirname.slice(0, -6) + 'develop/' + filename;
}

router.get('/dev/laug', [WhiteListMiddleware], function (req, res, next) {
	res.sendFile(pathToDev('lalg.html'));
});

module.exports = router;
