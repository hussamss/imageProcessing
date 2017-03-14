// This is the main script in which all functionality of are initializ. 

var video = document.getElementById('video'); 	// get video element
var canvas = document.getElementById('myImage'); // get the canvas element for the image load
var context = canvas.getContext('2d'); 			// create a context from the canvas element
var image = document.getElementById('myImage'); 


// This function is invoked when an image or video is selected
$('select').change(function(e){
	var idName; // id name of the select image or video using 

	$( "option:selected" ).each(function() {
	  	$('.mainContainer').hide();// hide mainContainer class
   		 idName = $( this ).val();// get image or video id from the value property .val()
    	$( idName ).show();	// show the select image
	});
	if(idName==='video'){	// if video is selected, then 
		$('.video ').show();// Get access to the camera!
		image = document.getElementById('myImage');
		canvas = document.getElementById('myImage'); 
		context = canvas.getContext('2d');
		if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) { // play the video from mediaDevices
    		
    		navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
     		video.src = window.URL.createObjectURL(stream);
        	// document.write(video.src)
        	video.play();
    		});

    	$("#snap").click(function() {// on click of a button snap an image from the video
			context.drawImage(video, 0, 0, canvas.width, canvas.height);
		});
    	}

	}else if(idName==='sqrImage'){	//if the select image is the colorful square 
		
		$('.sqrImage').show();// then show the image containers and elements
		canvas = document.getElementById('myImage1'); // get the canvas of image by id 
		context = canvas.getContext('2d');				
		image = document.getElementById('img1');// get the sqaures image by id
		context.drawImage(image, 0, 0, canvas.width, canvas.height);//draw or show the image in the context 
		
    	
	}else if(idName==='circleImage'){//if the select image is the RGB Circles image 
			
		$('.circleImage').show();// then show the image containers and elements 
		canvas = document.getElementById('myImage2'); // get the canvas of image by id 
		context = canvas.getContext('2d');
		image = document.getElementById('img2'); // get the sqaures image by id
		context.drawImage(image, 0, 0, canvas.width, canvas.height);//draw or show the image in the context
		
	}
});

