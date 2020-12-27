const ORIGIN = document.title;

if(confirm("click ok button to move. You can visit this website only one time.")) {
	window.location.href = "https://api.abex.dev/laug/l/" + ORIGIN + '/go';
} else {
	window.history.back();
}
