"use strict";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');
let rect=canvas.getBoundingClientRect();

/******************************************************************************************************* */

//funcionalidad que descarga en formato jpg el contenido del canvas
let downloadBtn=document.getElementById("download");
downloadBtn.addEventListener('click', function(){
    //crea un link de descarga y lo ejecuta
    let a=document.createElement("a");
    document.body.appendChild(a);
    a.href=canvas.toDataURL("image/jpeg");
    a.download="mi-dibujito.jpg";
    a.click();
    document.body.removeChild(a);

});

/******************************************************************************************************* */

let file = document.getElementById('upload');
let img = new Image();

window.onload = function() {
    file.addEventListener('change', handleFiles, false);
    
    // establece las dimensiones originales del lienzo como máximo
    canvas.dataMaxWidth = canvas.width;
    canvas.dataMaxHeight = canvas.height;
}

function handleFiles(e) {
    
    let reader  = new FileReader();
    let file = e.target.files[0];
    
    
    img.onload = function() {
        // configurar dimensiones
        let scaled = getScaledDim(img, ctx.canvas.dataMaxWidth, ctx.canvas.dataMaxHeight);
        // escalar lienzo a imagen
        ctx.canvas.width = scaled.width;
        ctx.canvas.height = scaled.height;
        // dibuja la imagen
        ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
    }
    // esto es para configurar la carga de la imagen
    reader.onloadend = function () {
        img.src = reader.result;
    }
    // esto es para leer el archivo
    reader.readAsDataURL(file);
}

//Funcion que se encarga de volver a dibujar la imagen original en el lienzo cuando quitamos un filtro
function reloadImg(){
    ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);  
}

//Esta funcion escala las dimenciones de la imagen al lienzo de forma que no se deforme la imagen
function getScaledDim(img, maxWidth, maxHeight) {
    let scaled = {
        width: img.width,
        height: img.height
    }
    
    if (scaled.height > maxHeight) {      
        if (scaled.width > maxWidth) {

        scaled.width = (scaled.width * maxHeight) / scaled.height; 
        scaled.height=maxHeight;
    }
    else{
        scaled.width = (scaled.width * maxHeight) / scaled.height; 
        scaled.height=maxHeight;
    }
}
    return scaled;
}

/******************************************************************************************************* */ 

let x=0;
let y=0;
let drawing = false;

//Funcion que esta al pendiente de click dentro del canvas
canvas.addEventListener('mousedown', function(evento){
    rect=canvas.getBoundingClientRect();
    x=evento.clientX - rect.left;
    y=evento.clientY - rect.top;
    drawing=true;
})

//Funcion que me asegura que solamente dibuje dentro del canvas, incluso cuando me vaya fuera de este con el boton apretado
canvas.addEventListener('mouseleave', function() {
   drawing=false; 
});

//Funcion que dibuja dentro del contexto mientras Drawing sea verdadero
canvas.addEventListener('mousemove', function(evento){
    rect=canvas.getBoundingClientRect();
    if(drawing===true){ 
        let x2=evento.clientX - rect.left;
        let y2=evento.clientY -rect.top;
        drawLine(x,y,x2,y2);
        x=x2;
        y=y2;       
    }  
});

//Funcion que esta al pendiente de que el click del mouse deje de estar precionado para detener el dibujo
canvas.addEventListener('mouseup', function(evento){
    rect=canvas.getBoundingClientRect();
    if(drawing===true){
        let x2=evento.clientX - rect.left;
        let y2=evento.clienty -rect.top;
        drawLine(x,y,x2,y2);
        x=0;
        y=0;
        drawing=false;
    }
});

/******************************************************************************************************* */

//Cambia el valor del color del cursor
let color=document.getElementById("color");
function changeColor(c){
    color=c.value; 
}

//Limpia el contexto, devolviendole las dimensiones originales del canvas.
//Cambiamos el valor del file cargado a vacio, para poder volver a cargar la misma imagen.
//al limpiar el lienzo y restructurarlo reseteamos tambien la imagen
let clear = document.getElementById("clear");
clear.addEventListener('click',cleanUp);
function cleanUp() {
    ctx.canvas.width = 500;
    ctx.canvas.height = 500;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("upload").value = "";  
    img = new Image();
}

//El color del cursor se vuelve el valor previamente elegido por el usuario
let pencil = document.getElementById("pencil");
pencil.addEventListener('click', usePencil);
function usePencil(){
    color = document.getElementById('color').value;
}

//El color del cursor se vuelve blanco para funcionar como una goma de borrar
let white = "#ffffff";
let rubber = document.getElementById("rubber");
rubber.addEventListener('click', erase);
function erase(){
    color = white;  
}

//Toma el valor del ancho del cursor, y a su vez cambia el contenido html del elemento range
let cursor=document.getElementById("cursor");
function lineWidth(wide){
    cursor = wide.value;
    document.getElementById("value").innerHTML = wide.value;
}

//Funcion que crea una secuencia de circulos entre 2 puntos de la pantalla
function drawLine(x1,y1,x2,y2){
    ctx.beginPath();
    ctx.lineCap = 'round';//trazo circular
    ctx.strokeStyle=color;
    ctx.lineWidth=cursor;
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
    ctx.closePath();
}

/******************************************************************************************************* */

//Funciones que permiten acceder a los componentes R G B de cada pixel
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
    
    let imgObj = document.getElementById('canvas');
     
    let imgW = imgObj.width;
    let imgH = imgObj.height;
    let breakPoint= 127;
     
    ctx.drawImage(imgObj, 0, 0);
    let imgPixels = ctx.getImageData(0, 0, imgW, imgH);
     
    for(let y = 0; y < imgPixels.height; y++){
        for(let x = 0; x < imgPixels.width; x++){
            let i = (y * 4) * imgPixels.width + x * 4;
            let avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
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
    let imgObj = document.getElementById('canvas');
     
    let imgW = imgObj.width;
    let imgH = imgObj.height;
     
    ctx.drawImage(imgObj, 0, 0);
    let imgPixels = ctx.getImageData(0, 0, imgW, imgH);
     
    for(let y = 0; y < imgPixels.height; y++){
        for(let x = 0; x < imgPixels.width; x++){
            let i = (y * 4) * imgPixels.width + x * 4;
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

for ( let i = 0; i < numPixels; i++ ) {//iterar por cada pixel y sus tres valores rgb asociados
    let r = pixels[ i * 4 ];
    let g = pixels[ i * 4 + 1 ];
    let b = pixels[ i * 4 + 2 ];

    //Cambiar cada componente de un color al valor opuesto de la escala de color.
    pixels[ i * 4 ] = 255 - r;
    pixels[ i * 4 + 1 ] = 255 - g;
    pixels[ i * 4 + 2 ] = 255 - b;
}

ctx.putImageData( imageData, 0, 0 );//Vuelve a redibujar la imagen volcando los nuevos píxeles ya modificados. 
  
}

function sepiaFilter(){
    let imageData = ctx.getImageData(0,0,canvas.width, canvas.height); 
    let pixel = imageData.data;
    let numPixels = imageData.width * imageData.height;

for ( let i = 0; i < numPixels; i++ ) {
    let r = pixel[ i * 4 ];
    let g = pixel[ i * 4 + 1 ];
    let b = pixel[ i * 4 + 2 ];

    pixel[ i * 4 ] = 255 - r;
    pixel[ i * 4 + 1 ] = 255 - g;
    pixel[ i * 4 + 2 ] = 255 - b;

    //cada color de píxel se transforma de la siguiente manera, utilizando este algoritmo
    pixel[ i * 4 ] = ( r * .393 ) + ( g *.769 ) + ( b * .189 );
    pixel[ i * 4 + 1 ] = ( r * .349 ) + ( g *.686 ) + ( b * .168 );
    pixel[ i * 4 + 2 ] = ( r * .272 ) + ( g *.534 ) + ( b * .131 );
}

ctx.putImageData(imageData, 0, 0 );

}

function blackAndWhite() {
   
        let imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
        let pixels = imageData.data;
        let numPixels = imageData.width * imageData.height;
 
    for ( let i = 0; i < numPixels; i++ ) {
        let r = pixels[ i * 4 ];
        let g = pixels[ i * 4 + 1 ];
        let b = pixels[ i * 4 + 2 ];
 
        let grey = ( r + g + b ) / 3;//promedio de los valores de R G B originales
        
        //cada color de píxel se transforma en el gris, resultado del promedio de los valoes R G B originlaes de cada pixel
        pixels[ i * 4 ] = grey;
        pixels[ i * 4 + 1 ] = grey;
        pixels[ i * 4 + 2 ] = grey;
    }
 
    ctx.putImageData( imageData, 0, 0 );
};


//El algoritmo se compone de dos pasos: calculo del factor a partir de un valor dado(sat).
//Cálculo del valor de cada pixel tras aplicar el factor anterior.
function saturationFilter(){
    let sat = 100;
    
    let imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
    let pixels = imageData.data;
    let numPixels = imageData.width * imageData.height;

    for ( let i = 0; i < numPixels; i++ ) {
        let r = pixels[ i * 4 ];
        let g = pixels[ i * 4 + 1 ];
        let b = pixels[ i * 4 + 2 ];
        let factor = (259*(sat+255))/(255*(259-sat));
				
        pixels[ i * 4 ] = factor*(r-128)+128;
		pixels[ i * 4 + 1 ] = factor*(g-128)+128;
		pixels[ i * 4 + 2 ] = factor*(b-128)+128;
	}
		
		ctx.putImageData(imageData, 0, 0);		
}
function blurFilter() {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let r, g, b;
    for (let x = 1; x < canvas.width - 1; x++) {
        for (let y = 1; y < canvas.height - 1; y++) {
            let i = (y * 4) * imageData.width + x * 4;
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

