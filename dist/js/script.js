document.addEventListener('DOMContentLoaded', function () {
var content = document.getElementById("content");
var show = document.getElementById("showContent");
	
	show.addEventListener("click", () => {
		if(content.style.display == "block")
			content.style.display = "none";
		else if(content.style.display == "none")
			content.style.display = "block";
	})
});

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