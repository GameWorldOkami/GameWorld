
var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d');
var W = 300, H = 600;
var BLOCK_W = W / COLS, BLOCK_H = H / ROWS;
var current_list = [];

function drawBlock(x,y){
    ctx.fillRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
    ctx.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
}

function render(){
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle='black';
    
    var ret = glb_blockset.getGrobalList();
    for (var i of ret)
    {
        ctx.fillStyle = colors[i.id];
        drawBlock(i.local_x-1,i.local_y-1);
    }
    ret = glb_stackedblock.getGrobalList();
    for (var i of ret)
    {
        ctx.fillStyle = colors[i.id];
        drawBlock(i.local_x-1,i.local_y-1);
    }
}


function renderAll(){

}

setInterval(render,30);


