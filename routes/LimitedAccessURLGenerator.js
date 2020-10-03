var express = require('express');
var router = express.Router();

var REST = require('../config/database.js');
var generateRandomString = require('../modules/generateRandomString.js');

router.get('/l/:origin', function(req, res, next) {
	let rest = new REST();
	console.log(req.params.origin);
	rest.executeQuery(`select * from LINKLIST where originURL = '${req.params.origin}' limit 1`).then((row) => {
		console.log('asdasd',row[0]);

		if(row[0].visits_max > row[0].visited) {
			rest.executeQueryWithoutReturn(`update LINKLIST set visited=visited+1 where originURL = '${req.params.origin}';`);
			if(row[0].visits_max-1 == row[0].visited) {
				rest.executeQueryWithoutReturn(`delete from LINKLIST where originURL = '${req.params.origin}';`);
			}
			res.redirect(row[0].destinationURL);
		} else {
			// reached max
			rest.executeQueryWithoutReturn(`delete from LINKLIST where originURL = '${req.params.origin}';`);
			res.send({ error: 'This url is expired or doesn\'t exist.' });
		}
	}).catch((error) => {
		//page link expired
		res.send({ error: 'This url is expired or doesn\'t exist.' });
	});
});


router.post('/generateurl', function(req, res, next) {
	let rest = new REST();

	// get random and unique string for wrap the url
	checkIsUniqueString(rest).then((url) => {

		// destination url that got from user
		let dest = req.body.dest;

		let limit = req.body.limit;
		// if(limit > 100) {
		// // error return
		// }
		console.log(url, limit);
		rest.executeQuery(`insert into LINKLIST(originURL, destinationURL, visits_max) values('${url}', '${dest}', '${limit}');`).then((status) => {
			if(status.insertId == undefined) {
				console.log('error');
				// res.send(500);
				res.status(500);
			} else {
				// res.json(200, {status: "ok", wrappedURL: url});
				res.status(200).json({status: "ok", wrappedURL: url});
			}
		});

	});

});


// loop this function until got uniqu string
function checkIsUniqueString(rest) {
	return new Promise(function(resolve, reject) {
		url = generateRandomString();
		rest.executeQuery(`select * from LINKLIST where originURL = '${url}';`).then((rows) => {
			console.log(rows);
			if(rows.length != 0) {
				resolve(checkIsUniqueString(rest));
			} else {
				resolve(url);
			}
		});
	})
};

module.exports = router;
