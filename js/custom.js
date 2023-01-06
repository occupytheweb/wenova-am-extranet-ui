$(document).ready(function () {
    //DataTable
	jQuery('#example').DataTable();  
});

//MOBILE-MENU	
	jQuery("button.navbar-toggle").click(function(){
		jQuery("body").toggleClass("nav-open");
		jQuery("html").toggleClass("overflow-hidden");
	  });
