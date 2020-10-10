const axios = require("axios");

token = '';
username = 'killa30867@gmail.com';
password = '@Jasonyun30867';
developerkey = 'QjJDRDg2RDAtMkM0MC00NERBLTg2OTQtNUZFQzUxMkFENDIz';
wait = true;
hostip = '0.0.0.0';
devicealias = '';
deviceaddress = '';

module.exports = class remoteit {
	login() {
		return new Promise(function(resolve, reject) {
			// login
			axios.post("https://api.remot3.it/apv/v27/user/login",{ username, password },{ headers: { developerkey }
				}).then(response => {
					// this.token = response.data.token;
					token = response.data.token;
					console.log(token)
					resolve(true);
				}).catch(error => {
					console.log(error);
					reject(false);
				});
		})
	}

	getDeviceAddress(devicealias) {
		devicealias = devicealias;
		return new Promise(function(resolve, reject) {
			axios.get("https://api.remot3.it/apv/v27/device/list/all", {
					headers: {
						developerkey,
						token
					}
				}).then(response => {
					response.data.devices.forEach(device => {
						if(device.devicealias == devicealias) {
							deviceaddress = device.deviceaddress;
							resolve(true);
						}
					})
				}).catch(error => {
					console.log(error);
					reject(false);
				});
		})
	}


	connect() {
		return new Promise(function(resolve, reject) {
			axios.post("https://api.remot3.it/apv/v27/device/connect", { deviceaddress, wait, hostip }, { headers: { developerkey, token }
				}).then(response => {
					resolve(response.data);
				}).catch(error => {
					console.log(error);
					reject(false);
				});
		})
	}
}
