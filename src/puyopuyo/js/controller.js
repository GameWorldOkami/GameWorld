document.body.onkeydown = function( e ) {
  // キーに名前をセットする
  var keys = {
    37: 'left',
    39: 'right',
    40: 'rotated_right',
    38: 'rotate_left'
  };

  if ( typeof keys[ e.keyCode ] != 'undefined' ) {
    // セットされたキーの場合はtetris.jsに記述された処理を呼び出す
    keyPress( keys[ e.keyCode ] );
    // 描画処理を行う
    render();
  }
};


function keyPress( key ) {
  if (glb_blockset.control_en == 1)
  {
    switch ( key ) {
    case 'left':
      var ret = glb_blockset.moveLeft();
      if (glb_stackedblock.isCollision(ret)){
        glb_blockset.cancelOperation();
      }
      break;
    case 'right':
      var ret = glb_blockset.moveRight();
      if (glb_stackedblock.isCollision(ret)){
        glb_blockset.cancelOperation();
      }
      break;
    case 'rotated_right':
      var ret = glb_blockset.moveDown();
      if (glb_stackedblock.isCollision(ret)){
        glb_blockset.cancelOperation();
      }
      break;
    case 'rotate_left':
      var ret = glb_blockset.rotateRight();
      if (glb_stackedblock.isCollision(ret)){
        glb_blockset.cancelOperation();
      }
      break;
    }
  }
}


