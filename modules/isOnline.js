var axios = require('axios');

module.exports = function isOnline(cb, adr) {
	axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(adr)}`)
		.then((res) => {
			if(res.data.contents == null) {
				cb(false);
			} else {
				cb(true);
			}
		});
}
