var express = require('express');
var router = express.Router();

var REST = require('../config/database.js');
var generateRandomString = require('../modules/generateRandomString.js');


router.get('/l/:origin', function(req, res, next) {
	res.render('laug/redirect', { // _local for debuggin
		origin: req.params.origin,
	});
});

// Checking the origin url is exist on the database.
router.get('/l/:origin/go', function(req, res, next) {
	let rest = new REST();
	res.locals.rest = rest;
	rest.executeQuery(`select * from LINKLIST where originURL = '${req.params.origin}' limit 1`).then((row) => {
		if(row.length == 0) { // target link does not exist
			res.send({ error: 'This url is expired or doesn\'t exist.' });
		} else {
			res.locals.row = row[0];
			next();
		}
	});
	// Checking the user was visited.
}, function(req, res, next) {
	res.locals.rest.executeQuery(`select * from LINKVISITEDUSERLIST where user_ip = '${req.ip}' and originURL = '${req.params.origin}';`).then((row) => {
		console.log(row);
		if(row.length == 0) {
			res.locals.rest.executeQueryWithoutReturn(`insert into LINKVISITEDUSERLIST(originURL, user_ip) values('${req.params.origin}', '${req.ip}');`);
			next();
		} else {
			res.send({ error: 'You already visited this website. If not, please try with cellular data.' });
		}
	})
});

router.get('/l/:origin/go', function(req, res, next) {
	if(res.locals.row.visits_max > res.locals.row.visited) {
		res.locals.rest.executeQueryWithoutReturn(`update LINKLIST set visited=visited+1 where originURL = '${req.params.origin}';`);
		if(res.locals.row.visits_max-1 == res.locals.row.visited) {
			res.locals.rest.executeQueryWithoutReturn(`delete from LINKLIST where originURL = '${req.params.origin}';`);
		}
		res.redirect(res.locals.row.destinationURL);
	} else {
		// reached max
		res.locals.rest.executeQueryWithoutReturn(`delete from LINKLIST where originURL = '${req.params.origin}';`);
		res.send({ error: 'This url is expired or doesn\'t exist.' });
	}
});


router.post('/generateurl', function(req, res, next) {
	let rest = new REST();
	if(!validURL(req.body.dest) || req.body.limit > 100 || req.body.limit < 0) {
		res.send({ error: 'wrong request type!' });
	} else {
		res.locals.rest = rest;
		next();
	}
}, function(req, res, next) {
	res.locals.rest.executeQuery(`select * from LINKLIST where created_by = '${req.ip}';`).then((row) => {
    next();
    // TODO:DEVMODE
		// if(row.length < 10) {
		//   next();
		// } else {
		//   res.send({ error: 'you already generate 10 links. If not, please try with celluar data.' });
		// }
	})
});

router.post('/generateurl', function(req, res, next) {
	// get random and unique string for wrap the url
	checkIsUniqueString(res.locals.rest).then((url) => {
		// destination url that got from user
		let dest = req.body.dest;
		let limit = req.body.limit;
		res.locals.rest.executeQuery(`insert into LINKLIST(originURL, destinationURL, visits_max, created_by) values('${url}', '${dest}', '${limit}', '${req.ip}');`).then((status) => {
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
