"use strict";
var canvas=document.getElementById("canvas");
var ctx=canvas.getContext('2d');
var rect=canvas.getBoundingClientRect();
var x=0;
var y=0;
var dibujando= false;
var cursor=document.getElementById("cursor");
var color=document.getElementById("color");

canvas.addEventListener('mousedown', function(evento){
    x=evento.clientX -rect.left;
    y=evento.clientY -rect.top;
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

