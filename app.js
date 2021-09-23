"use strict";
//VARIABLES GLOBALES
let canvas = document.getElementById("canvas");//regresa el nodo DOM para el elemento <canvas>
let ctx = canvas.getContext('2d');//acceder al contexto de dibujo 
let rect=canvas.getBoundingClientRect();// devuelve el tamaño del canvas y su posición relativa respecto a la ventana de visualización 
let x=0;
let y=0;
let dibujando = false;
let cursor=document.getElementById("cursor");
let color=document.getElementById("color");
let goma = document.getElementById("goma");
let limpiar = document.getElementById("clear");
let lapiz = document.getElementById("lapiz");
let blanco = "#ffffff";
let file = document.getElementById('cargarImg');
var img = new Image();
let downloadBtn=document.getElementById("download");

window.onload = function() {
    
    file.addEventListener('change', handleFiles, false);
    
    // establecer las dimensiones originales del lienzo como máximo
  
    canvas.dataMaxWidth = canvas.width;
    canvas.dataMaxHeight = canvas.height;
}

function handleFiles(e) {
    
    let reader  = new FileReader();
    let file = e.target.files[0];
    // cargar a la imagen para obtener su ancho / alto
    
    img.onload = function() {
        // configurar dimensiones escaladas
        let scaled = getScaledDim(img, ctx.canvas.dataMaxWidth, ctx.canvas.dataMaxHeight);
        // escalar lienzo a imagen
        ctx.canvas.width = scaled.width;
        ctx.canvas.height = scaled.height;
        // draw image
        ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
    }
    // esto es para configurar la carga de la imagen
    reader.onloadend = function () {
        img.src = reader.result;
    }
    // esto es para leer el archivo
    reader.readAsDataURL(file);
}

// devuelve el objeto de dimensiones escaladas
function getScaledDim(img, maxWidth, maxHeight) {
    let scaled = {
        width: img.width,
        height: img.height
    }
    
    if (scaled.width > maxWidth) {
         maxWidth = scaled.width;
     
    }
    if (scaled.height > maxHeight) {
        scaled.height=maxHeight;    
    }
    return scaled;
}

  
canvas.addEventListener('mousedown', function(evento){
    
    x=evento.clientX - rect.left;
    y=evento.clientY - rect.top;
    dibujando=true;
    
})

canvas.addEventListener('mousemove', function(evento){
    //deberia ir un control para controlar que cuando se siga presionando el mouse fuera del canvas no siga dibujando
    if(dibujando===true){
        let x2=evento.clientX - rect.left;
        let y2=evento.clientY -rect.top;
        dibujarLinea(x,y,x2,y2);
        x=x2;
        y=y2;
    }  

});
canvas.addEventListener('mouseup', function(evento){
    if(dibujando===true){
        let x2=evento.clientX - rect.left;
        let y2=evento.clienty -rect.top;
        dibujarLinea(x,y,x2,y2);
        x=0;
        y=0;
        dibujando=false;
    }
});

function cambiarColor(c){
    color=c.value; 
   
}

limpiar.addEventListener('click', clear);

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("cargarImg").value = "";
  }


lapiz.addEventListener('click', usarLapiz);

function usarLapiz(){
    color = document.getElementById('color').value;
}

goma.addEventListener('click', borrar);

function borrar(){
    color = blanco;
  
}

function anchoCursor(ancho){
    cursor = ancho.value;
    document.getElementById("valor").innerHTML=ancho.value;
}


function dibujarLinea(x1,y1,x2,y2){
    ctx.beginPath();
    ctx.lineCap = 'round';//trazo circular
    ctx.strokeStyle=color;
    ctx.lineWidth=cursor;
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
    ctx.closePath();
}

//FILTROS se deben aplicar a la imagen original?

function getRed(imageData, x, y) {
    let index = (x + y * imageData.width) * 4;
    return imageData.data[index+0];
}
function getGreen(imageData, x, y) {
    let index = (x + y * imageData.width) * 4;
    return imageData.data[index+1];
}
function getBlue(imageData, x, y) {
    let index = (x + y * imageData.width) * 4;
    return imageData.data[index+2];
}

function binarieFilter() {
    var imgObj = document.getElementById('canvas');
     
    var imgW = imgObj.width;
    var imgH = imgObj.height;
    var breakPoint= 127;
     
    ctx.drawImage(imgObj, 0, 0);
    var imgPixels = ctx.getImageData(0, 0, imgW, imgH);
     
    for(var y = 0; y < imgPixels.height; y++){
        for(var x = 0; x < imgPixels.width; x++){
            var i = (y * 4) * imgPixels.width + x * 4;
            var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
            if(avg>breakPoint){
                imgPixels.data[i] = 255; 
                imgPixels.data[i + 1] = 255; 
                imgPixels.data[i + 2] = 255;
            }else{
                imgPixels.data[i] = 0; 
                imgPixels.data[i + 1] = 0; 
                imgPixels.data[i + 2] = 0;
            }
        }
    }
    ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
}
function brightFilter(bright) {
    var imgObj = document.getElementById('canvas');
     
    var imgW = imgObj.width;
    var imgH = imgObj.height;
     
    ctx.drawImage(imgObj, 0, 0);
    var imgPixels = ctx.getImageData(0, 0, imgW, imgH);
     
    for(var y = 0; y < imgPixels.height; y++){
        for(var x = 0; x < imgPixels.width; x++){
            var i = (y * 4) * imgPixels.width + x * 4;
            if((imgPixels.data[i] +  bright)> 255)
                imgPixels.data[i] = 255; 
            else
                imgPixels.data[i] += bright; 
            if((imgPixels.data[i + 1] +  bright)> 255)
                imgPixels.data[i + 1] = 255; 
            else
                imgPixels.data[i+ 1] += bright; 
            if((imgPixels.data[i + 2] +  bright)> 255)
                imgPixels.data[i + 2] = 255; 
            else
                imgPixels.data[i + 2] += bright;
            
        }
    }
    ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
}


function negativeFilter(){
    let imageData = ctx.getImageData(0,0,canvas.width, canvas.height);//accedo a los pixeles que almacena el imageData en un array 
    let pixels = imageData.data;//contiene los datos de píxeles del objeto
    let numPixels = imageData.width * imageData.height;//total de píxeles que componen nuestra imagen (resultado de multiplicar la anchura de nuestra imagen por su altura)

for ( var i = 0; i < numPixels; i++ ) {//iterar por cada pixel y sus tres valores rgb asociados
    var r = pixels[ i * 4 ];
    var g = pixels[ i * 4 + 1 ];
    var b = pixels[ i * 4 + 2 ];

    //Cambiar cada componente de un color al valor opuesto de la escala de color.
    pixels[ i * 4 ] = 255 - r;
    pixels[ i * 4 + 1 ] = 255 - g;
    pixels[ i * 4 + 2 ] = 255 - b;
}

ctx.putImageData( imageData, 0, 0 );
  
}

function sepiaFilter(){
    let imageData = ctx.getImageData(0,0,canvas.width, canvas.height);//accedo a los pixeles que almacena el imageData en un array 
    let pixel = imageData.data;//Devuelve un objeto conteniendo todos los datos del objeto ImageData.
    let numPixels = imageData.width * imageData.height;//cantidad de pixeles que componen la imagen

for ( let i = 0; i < numPixels; i++ ) {
    let r = pixel[ i * 4 ];
    let g = pixel[ i * 4 + 1 ];
    let b = pixel[ i * 4 + 2 ];

    pixel[ i * 4 ] = 255 - r;
    pixel[ i * 4 + 1 ] = 255 - g;
    pixel[ i * 4 + 2 ] = 255 - b;

    pixel[ i * 4 ] = ( r * .393 ) + ( g *.769 ) + ( b * .189 );
    pixel[ i * 4 + 1 ] = ( r * .349 ) + ( g *.686 ) + ( b * .168 );
    pixel[ i * 4 + 2 ] = ( r * .272 ) + ( g *.534 ) + ( b * .131 );
}

ctx.putImageData( imageData, 0, 0 );//Pone los datos de la imagen (de un objeto ImageData especificado) de nuevo en el lienzo

}

function blackAndWhite() {
        let imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
        let pixels = imageData.data;
        let numPixels = imageData.width * imageData.height;
 
    for ( var i = 0; i < numPixels; i++ ) {
        let r = pixels[ i * 4 ];
        let g = pixels[ i * 4 + 1 ];
        let b = pixels[ i * 4 + 2 ];
 
        let grey = ( r + g + b ) / 3;//promedio de los valores de rgb originales
 
        pixels[ i * 4 ] = grey;
        pixels[ i * 4 + 1 ] = grey;
        pixels[ i * 4 + 2 ] = grey;
    }
 
    ctx.putImageData( imageData, 0, 0 );
};

function saturationFilter(){
    let sat = 100;
    let imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
		let x, y, index;
		for(x = 0; x < imageData.width; x++){
			for(y = 0; y < imageData.height; y++){
				let r = getRed(imageData, x, y);
				let g = getGreen(imageData, x, y);
				let b = getBlue(imageData, x, y);
				index = (x + y * imageData.width) * 4;
				let factor = (259*(sat+255))/(255*(259-sat));
				imageData.data[index+0] = factor*(r-128)+128;
				imageData.data[index+1] = factor*(g-128)+128;
				imageData.data[index+2] = factor*(b-128)+128;
			}
		}
		ctx.putImageData(imageData, 0, 0);		
}
function blurFilter() {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let r, g, b;
    for (let x = 1; x < canvas.width - 1; x++) {
        for (let y = 1; y < canvas.height - 1; y++) {
            var i = (y * 4) * imageData.width + x * 4;
            r = Math.floor((getRed(imageData, x, y) + getRed(imageData, x - 1, y) + getRed(imageData, x + 1, y) + getRed(imageData, x - 1, y + 1) + getRed(imageData, x - 1, y - 1) + getRed(imageData, x, y + 1) + getRed(imageData, x, y - 1) + getRed(imageData, x + 1, y + 1) + getRed(imageData, x + 1, y - 1)) / 9);
            g = Math.floor((getGreen(imageData, x, y) + getGreen(imageData, x - 1, y) + getGreen(imageData, x + 1, y) + getGreen(imageData, x - 1, y + 1) + getGreen(imageData, x - 1, y - 1) + getGreen(imageData, x, y + 1) + getGreen(imageData, x, y - 1) + getGreen(imageData, x + 1, y + 1) + getGreen(imageData, x + 1, y - 1)) / 9);
            b = Math.floor((getBlue(imageData, x, y) + getBlue(imageData, x - 1, y) + getBlue(imageData, x + 1, y) + getBlue(imageData, x - 1, y + 1) + getBlue(imageData, x - 1, y - 1) + getBlue(imageData, x, y + 1) + getBlue(imageData, x, y - 1) + getBlue(imageData, x + 1, y + 1) + getBlue(imageData, x + 1, y - 1)) / 9);
            imageData.data[i]=r;
            imageData.data[i+1]=g;
            imageData.data[i+2]=b;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

downloadBtn.addEventListener('click', function(){
    var a=document.createElement("a");
    document.body.appendChild(a)
    a.href=canvas.toDataURL("image/jpeg");
    a.download="mi-dibujito.jpg";
    a.click();
    document.body.removeChild(a);

});