/*
arrangePlotPixels takes context of an img (image data), 
and the pixel values. 

*/

function arrangePlotPixels(ctx, img, imgPixels){
  
  var dataArr = new Uint8ClampedArray(img.data.length);                 // create 8-bit unsigned integers to store image pixel values for plotting
  
  for (var i = 0, len = dataArr.length; i < len; i+=4) {                // arrange the RGB pixel and alpha values in the image Array
    
    dataArr[i] = imgPixels.data[i];
    dataArr[i+1] = imgPixels.data[i+1];
    dataArr[i+2] = imgPixels.data[i+2];
    dataArr[i+3] = imgPixels.data[i+3];
  }

  img.data.set(dataArr);                                                //Set the Array of unsign integer to img 
  ctx.putImageData(img, 0, 0);                                          //Plot the img 
}


/*
This is time domain 2D convolution function, 
the function takes 
image: as  (pixel values)
ctx: context of the image
Kernal: as the filter function

if your kernel: [ a, b, c 
                  d, e, f
                  g, h, i]
 your image is: [ 1, 2, 3
                  4, 5, 6
                  7, 8, 9]
Then convolving kernel and image is equi. to
fliping kernel up-down and left-right
kernel:          [ i, h, g 
                  f, e, d
                  c, b, a]
and multiply and add with the image: 
newImage = (kernal (convolve with ) image)
newImage = [ a*1 1*2+b*1 a*3+b*2+c*1 b*3+c*2 c*3
             a*4+d*1 a*5+b*4+d*2+e*1 a*6+b*5+c*4+d*3+e*2+f*1  b*6+c*5+e*3+f*2 c*6+f*3
             ......
             ......
             ......
             and continue like this ]

return the pixel of the new filter image
*/
function convolution(Image,ctx, kernelFil){

	   var kerSize = Math.round(Math.sqrt(kernelFil.length));             // Get the kernel size
     var halfKerSize = Math.floor(kerSize/2);                           // Get half the kernal size
     var srcImage = Image.data;                                         // Get the image data (pixels)
     var rows = Image.width;                                            // Get the width as rows
     var columns = Image.height;                                        // Get the hieght as columns
 
     var newPixels = ctx.createImageData(rows, columns);                // Create newPixel with the original size(W, H)
     // var dataArr = new Uint8ClampedArray(newPixels.data.length);     //
                                                                        // Apply the 2D convolution by passing the kernel function over the image pixels and multiply and add
    for (var y = 0; y < columns; y++) {                                 // y: 0-columns

    	for (var x = 0; x < rows; x++) {                                  // x: 0-rows

      		var dstIndex = (y * rows + x) * 4,                            // The dstIndex, initialize and set the RGB and alpha to zeros
          	redPixel = 0,                                                  
          	greenPixel = 0,
          	bluePixel = 0,
          	alpha = 0;

      		for (var ii = 0; ii < kerSize; ii++) {                        // ii: 0 kernel size
        		for (var jj = 0; jj < kerSize; jj++) {                      // jj: 0 kernel size

          			var iiCurrent = y + ii - halfKerSize;                   // the current row of 
              	var jjCurrent = x + jj - halfKerSize;
                  
          			if (iiCurrent >= 0 &&                                   // this if condition to make sure that the convolution is done with in the size of original signal
          			    iiCurrent < columns &&
          			    jjCurrent >= 0 &&
          			    jjCurrent < rows) {

            				var srcIndex = (iiCurrent * rows + jjCurrent) * 4,  // the index of the source pixels 
                			coff = kernelFil[ii * kerSize + jj];              // the coeff of the filter kernal
                      // console.log(ii * kerSize + jj)
            				redPixel += srcImage[srcIndex] * coff;              // multiply and add for convolution
            				greenPixel += srcImage[srcIndex + 1] * coff;
            				bluePixel += srcImage[srcIndex + 2] * coff;

          			}
        		}
      		}

      		newPixels.data[dstIndex] = redPixel;                          // Arranging the (RGB pixels) data in the in the distination image data
      		newPixels.data[dstIndex+1] = greenPixel;
      		newPixels.data[dstIndex+2] = bluePixel;
      		newPixels.data[dstIndex+3] = 255;

    	}
  	}


 	return newPixels;
  
}



function nonMaxSup(Image,direction, ctx){
    var consVar = 16;     
    var kerSize = Math.round(Math.sqrt(consVar));
    var halfKerSize = Math.floor(kerSize/2);
    var srcImage = Image.data;
    var rows = Image.width;
    var columns = Image.height;
     
    var newPixels = ctx.createImageData(rows, columns);
     

    for (var y = 0; y < columns; y++) {

      for (var x = 0; x < rows; x++) {

          var dstIndex = (y * rows + x) * 4,
            redPixel = srcImage[dstIndex],
            greenPixel = srcImage[dstIndex+1],
            bluePixel = srcImage[dstIndex+2],
            alpha = srcImage[dstIndex+3];
          for (var ii = 0; ii < kerSize; ii++) {
            for (var jj = 0; jj < kerSize; jj++) {

                var iiCurrent = y + ii - halfKerSize;
                  var jjCurrent = x + jj - halfKerSize;

                if (iiCurrent >= 0 &&
                    iiCurrent < columns &&
                    jjCurrent >= 0 &&
                    jjCurrent < rows) {

                    var srcIndex = (iiCurrent * rows + jjCurrent) * 4,
                      currentAngle = Math.atan2(iiCurrent - y, jjCurrent -x);
                    
                    redPixel = srcImage[srcIndex]*Math.abs(Math.cos(direction[dstIndex]-currentAngle)) > redPixel ? 0 : redPixel;
                    greenPixel = srcImage[srcIndex+1]*Math.abs(Math.cos(direction[dstIndex+1]-currentAngle)) > greenPixel ? 0 : greenPixel;
                    bluePixel = srcImage[srcIndex+2]*Math.abs(Math.cos(direction[dstIndex+2]-currentAngle)) > bluePixel ? 0 : bluePixel;
                  }
             }
          }

          newPixels.data[dstIndex] = redPixel *2;
          newPixels.data[dstIndex+1] = greenPixel *2;
          newPixels.data[dstIndex+2] = bluePixel *2;
          newPixels.data[dstIndex+3] = 255;
        }
    }
    return newPixels;
}

/*
The gradient function takes the derivative of an image in
X-direction and Y-direction 
and return the magnitude and direction (angle )
Magnitude is equal to 
Magnitude(i) = sqrt((x(i)^2 + y(i)^2)) where i is the index of each point
Angle(i) = atan(y(i) / x(i))

*/

function gradient(imgX, imgY){
  var dataX = imgX.data;
  var dataY = imgY.data;
  var rows = imgX.width;
  var columns = imgX.height;

  var temImage = document.createElement('canvas');
  var ctx = temImage.getContext('2d');
  var gradientData = ctx.createImageData(rows, columns);
  
  var directionData = new Array(dataX.length).fill(0);
  for (var y = 0; y < rows; y++) {
      for (var x = 0; x < rows; x++) {
        var dstIndex = (y * rows + x) * 4
        gradientData.data[dstIndex] = Math.sqrt(Math.pow(dataX[dstIndex], 2) +  Math.pow(dataY[dstIndex], 2));
        gradientData.data[dstIndex+1] = Math.sqrt(Math.pow(dataX[dstIndex+1], 2) +  Math.pow(dataY[dstIndex+1], 2));
        gradientData.data[dstIndex+2] = Math.sqrt(Math.pow(dataX[dstIndex+2], 2) +  Math.pow(dataY[dstIndex+2], 2));
        gradientData.data[dstIndex+3] = 255;

        directionData[dstIndex] = Math.atan2(dataY[dstIndex], dataX[dstIndex]);
        directionData[dstIndex+1] = Math.atan2(dataY[dstIndex+1], dataX[dstIndex+1]);
        directionData[dstIndex+2] = Math.atan2(dataY[dstIndex+2], dataX[dstIndex+2]);
        directionData[dstIndex+3] = 255;
      }
  }

  result = {magnitude: gradientData, direction: directionData};
  return result;
}

