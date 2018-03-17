$( document ).ready(function() {
 	console.log("welcome!");
 	run();
});



function run(){
	$( "#data_grabber" ).click(function() {
  		$.get('/grab_data.json', function(res){
  			print_data(res);
  		});
	});
}


function print_data(res) {
	console.log(res);
}