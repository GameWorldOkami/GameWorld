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

function rotate_left( current ) {
  var newCurrent = [];
  for ( var y = 0; y < MAX_Y; ++y ) {
    newCurrent[ y ] = [];
    for ( var x = 0; x < MAX_X; ++x ) {
      newCurrent[ y ][ x ] = current[ MAX_X -1 - x ][ y ];
    }
  }
  return newCurrent;
}

function rotate_right( current ) {
  var newCurrent = [];
  for ( var y = 0; y < MAX_Y; ++y ) {
    newCurrent[ y ] = [];
    for ( var x = 0; x < MAX_X; ++x ) {
      newCurrent[ y ][ x ] = current[ x ][ y ];
    }
  }
  return newCurrent;
}

function keyPress( key ) {
  switch ( key ) {
  case 'left':
    if ( valid( -1 ) ) {
      --currentX;  // ���Ɉ���炷
    }
    break;
  case 'right':
    if ( valid( 1 ) ) {
      ++currentX;  // �E�Ɉ���炷
    }
    break;
  case 'rotated_right':
    if ( valid( 0, 1 ) ) {
      ++currentY;  // ���Ɉ���炷
    }
    break;
  case 'rotate_left':
    // ����u���b�N����
    var rotated = rotate_left( current );
    if ( valid( 0, 0, rotated ) ) {
      current = rotated;  // �񂹂�ꍇ�͉񂵂����Ƃ̏�Ԃɑ���u���b�N���Z�b�g����
    }
    break;
  }
}


