// This file contains the main filtering function and it uses jQuery to response 
// for the User interaction with the project


/*thresholding function: take 
threshold value,
ctx : 2D context of a canvas to draw or show image in
canvas element
*/
function thresholding(value, ctx, canvas) {
	ctx.drawImage(image,0,0, canvas.width, canvas.height);									// drow the original image
	var img = ctx.getImageData(0,0,canvas.width, canvas.height);							// get the image data from the context in which the image is drawn in

  	for (var i = 0; i < img.data.length; i += 4) {
    	var p = 0.2126*img.data[i] + 0.7152*img.data[i+1] + 0.0722*img.data[i+2];			// get the grayScale values of the image in RGB values
    	var thr = value || 128;																// assign thrshold value or 128 to thr var
    	img.data[i] = img.data[i+1] = img.data[i+2] = thr > p ? 0 : 255;					// compare the thr var with p, if thr var is larger then all pixels are set 0 else all pixels are set to 255
  }
 	
  	var imgData = ctx.createImageData(canvas.width,canvas.width);							// create image data container with the same original size of the original image
	imgData.data.set(img.data);																// Put the modified img.data into the new image data (imgData) var
	ctx.putImageData(imgData, 0, 0);														// Draw or show the new thresholded image
};


/* This function takes 
image
context 
canvas

apply a grayScale to using the luminosity method 
Then return return the new grayScale image data  */
function ApplyGray(image, ctx, canvas){
	ctx.drawImage(image,0,0, canvas.width, canvas.height); 									// drow the original image
	var img = ctx.getImageData(0,0,canvas.width, canvas.height);							// get the image data into a new variable 
	for(var i = 0; i<img.data.length; i+=4){
			
			img.data[i] = 0.2126*img.data[i] + 0.7152*img.data[i+1]+ 0.0722*img.data[i+2];	// Apply luminosity method to RGB pixels 0.21 R + 0.72 G + 0.07 B
			img.data[i+1]=img.data[i];														// Set the GB pixel to the same values are gray scal in img.data[i] which assign to red pixel
			img.data[i+2]=img.data[i];
			img.data[i+3]=img.data[i+3];													// keep alpha values as it is.
			
		}
  
  return img;																				// return the modified img 
}


/*
This function ApplyFilter take
filter: filter name ex (red, green, gray, ..)
ctx: 	the context of an canvas
canvas: the image canvas

Then apply the filter for the image  
*/

function ApplyFilter(filter, ctx, canvas){
	// console.log('in ApplyFilter')
	ctx.drawImage(image,0,0, canvas.width, canvas.height);									//drow the original image
	var img = ctx.getImageData(0,0,canvas.width, canvas.height);							// get the image data into a new variable

	if(filter==='red'){																		// if filter is red then, set img.data to original img.data only the red pixel which is img.data[i], each element from 4(0, 4, 8, )
		for(var i = 0; i<img.data.length; i+=4){
			img.data[i] = img.data[i];
			img.data[i+1]=0;
			img.data[i+2]=0;
			img.data[i+3]=img.data[i+3];
		}
	} else if (filter==='blue'){															
		for(var i = 0; i<img.data.length; i+=4){
			img.data[i] = 0;																// if filter is blue then, set img.data to original img.data only the blue pixel which is img.data[i], each element from 4(2, 6, 10, )
			img.data[i+1]=0;
			img.data[i+2]=img.data[i+2];
			img.data[i+3]=img.data[i+3];
		}
	} else if (filter==='green'){
		for(var i = 0; i<img.data.length; i+=4){											// if filter is green then, set img.data to original img.data only the green pixel which is img.data[i], each element from 4(1, 5, 9, ... )
			img.data[i] = 0;
			img.data[i+1]=img.data[i+1];
			img.data[i+2]=0;
			img.data[i+3]=img.data[i+3];
		}
	} else if (filter==='gray'){
		for(var i = 0; i<img.data.length; i+=4){
			img.data[i] = 0.2126*img.data[i] + 0.7152*img.data[i+1]+ 0.0722*img.data[i+2];	//convert the image data into gray scale and then store the results in the red pixel and assign the grayscale value to the other pixels
			// img.data[i] = 0.333*img.data[i] + 0.333*img.data[i+1]+ 0.333*img.data[i+2];
			img.data[i+1]=img.data[i];
			img.data[i+2]=img.data[i];
			img.data[i+3]=img.data[i+3];
		}
	} else if (filter==='sepia'){
		for(var i = 0; i<img.data.length; i+=4){
			img.data[i] = 0.3*img.data[i] + 0.59*img.data[i+1]+ 0.11*img.data[i+2];			//Convert the image to another scale using the provided equation, then store the values to the red, green, and blue pixels of the image 
			img.data[i+1]=img.data[i]+20;													//add 20 to each green pixel
			img.data[i+2]=img.data[i]+20;													//add 20 to each blue pixel
			img.data[i] = img.data[i]+40;													//add 20 to each red pixel
			img.data[i+3]=img.data[i+3];
		}
	}else if (filter==='invert'){
		for(var i = 0; i<img.data.length; i+=4){											//Get the inverse of an image
			img.data[i] = 255-img.data[i];													//Subtract 255(Max pixel value) from each red, green, and blue pixels
			img.data[i+1]=255-img.data[i+1];
			img.data[i+2]=255-img.data[i+2];
			img.data[i+3]=img.data[i+3];													//Keep image alpha value as it is.
		}
	}
	

	var imgData = ctx.createImageData(canvas.width,canvas.width);							// Create imaData var with the original size of the filter image			
	imgData.data.set(img.data);																// Set the imgData data to the processed data from the filters function	
	ctx.putImageData(imgData, 0, 0);														// Draw or show the filter image data
}


$('button.filter').click(function(){														// (Event listener and handler) Function response to click event of a button with filter class
	var thisLongId = $(this).attr('id');													// Get the id of the pressed button
	// console.log(thisLongId);
	var filterName = thisLongId.replace('Button', '');										// Get the id and remove Button word
	// console.log(filterName)
	var id = '#'+ filterName;																// Add # to the id name
	var canvas = document.getElementById(filterName);
	var ctx = canvas.getContext('2d');														// Get the canvas element associated with this button id 
	ApplyFilter(filterName, ctx, canvas);													// Invoke ApplyFilter function with filterName, ctx, and canvas of the filter id
});

$('button.convolution').click(function(){													// (Event listener and handler) function response to button element with .convolution class 
	var thisLongId = $(this).attr('id');													// Get the id of this button assign it to thisLongId var 
	// console.log(thisLongId);
	var filterName = thisLongId.replace('Button', '');										// remove the button work from thisLongId var and assign it to filterName var
	// console.log(filterName)
	var id = '#'+ filterName;																// add # to filter name and assign it to id var
	var canvas = document.getElementById(filterName);										// get the canvas element of the filter
	var ctx = canvas.getContext('2d');														// get the context of this canvas
	ctx.drawImage(image,0,0, canvas.width, canvas.height);									// Draw the main selected image in this ctx
	var img = ctx.getImageData(0,0,canvas.width, canvas.height); 							// Get the image data from ctx and assign them in to img var
	if(filterName==='highpass'){															// If filtername === highpass, then create a kernal with high pass filter values
		var kernel = [-1, -1, -1,
                  -1,  8, -1,
                  -1, -1, -1];
	} else if(filterName==='gaussian3'){													// If filtername === gaussian3, then create a kernal with gaussian3 filter values
		var val = 16;
      	var kernel = [1/val, 2/val, 1/val,
                  	  2/val, 4/val, 2/val,
                      1/val, 2/val, 1/val];
	}else if (filterName==='gaussian5'){													// If filtername === gaussian5, then create a kernal with gaussian5 filter values
		var val = 159;
        var kernel = [2/val, 4/val, 5/val, 4/val, 2/val,
                      4/val, 9/val,12/val, 9/val, 4/val,
                      5/val,12/val,15/val,12/val, 5/val,
                      4/val, 9/val,12/val, 9/val, 4/val,
                      2/val, 4/val, 5/val, 4/val, 2/val];
	}else if (filterName==='sharpen'){														// If filtername === sharpen, then create a kernal with sharpen filter values
		var kernel = [0, -0.2, 0,
                  	  -0.2, 1.8, -0.2,
                  		0, -0.2, 0];
	}else if (filterName==='sobelY'){														// If filtername === sobelY, then create a kernal with sobelY filter values
		var val = 1;
      	var kernel = [ 1/val, 2/val, 1/val,
                  	   0, 0, 0,
                      -1/val, -2/val, -1/val ];
        // var kernel = [ 3/val, 10/val, 3/val,
        //           	   0, 0, 0,
        //               -3/val, -10/val, -3/val ];

	}else if (filterName==='sobelX'){														// If filtername === sobelX, then create a kernal with sobelX filter values
		var val = 1;
        var kernel = [ 1/val, 0, -1/val,
                  	   2/val, 0, -2/val,
                       1/val, 0, -1/val ];
        // var kernel = [ 3/val, 0, -3/val,
        //           	   10/val, 0, -10/val,
        //                3/val, 0, -3/val ];
	}else if (filterName==='laplace'){             											// If filtername === laplacian, then create a kernal with laplacian filter values
		
        var kernel = [ 0, -1, 0,
                  	  -1, 4, -1,
                      0, -1, 0 ];
        // var kernel = [ 3/val, 0, -3/val,
        //           	   10/val, 0, -10/val,
        //                3/val, 0, -3/val ];
	}

	var newPixels = convolution( img, ctx, kernel);											// Send the img, ctx and kernel to the convolution function to do signal processing in time domain (convolution). 
	img = ctx.createImageData(canvas.width, canvas.height);									// Reset the img var to hold ctx data with the canvas original size
  	arrangePlotPixels(ctx, img, newPixels);													// Send the newPixels after the convolution operation to arrangePlotPixels function for plotting
});

$('button.mag').click(function(){															// Event listener and handler to magnitude button
	var thisLongId = $(this).attr('id');													// Get the id of the button
	// console.log(thisLongId);
	var filterName = thisLongId.replace('Button', '');										// remove the Button from fitler name
	// console.log(filterName)
	var id = '#'+ filterName;																// add # to filterName and assign it to id
	var canvas = document.getElementById(filterName);										// Get the canvas by id
	var ctx = canvas.getContext('2d');														// Get the context of the canvas
	ctx.drawImage(image,0,0, canvas.width, canvas.height);									// Draw the original selected image 
	var img = ctx.getImageData(0,0,canvas.width, canvas.height); 							// Get the image data and assign them to img
	// var grayImage = ApplyGray(image, ctx, canvas);										// Apply GrayScale
	// console.log(grayImage.data)
	// for Gray Image
	// imgData = ctx.createImageData(canvas.width,canvas.width);
	// var imgData = ctx.createImageData(canvas.width,canvas.width);
	// imgData.data.set(grayImage.data);
	// ctx.putImageData(imgData, 0, 0); 
	// ctx.drawImage(image,0,0, canvas.width, canvas.height);
	// var img = ctx.getImageData(0,0,canvas.width, canvas.height); 
	// arrangePlotPixels(ctx, img, grayImage);
	// var img = ctx.getImageData(0,0,canvas.width, canvas.height); 
	var val = 159;																			// Now, is the process to get the canny edge
	val = 115;																				// set the gaussian kernal
        var gaussian = [2/val, 4/val, 5/val, 4/val, 2/val,
                      4/val, 9/val,12/val, 9/val, 4/val,
                      5/val,12/val,15/val,12/val, 5/val,
                      4/val, 9/val,12/val, 9/val, 4/val,
                      2/val, 4/val, 5/val, 4/val, 2/val];

	var newPixels = convolution( img, ctx, gaussian);										// Apply gaussian to the image, blur the image							
	var lapKer = [ 0, -1, 0,																// Set the laplacian kernel
                  	  -1, 4, -1,
                      0, -1, 0 ];

    var lapOut = convolution(newPixels, ctx, lapKer);										// Apply Laplacian to the image								
    // var img = ctx.getImageData(0,0,canvas.width, canvas.height); 
    // arrangePlotPixels(ctx, img, lapOut);              
	var val = 1;																			
	var y = [ 1/val, 2/val, 1/val,															// Set The y-direction sobel kernal
                  	   0, 0, 0,
                      -1/val, -2/val, -1/val ];
	var sobelY = convolution( newPixels, ctx, y);											// Apply the sobelY to image

	var x = [ 1/val, 0, -1/val,																// Set The x-direction sobel kernal
                  	   2/val, 0, -2/val,
                       1/val, 0, -1/val ];
    var sobelX= convolution( newPixels, ctx, x);											// Apply the sobelY to image
    var MagAng = gradient(sobelX, sobelY);													// Get the image magnitude from the sobelX, sobelY 
    var img = ctx.getImageData(0,0,canvas.width, canvas.height); 							// get image data store again into img
    arrangePlotPixels(ctx, img, MagAng.magnitude);											// Plot the image magnitude									
    var canvas1 = document.getElementById('cannyEdge');										// Get cannyEdge canvas
	var ctx1 = canvas1.getContext('2d');													// Get the context
	newPixels= nonMaxSup(lapOut, MagAng.direction, ctx1);									// perform non-maximam supression to the lapOut and with the angle of the image
	var img = ctx1.createImageData(canvas.width, canvas.height);							
	arrangePlotPixels(ctx1, img, newPixels);												// Plot the CannlyEdge image

});


var canvasThr = document.getElementById('threshold');
var ctxThr = canvasThr.getContext('2d');
$('.threshold').click(function(){
	thresholding(55, ctxThr, canvasThr);
});

