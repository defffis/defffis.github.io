menu.onclick = function myFunction() {
	var x = document.getElementById('mytopNav');

	if (x.className === "topnav"){
		x.className += " responsive";
	} else {
		x.className = "topnav";
	}
}

  $(document).ready(function(){
    $("a[href*=#]").on("click", function(e){
        var anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $(anchor.attr('href')).offset().top
        }, 777);
        e.preventDefault();
        return false;
    });
});
