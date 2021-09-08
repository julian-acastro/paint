"use strict";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');
ctx.lineCap = 'round';//trazo circular
var rect=canvas.getBoundingClientRect();
var x=0;
var y=0;
var dibujando = false;
var cursor=document.getElementById("cursor");
var color=document.getElementById("color");
let goma = document.getElementById("goma");
let blanco = "#ffffff";


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
    color=c; 
}

function borrar(){
    color = blanco;
}
function tamañoCursor(tamaño){
    cursor=tamaño;
}

function dibujarLinea(x1,y1,x2,y2){
    ctx.beginPath();
    ctx.strokeStyle=color;
    ctx.lineWidth=cursor;
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
    ctx.closePath();
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
    return canvas.toDataURL();
}