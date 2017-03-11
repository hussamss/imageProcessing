function arrangePlotPixels(ctx, img, imgPixels){
  
  var dataArr = new Uint8ClampedArray(img.data.length);
  var counter=0;
  for (var i = 0, len = dataArr.length; i < len; i+=4) {
    counter++;
    dataArr[i] = imgPixels.data[i];
    dataArr[i+1] = imgPixels.data[i+1];
    dataArr[i+2] = imgPixels.data[i+2];
    dataArr[i+3] = imgPixels.data[i+3];
  }

  img.data.set(dataArr);
  ctx.putImageData(img, 0, 0);
}

function convolution(Image,ctx, kernelFil){

	   var kerSize = Math.round(Math.sqrt(kernelFil.length));
     var halfKerSize = Math.floor(kerSize/2);
     var srcImage = Image.data;
     var rows = Image.width;
     var columns = Image.height;
 
     var newPixels = ctx.createImageData(rows, columns);
     var dataArr = new Uint8ClampedArray(newPixels.data.length);

    for (var y = 0; y < columns; y++) {

    	for (var x = 0; x < rows; x++) {

      		var dstOff = (y * rows + x) * 4,
          	redPixel = 0,
          	greenPixel = 0,
          	bluePixel = 0,
          	alpha = 0;

      		for (var ii = 0; ii < kerSize; ii++) {
        		for (var jj = 0; jj < kerSize; jj++) {

          			var iiCurrent = y + ii - halfKerSize;
              		var jjCurrent = x + jj - halfKerSize;

          			if (iiCurrent >= 0 &&
          			    iiCurrent < columns &&
          			    jjCurrent >= 0 &&
          			    jjCurrent < rows) {

            				var offset = (iiCurrent * rows + jjCurrent) * 4,
                			coff = kernelFil[ii * kerSize + jj];

            				redPixel += srcImage[offset] * coff;
            				greenPixel += srcImage[offset + 1] * coff;
            				bluePixel += srcImage[offset + 2] * coff;
          			}
        		}
      		}

      		newPixels.data[dstOff] = redPixel;
      		newPixels.data[dstOff+1] = greenPixel;
      		newPixels.data[dstOff+2] = bluePixel;
      		newPixels.data[dstOff+3] = 255;

    	}
  	}

  	var counter = 0;
  	var len;
	for (var i = 0, len = dataArr.length; i < len; i+=4) {
		counter++;
		dataArr[i] = newPixels.data[i];
		dataArr[i+1] = newPixels.data[i+1];
		dataArr[i+2] = newPixels.data[i+2];
		dataArr[i+3] = newPixels.data[i+3];
	}
	
	// var img = ctx.createImageData(rows,columns);
 //  arrangePlotPixels(ctx, img, newPixels);
 	return newPixels;
  
}



function nonMaxSup(Image,direction, ctx){
    var consVar = 25; 
    var kerSize = Math.round(Math.sqrt(consVar));
    var halfKerSize = Math.floor(kerSize/2);
    var srcImage = Image.data;
    var rows = Image.width;
    var columns = Image.height;
     
    var newPixels = ctx.createImageData(rows, columns);
     

    for (var y = 0; y < columns; y++) {

      for (var x = 0; x < rows; x++) {

          var dstOff = (y * rows + x) * 4,
            redPixel = srcImage[dstOff],
            greenPixel = srcImage[dstOff+1],
            bluePixel = srcImage[dstOff+2],
            alpha = srcImage[dstOff+3];
          for (var ii = 0; ii < kerSize; ii++) {
            for (var jj = 0; jj < kerSize; jj++) {

                var iiCurrent = y + ii - halfKerSize;
                  var jjCurrent = x + jj - halfKerSize;

                if (iiCurrent >= 0 &&
                    iiCurrent < columns &&
                    jjCurrent >= 0 &&
                    jjCurrent < rows) {

                    var offset = (iiCurrent * rows + jjCurrent) * 4,
                      currentAngle = Math.atan2(iiCurrent - y, jjCurrent -x);
                    
                    redPixel = srcImage[offset]*Math.abs(Math.cos(direction[dstOff]-currentAngle)) > redPixel ? 0 : redPixel;
                    greenPixel = srcImage[offset+1]*Math.abs(Math.cos(direction[dstOff+1]-currentAngle)) > greenPixel ? 0 : greenPixel;
                    bluePixel = srcImage[offset+2]*Math.abs(Math.cos(direction[dstOff+2]-currentAngle)) > bluePixel ? 0 : bluePixel;
                  }
             }
          }

          newPixels.data[dstOff] = redPixel *2;
          newPixels.data[dstOff+1] = greenPixel *2;
          newPixels.data[dstOff+2] = bluePixel *2;
          newPixels.data[dstOff+3] = 255;
        }
    }
    return newPixels;
}

function gradient(imgX, imgY){
  var dataX = imgX.data;
  var dataY = imgY.data;
  var rows = imgX.width;
  var columns = imgX.height;

  var temImage = document.createElement('canvas');
  var ctx = temImage.getContext('2d');
  var gradientData = ctx.createImageData(rows, columns);
  // var dataArr = new Uint8ClampedArray(gradientData.data.length);
  var directionData = new Array(dataX.length).fill(0);
  for (var y = 0; y < rows; y++) {
      for (var x = 0; x < rows; x++) {
        var dstOff = (y * rows + x) * 4
        gradientData.data[dstOff] = Math.sqrt(Math.pow(dataX[dstOff], 2) +  Math.pow(dataY[dstOff], 2));
        gradientData.data[dstOff+1] = Math.sqrt(Math.pow(dataX[dstOff+1], 2) +  Math.pow(dataY[dstOff+1], 2));
        gradientData.data[dstOff+2] = Math.sqrt(Math.pow(dataX[dstOff+2], 2) +  Math.pow(dataY[dstOff+2], 2));
        gradientData.data[dstOff+3] = 255;

        directionData[dstOff] = Math.atan2(dataY[dstOff], dataX[dstOff]);
        directionData[dstOff+1] = Math.atan2(dataY[dstOff+1], dataX[dstOff+1]);
        directionData[dstOff+2] = Math.atan2(dataY[dstOff+2], dataX[dstOff+2]);
        directionData[dstOff+3] = 255;
      }
  }

  result = {magnitude: gradientData, direction: directionData};
  return result;
}

