module.exports = function WhiteList(req, res, next) {
	if(req.ip == "::1" || req.ip == "114.163.91.6") { // ::1 is for local access.
		next();
	} else {
		console.log(req.ip + ' tried to access.');
		res.send({ error: 'This access does not allowed.' });
	}
};
