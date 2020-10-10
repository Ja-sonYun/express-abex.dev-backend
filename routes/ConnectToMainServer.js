var express = require('express');
var router = express.Router();

var remoteit = require('../modules/remoteit.js');
var REST = require('../config/database.js');
var isOnline = require('../modules/isOnline.js');

router.get('/', function(req, res, next) {
	let rest = new REST();
	rest.executeQuery(`select * from ENV where _key = 'redirectToHomeServer' limit 1;`).then((row) => {
		isOnline((o) => {
			if(o) {
				res.redirect(row[0]._value);
			} else {
				res.render('homeserver/redirect');
			}
		}, row[0]._value);
	});
});


router.post('/creatingnewurl', function(req, res, next) {
	let rest = new REST();
	let remote = new remoteit();
	remote.login()
		.then(() => {
			return remote.getDeviceAddress('http-ad');
		})
		.then(() => {
			return remote.connect();
		})
		.then((data) => {
			let createdUrl = data.connection.proxy;
			res.status(200).json({ status: "ok", url: createdUrl });

			// store created link
			rest.executeQueryWithoutReturn(`update ENV set _value = '${createdUrl}' where _key = 'redirectToHomeServer';`);
		});

});

module.exports = router;
