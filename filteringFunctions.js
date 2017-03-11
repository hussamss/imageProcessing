// var image = document.getElementById('img')



function thresholding(value, ctx, canvas) {
	ctx.drawImage(image,0,0, canvas.width, canvas.height);
	var img = ctx.getImageData(0,0,canvas.width, canvas.height);

  	for (var i = 0; i < img.data.length; i += 4) {
    	var p = 0.2126*img.data[i] + 0.7152*img.data[i+1] + 0.0722*img.data[i+2];
    	var thr = value || 128;
    	img.data[i] = img.data[i+1] = img.data[i+2] = thr > p ? 0 : 255;
  }
 	
  	imgData = ctx.createImageData(canvas.width,canvas.width);
	imgData.data.set(img.data);
	ctx.putImageData(imgData, 0, 0);
};

function ApplyGray(image, ctx, canvas){
	ctx.drawImage(image,0,0, canvas.width, canvas.height);
	var img = ctx.getImageData(0,0,canvas.width, canvas.height);
	for(var i = 0; i<img.data.length; i+=4){
			img.data[i] = 0.2126*img.data[i] + 0.7152*img.data[i+1]+ 0.0722*img.data[i+2];
			// img.data[i] = 0.333*img.data[i] + 0.333*img.data[i+1]+ 0.333*img.data[i+2];
			img.data[i+1]=img.data[i];
			img.data[i+2]=img.data[i];
			img.data[i+3]=img.data[i+3];
		}



  return img;
}

function ApplyFilter(filter, ctx, canvas){
	// console.log('in ApplyFilter')
	ctx.drawImage(image,0,0, canvas.width, canvas.height);
	var img = ctx.getImageData(0,0,canvas.width, canvas.height);

	if(filter==='red'){
		for(var i = 0; i<img.data.length; i+=4){
			img.data[i] = img.data[i];
			img.data[i+1]=0;
			img.data[i+2]=0;
			img.data[i+3]=img.data[i+3];
		}
	} else if (filter==='blue'){
		for(var i = 0; i<img.data.length; i+=4){
			img.data[i] = 0;
			img.data[i+1]=0;
			img.data[i+2]=img.data[i+2];
			img.data[i+3]=img.data[i+3];
		}
	} else if (filter==='green'){
		for(var i = 0; i<img.data.length; i+=4){
			img.data[i] = 0;
			img.data[i+1]=img.data[i+1];
			img.data[i+2]=0;
			img.data[i+3]=img.data[i+3];
		}
	} else if (filter==='gray'){
		for(var i = 0; i<img.data.length; i+=4){
			img.data[i] = 0.2126*img.data[i] + 0.7152*img.data[i+1]+ 0.0722*img.data[i+2];
			// img.data[i] = 0.333*img.data[i] + 0.333*img.data[i+1]+ 0.333*img.data[i+2];
			img.data[i+1]=img.data[i];
			img.data[i+2]=img.data[i];
			img.data[i+3]=img.data[i+3];
		}
	} else if (filter==='sepia'){
		for(var i = 0; i<img.data.length; i+=4){
			img.data[i] = 0.3*img.data[i] + 0.59*img.data[i+1]+ 0.11*img.data[i+2];
			img.data[i+1]=img.data[i]+20;
			img.data[i+2]=img.data[i]+20;
			img.data[i] = img.data[i]+40;
			img.data[i+3]=img.data[i+3];
		}
	}else if (filter==='invert'){
		for(var i = 0; i<img.data.length; i+=4){
			img.data[i] = 255-img.data[i];
			img.data[i+1]=255-img.data[i+1];
			img.data[i+2]=255-img.data[i+2];
			img.data[i+3]=img.data[i+3];
		}
	}
	

	imgData = ctx.createImageData(canvas.width,canvas.width);
	imgData.data.set(img.data);
	ctx.putImageData(imgData, 0, 0);
}


$('button.filter').click(function(){
	var thisLongId = $(this).attr('id');
	// console.log(thisLongId);
	var filterName = thisLongId.replace('Button', '');
	// console.log(filterName)
	var id = '#'+ filterName;
	var canvas = document.getElementById(filterName);
	var ctx = canvas.getContext('2d');
	ApplyFilter(filterName, ctx, canvas);
});

$('button.convolution').click(function(){
	var thisLongId = $(this).attr('id');
	// console.log(thisLongId);
	var filterName = thisLongId.replace('Button', '');
	// console.log(filterName)
	var id = '#'+ filterName;
	var canvas = document.getElementById(filterName);
	var ctx = canvas.getContext('2d');
	ctx.drawImage(image,0,0, canvas.width, canvas.height);
	var img = ctx.getImageData(0,0,canvas.width, canvas.height); 
	if(filterName==='highpass'){
		var kernel = [-1, -1, -1,
                  -1,  8, -1,
                  -1, -1, -1];
	} else if(filterName==='gaussian3'){
		var val = 16;
      	var kernel = [1/val, 2/val, 1/val,
                  	  2/val, 4/val, 2/val,
                      1/val, 2/val, 1/val];
	}else if (filterName==='gaussian5'){
		var val = 159;
        var kernel = [2/val, 4/val, 5/val, 4/val, 2/val,
                      4/val, 9/val,12/val, 9/val, 4/val,
                      5/val,12/val,15/val,12/val, 5/val,
                      4/val, 9/val,12/val, 9/val, 4/val,
                      2/val, 4/val, 5/val, 4/val, 2/val];
	}else if (filterName==='sharpen'){
		var kernel = [0, -0.2, 0,
                  	  -0.2, 1.8, -0.2,
                  		0, -0.2, 0];
	}else if (filterName==='sobelY'){
		var val = 1;
      	var kernel = [ 1/val, 2/val, 1/val,
                  	   0, 0, 0,
                      -1/val, -2/val, -1/val ];
        // var kernel = [ 3/val, 10/val, 3/val,
        //           	   0, 0, 0,
        //               -3/val, -10/val, -3/val ];

	}else if (filterName==='sobelX'){
		var val = 1;
        var kernel = [ 1/val, 0, -1/val,
                  	   2/val, 0, -2/val,
                       1/val, 0, -1/val ];
        // var kernel = [ 3/val, 0, -3/val,
        //           	   10/val, 0, -10/val,
        //                3/val, 0, -3/val ];
	}else if (filterName==='laplace'){
		
        var kernel = [ 0, -1, 0,
                  	  -1, 4, -1,
                      0, -1, 0 ];
        // var kernel = [ 3/val, 0, -3/val,
        //           	   10/val, 0, -10/val,
        //                3/val, 0, -3/val ];
	}

	var newPixels = convolution( img, ctx, kernel);
	var img = ctx.createImageData(canvas.width, canvas.height);
  	arrangePlotPixels(ctx, img, newPixels);
});

$('button.mag').click(function(){
	var thisLongId = $(this).attr('id');
	// console.log(thisLongId);
	var filterName = thisLongId.replace('Button', '');
	// console.log(filterName)
	var id = '#'+ filterName;
	var canvas = document.getElementById(filterName);
	var ctx = canvas.getContext('2d');
	ctx.drawImage(image,0,0, canvas.width, canvas.height);
	var img = ctx.getImageData(0,0,canvas.width, canvas.height); 
	var grayImage = ApplyGray(image, ctx, canvas);
	// console.log(grayImage.data)
	// for Gray Image

	// imgData = ctx.createImageData(canvas.width,canvas.width);
	// var imgData = ctx.createImageData(canvas.width,canvas.width);
	// imgData.data.set(grayImage.data);
	// ctx.putImageData(imgData, 0, 0); 


	ctx.drawImage(image,0,0, canvas.width, canvas.height);//deNow
	var img = ctx.getImageData(0,0,canvas.width, canvas.height); 
	// arrangePlotPixels(ctx, img, grayImage);

	var img = ctx.getImageData(0,0,canvas.width, canvas.height); 
	var val = 159;
	val = 115;
        var gaussian = [2/val, 4/val, 5/val, 4/val, 2/val,
                      4/val, 9/val,12/val, 9/val, 4/val,
                      5/val,12/val,15/val,12/val, 5/val,
                      4/val, 9/val,12/val, 9/val, 4/val,
                      2/val, 4/val, 5/val, 4/val, 2/val];

	var newPixels = convolution( img, ctx, gaussian);
	var lapKer = [ 0, -1, 0,
                  	  -1, 4, -1,
                      0, -1, 0 ];

    var lapOut = convolution(newPixels, ctx, lapKer);
    // var img = ctx.getImageData(0,0,canvas.width, canvas.height); 
    // arrangePlotPixels(ctx, img, lapOut);              
	var val = 1;
	var y = [ 1/val, 2/val, 1/val,
                  	   0, 0, 0,
                      -1/val, -2/val, -1/val ];
	var sobelY = convolution( newPixels, ctx, y);

	var x = [ 1/val, 0, -1/val,
                  	   2/val, 0, -2/val,
                       1/val, 0, -1/val ];
    var sobelX= convolution( newPixels, ctx, x);
    var MagAng = gradient(sobelX, sobelY);
    var img = ctx.getImageData(0,0,canvas.width, canvas.height); 
    arrangePlotPixels(ctx, img, MagAng.magnitude);
    var canvas1 = document.getElementById('cannyEdge');
	var ctx1 = canvas1.getContext('2d');
	newPixels= nonMaxSup(lapOut, MagAng.direction, ctx1);
	var img = ctx1.createImageData(canvas.width, canvas.height);
	arrangePlotPixels(ctx1, img, newPixels);

});


var canvasThr = document.getElementById('threshold');
var ctxThr = canvasThr.getContext('2d');
$('.threshold').click(function(){
	thresholding(55, ctxThr, canvasThr);
});

