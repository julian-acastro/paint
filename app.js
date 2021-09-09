"use strict";
//VARIABLES GLOBALES
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');
let rect=canvas.getBoundingClientRect();//devuelve la posicion del lienzo con respecto a la pantalla
let x=canvas.clientX;//coordenadas de inicio del canvas
let y=canvas.clientY;//coordenadas de inicio del canvas
let dibujando = false;//cuando ha dado click y cuando lo ha soltado
let cursor=document.getElementById("cursor");
let color=document.getElementById("color");
let goma = document.getElementById("goma");
let limpiar = document.getElementById("clear");
let lapiz = document.getElementById("lapiz");
let blanco = "#ffffff";
let file = document.getElementById('imageFile');

canvas.addEventListener('mousedown', function(evento){
    x=evento.clientX - rect.left;
    y=evento.clientY - rect.top;
    dibujando=true;
})

canvas.addEventListener('mousemove', function(evento){
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



//FILTROS
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