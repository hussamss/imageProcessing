var video = document.getElementById('video');
var canvas = document.getElementById('myImage');
var context = canvas.getContext('2d');
var image = document.getElementById('myImage');
// console.log('outside')
// console.log(canvas)
// console.log(context)
// console.log(image)

$('select').change(function(e){
	var idName;

	$( "option:selected" ).each(function() {
	  $('.mainContainer').hide();
	  
	  
    idName = $( this ).val();
    // console.log(idName)
    // var idName = '#'+idName; 
    $( idName ).show();
	});
	if(idName==='video'){
		$('.video ').show();
		// Get access to the camera!
		var video = document.getElementById('video');
		if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    		// Not adding `{ audio: true }` since we only want video now
    		navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
     		video.src = window.URL.createObjectURL(stream);
        	// document.write(video.src)
        	video.play();
    		});

    	$("#snap").click(function() {
    		// console.log('here in snap')
			context.drawImage(video, 0, 0, canvas.width, canvas.height);

		});
    	}
	}else if(idName==='sqrImage'){
		// video.pause();
		$('.sqrImage').show();
		canvas = document.getElementById('myImage1');
		context = canvas.getContext('2d');
		image = document.getElementById('img1');
		context.drawImage(image, 0, 0, canvas.width, canvas.height);
		
    	
	}else if(idName==='circleImage'){
		// video.pause();
		$('.circleImage').show();
		canvas = document.getElementById('myImage2');
		context = canvas.getContext('2d');
		image = document.getElementById('img2');
		context.drawImage(image, 0, 0, canvas.width, canvas.height);
		
	}


});

