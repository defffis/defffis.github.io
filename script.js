document.addEventListener("DOMContentLoaded", function(event) { 
var sendMail;
var sites = JSON.parse(JSON.stringify(data));
console.log("Кол-во сайтов - " + sites.length);
for (var i = 0; i < sites.length; i++) {
	var div = `<div class="projects-card">`;
	div += `<img src="${sites[i].img}" />`;
	div += `<h1>${sites[i].title}</h1>`;
	div += `<p><button><a href="${sites[i].link}">открыть</a></button></p>`;
	div += `</div>`;
	if (div !== undefined) {
		document.getElementById("content").innerHTML += div;
	}       
	
}

	sendMail = function()
	{
	    window.location.href = `mailto:al1111997@yandex.ru`;
	}
});