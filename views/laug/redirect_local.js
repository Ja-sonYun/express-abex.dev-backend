const ORIGIN = document.title;

if(confirm("We're collecting visitors ip addresses for prevent multiple access. If you don't want to pass your ip address to our server, please click { Cancel } button. To continue, please click { OK } button. Ip addresses will be deleted when the target url is expired.")) {
	window.location.href = "http://localhost:3000/laug/l/" + ORIGIN + '/go';
} else {
	window.history.back();
}
