document.body.onkeydown = function( e ) {
  // �L�[�ɖ��O���Z�b�g����
  var keys = {
    37: 'left',
    39: 'right',
    40: 'rotated_right',
    38: 'rotate_left'
  };

  if ( typeof keys[ e.keyCode ] != 'undefined' ) {
    // �Z�b�g���ꂽ�L�[�̏ꍇ��tetris.js�ɋL�q���ꂽ�������Ăяo��
    keyPress( keys[ e.keyCode ] );
    // �`�揈�����s��
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


