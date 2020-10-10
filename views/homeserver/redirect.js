axios.post("/ms/creatingnewurl").then((res) => {
	document.getElementById("toptext").innerHTML = 'Done!';
	document.getElementById("bottomtext").innerHTML = 'Now redirecting to the gernerated url...';
	window.location.href = res.data.url;
}).catch((err) => {
	alert(`something wrong! please contact to here -> admin@abex.dev`);
});
