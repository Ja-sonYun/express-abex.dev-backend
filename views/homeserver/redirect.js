axios.post("/ms/creatingnewurl").then((res) => {
	window.location.href = res.data.url;
});
