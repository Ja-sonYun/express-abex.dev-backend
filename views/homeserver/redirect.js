axios.post("/ms/creatingnewurl").then((res) => {
	window.location.href = res.data.url;
}).catch((err) => {
	alert(`something wrong! please contact to here -> admin@abex.dev`);
});
