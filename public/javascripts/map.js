// Get Mr.DJ's current location
$.get('pipes/gethome.txt', myFunction);
	var splitResult = {}
	function myFunction(data)
	{
        	splitResult = data.split(' ');
			//Default to Student Union (UCF) if no GPS fix is found
            if( (splitResult[0] == 0.0 && splitResult[1] == 0.0) || (splitResult[0] == "None" && splitResult[1] == "None") )
            {
                splitResult[0] = 28.60198684;
                splitResult[1] = -81.20048836;
            }
            console.log(splitResult[0]+'\n'+splitResult[1]);
    } 

function initialize(){
	var currentLocation = splitResult;

	// Default Map Options
	var mapOptions = {
		center: new google.maps.LatLng(currentLocation[0],currentLocation[1]),
		zoom: 22,
		scrollwheel: false,
		panControl: false,
		streetViewControl: false,
		disableDefaultUI: true,
		mapTypeId: google.maps.MapTypeId.SATELLITE
	};

	// Create map object called 'map'
	var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	
	// Drawing Options
	var drawingManager = new google.maps.drawing.DrawingManager({
		drawingMode: google.maps.drawing.OverlayType.POLYGON, // default drawing icon
		drawingControl: false, //shows drawing screen
		polygonOptions: {
			fillColor: '#FF0000',
			draggable: true,
			fillOpacity: .25,
			strokeWeight: 3
		}
	});
	
	// Get initial center
	var getcenter = map.getCenter();
	console.log(getcenter);
	if(isNaN(map.getCenter()['k'])){
		console.log("GOT NAN!!!!");
		window.location.replace('newgame');
	}
	else{
		console.log("got location");
	}

	console.log("Current Location "+getcenter);
	
	drawingManager.setMap(map);
	
	// Excecutes after polygon is created
	google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon){
		
		vertices = polygon.getPath();
		console.log('polygon complete');
		for(var i = 0; i < vertices.getLength(); i++){
			var xy = vertices.getAt(i);
			polygonCoordinates[i] = xy;
		}
	});	
}

var polygonCoordinates = [];
var vertices = null ;
var game_time = null;
var num_players = null;


$('input:radio[name=game_time]').click(function(){
	console.info($(this).val());
	game_time = $(this).val();
});
$('input:radio[name=num_players]').click(function(){
	console.info($(this).val());
	num_players = $(this).val();
});

$('form').submit(function(event){
	console.info('submit triggered');
	event.preventDefault();

	// if all required form values are set
	if (game_time && num_players && polygonCoordinates.length > 2){		
		
		var postdata = [];
		
		//Add home first
		var obj = {};
		obj['lat'] = splitResult[0]
		obj['lon'] = splitResult[1]
		postdata.push(obj);
		
		//Add rest of flight plan
		$.each(polygonCoordinates, function(key, val){
			var obj = {}
			obj['lat'] = val.k;
			obj['lon'] = val.D;
			postdata.push(obj);
		});

		console.log('submit btn clicked');
		$.ajax({
			url:'/newgame',
			method:'POST',
			data: {
				game_time: game_time,
				num_players: num_players,
				region: postdata
			},
			success: function(xdata, status){
				console.log(status);
				//$('div').hide("slow");
				(window.location.replace('stats'))
			},
			error: function(xdata, status){
				console.error(status);
			}
		});
	}
	else{
		$('#alert').append('Must select all options').removeClass('hide');
	}
});
//google.maps.event.addDomListener(window, 'load', initialize);
