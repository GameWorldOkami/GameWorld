/*------------------------------------------------------------------
■定義
--------------------------------------------------------------------*/
var COLS = 10, ROWS = 20 //横10、縦20マス
var board = []; //盤面情報.
var lose; //ゲームオーバー判定フラグ.
var interval; // タイマ保持変数.
var current; // 現在操作中のブロック形状.
var currentX, currentY; // 現在操作中のブロック位置.
var MAX_Y =4; // 操作可能幅.
var MAX_X =4; // 操作可能幅.
var count = 0; // ブロック消去数.
var point = 1000; //ポイント数.

var script = document.createElement('script');
script.type = 'text/javascript';
script.src = '../js/Block.js';
var glb_blockset = new BlockSet();
var glb_stackedblock = new StackedBlock();

// ブロック色.
var colors = ["cyan","orange","blue","yellow","red","green","purple"];

// ブロック形状.
var shapes =new Array(7);
shapes[0]=[1,1,1,1]; 
shapes[1]=[1,1,1,0,
           1];
shapes[2]=[1,1,1,0,
           0,0,1,0];
shapes[3]=[1,1,0,0,
           1,1 ];
shapes[4]=[1,1,0,0,
           0,1,1];
shapes[5]=[0,1,1,0,
           1,1 ];
shapes[6]=[0,1,0,0,
           1,1,1];

/*------------------------------------------------------------------
■盤面リセット関数.
■メモ：0⇒何もなし、1~⇒ブロック
---------------------------------------------------------------------*/
function init() {
    lose = false;
    for( var y = 0; y < ROWS; ++y ) {
        board[y] = [];
        for( var x = 0; x < COLS; ++x ) {
            board[y][x] = 0;
        }
    }
}

/*------------------------------------------------------------------
■新規操作ブロックセット関数.
■ランダムにブロックパターンを出力し、盤面の一番上へセット.
--------------------------------------------------------------------*/
function newShape(){
    // ランダムにインデックスを出力.
    // Math.floor：引数に対する切捨ての整数を返す.
    var id = Math.floor( Math.random() * shapes.length );
    var shape = shapes[id]; // ブロック形状決定.
    current = []; // パターンを操作ブロックへセット.
    for(var y=0; y<MAX_Y; ++y){
        current[y]=[];
        for(var x=0;x<MAX_X; ++x){
            var i =  MAX_Y*y + x;
            if(typeof shape[i] != 'undefined' && shape[i] ){
                current[y][x] = id + 1;
            }else{
                current[y][x] = 0;
            }
         }
    }
    // ブロックを盤面の上にセット.
    currentX = MAX_X + 1;
    currentY = 0;
}

/*------------------------------------------------------------------
■メインループ関数.
■ゲーム開始後、250秒毎に呼び出される関数.
--------------------------------------------------------------------*/
function tick(){
    //1マス下に移動できるか判定.
    var ret = glb_blockset.moveDown();
    if (glb_stackedblock.isCollision(ret)){
      //ブロックの操作を禁止する
      glb_blockset.control_en = 0;
      //一時的に落下速度を早める
      clearInterval(interval);
      interval = setInterval(tick,30);
      //ブロックを結合する
      var left_block = glb_stackedblock.linkBlockSet(glb_blockset);
      glb_blockset.block_list = left_block;
      if (left_block.length == 0)
      {
        //ブロックの消去判定
        glb_stackedblock.clearLink();
        clearInterval(interval);
        interval = setInterval(tick,500); //速度を元に戻す.
        //新規ブロックの作成（オブジェクトの所属を移すため、clearよりも先にやる）
        var id = Math.floor( Math.random() * 7 );
        glb_blockset.createNewBlock(id);
      }
    }
    /*
    if(valid(0,1)){
        //移動可能時は1マス下へ移動させる.
        ++currentY;
     }else{
        freeze();  //操作していたブロックを盤面に固定.
         clearLines(); //ブロックが消去可能か判定する関数コール.
        if(lose){ // ゲームオーバー判定.
            // newGame();
            return false; // ゲームオーバーしていた場合、本ループ関数より抜ける.
        }
        newShape(); // 次のブロックを生成.
    }
    */
    
}

/*------------------------------------------------------------------
■指定した方向にブロック移動可否判断関数.
■指定した方向へ移動できるか判断する関数.
　移動不可時には移動させない.
--------------------------------------------------------------------*/
function valid(offsetX, offsetY, newCurrent){
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    offsetX = currentX + offsetX;
    offsetY = currentY + offsetY;
    newCurrent = newCurrent || current;
    for(var y=0; y<MAX_Y; ++y){
        for(var x=0; x<MAX_X; ++x){
            if(newCurrent[y][x]){
                if(typeof board[y + offsetY] == 'undefined' // 定義された範囲確認.
                   || typeof board[y + offsetY][x + offsetX] == 'undefined' // 定義された範囲確認.
                   || board[y + offsetY][x + offsetX] //ブロックがあった場合.
                   || x + offsetX < 0 // 盤面外に移動しようとした場合.
                   || y + offsetY >=ROWS // 盤面外に移動しようとした場合.
                   || x + offsetX >=COLS) { // 盤面外に移動しようとした場合.
                        if(offsetY == 1 && offsetX - currentX == 0 && offsetY - currentY == 1){
                            if(lose != true){
                                console.log('game over');
                                showlose();
                                lose = true;
                            }
                        }
                    return false;
                }
              }
           }
    }
    return true;
}

/*------------------------------------------------------------------
■操作していたブロックを固定する関数.
■操作していたブロックを盤面に固定し動かせないようにする関数.
--------------------------------------------------------------------*/
function freeze(){
    for(var y=0; y<MAX_Y; ++y){
        for(var x=0; x<MAX_X; ++x){
            if(current[y][x]){
                board[y + currentY][x + currentX] = current[y][x];
             }
        }
    }
}

/*------------------------------------------------------------------
■ブロック消去関数.
■一行がそろっている箇所を調べ、そろっていれば一行削除する関数.
--------------------------------------------------------------------*/
function clearLines(){
    for(var y = ROWS - 1; y>=0; --y){
        var rowFilled = true;
        //一行そろっているかチェック.
        for(var x = 0; x < COLS; ++x){
            if(board[y][x] == 0){
                rowFilled = false;
                break;
            }
        }
        // そろっていればそろった一行に対してブロック消去処理.
        if(rowFilled){
            count++; //消去した列数をカウント.
            // ブロックを一段ずつ落としていく.
            for(var yy = y; yy > 0;--yy){
                for(var x = 0;x < COLS; ++x){
                    board[yy][x] = board[yy-1][x];
                }
            }
            ++y;
         }
     }
     // ポイント表示
     target = document.getElementById("point"); //id:pointはstyle.cssにて定義. 
     target.innerHTML = 'ポイント：'+count*1000; // 消去した行数×1000でポイント計算.
     console.log('カウンタログ:',count); //ログ.
}

/*------------------------------------------------------------------
■ゲームオーバー関数.
■ゲームオーバーであることを表示する関数.
--------------------------------------------------------------------*/
function showlose() {
    location.href = "../start/restart.html";
}

/*------------------------------------------------------------------
■ゲーム開始関数.
■スタート関数(main関数).
--------------------------------------------------------------------*/
function newGame() {
    clearInterval(interval);
    init(); //盤面を空にする.
    var id = Math.floor( Math.random() * 7 );
    glb_blockset.createNewBlock(id);
    if(lose == false){
        interval = setInterval(tick,500); //メインループへ移行.
    }
}

// スタート.
newGame();

