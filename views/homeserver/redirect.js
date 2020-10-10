alert("currently trying to request new link from remote.it. please wait for 2 to 10 seconds.");
axios.post("/ms/creatingnewurl").then((res) => {
	window.location.href = res.data.url;
});
