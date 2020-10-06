var express = require('express');
var router = express.Router();

var REST = require('../config/database.js');
var generateRandomString = require('../modules/generateRandomString.js');


router.get('/l/:origin', function(req, res, next) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

	console.log(ip);
	// res.render('redirect', {
	//     origin: req.params.origin,
	// });
});

router.get('/l/:origin/y', function(req, res, next) {
	let rest = new REST();
	rest.executeQuery(`select * from LINKLIST where originURL = '${req.params.origin}' limit 1`).then((row) => {

		if(row[0].visits_max > row[0].visited) {
			rest.executeQueryWithoutReturn(`update LINKLIST set visited=visited+1 where originURL = '${req.params.origin}';`);
			if(row[0].visits_max-1 == row[0].visited) {
				rest.executeQueryWithoutReturn(`delete from LINKLIST where originURL = '${req.params.origin}';`);
			}
			// res.redirect(row[0].destinationURL);
			console.log(row[0].destinationURL);
			res.render('redirect', {destination: row[0].destinationURL});
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
	if(!validURL(req.body.dest) || req.body.limit > 100) {
		res.send({ error: 'wrong request type!' });
		return;
	}

	// get random and unique string for wrap the url
	checkIsUniqueString(rest).then((url) => {

		// destination url that got from user
		let dest = req.body.dest;

		let limit = req.body.limit;
		rest.executeQuery(`insert into LINKLIST(originURL, destinationURL, visits_max) values('${url}', '${dest}', '${limit}');`).then((status) => {
			if(status.insertId == undefined) {
				res.send({ error: 'This url is expired or doesn\'t exist.' });
			} else {
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
			if(rows.length != 0) {
				resolve(checkIsUniqueString(rest));
			} else {
				resolve(url);
			}
		});
	})
};

function validURL(str) {
	let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
		'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
	return !!pattern.test(str);
}

module.exports = router;
