class Cookie {
	constructor(name) {
		console.log(name);
		this.name = name;
	}

	set(value, exp) {
		let date = new Date();
		date.setTime(date.getTime() + exp*24*60*60*1000);
		document.cookie = this.name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
	}

	get() {
		console.log(document.cookie);
		let value = document.cookie.match('(^|;) ?' + this.name + '=([^;]*)(;|$)');
		console.log(value);
		return value? value[2] : null;
	}

	delete() {
		document.cookie = this.name + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
	}
}

