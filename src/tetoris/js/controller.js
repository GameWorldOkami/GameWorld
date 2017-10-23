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
      --currentX;  // 左に一つずらす
    }
    break;
  case 'right':
    if ( valid( 1 ) ) {
      ++currentX;  // 右に一つずらす
    }
    break;
  case 'rotated_right':
    if ( valid( 0, 1 ) ) {
      ++currentY;  // 下に一つずらす
    }
    break;
  case 'rotate_left':
    // 操作ブロックを回す
    var rotated = rotate_left( current );
    if ( valid( 0, 0, rotated ) ) {
      current = rotated;  // 回せる場合は回したあとの状態に操作ブロックをセットする
    }
    break;
  }
}


