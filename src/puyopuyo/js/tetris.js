/*------------------------------------------------------------------
����`
--------------------------------------------------------------------*/
var COLS = 10, ROWS = 20 //��10�A�c20�}�X
var board = []; //�Ֆʏ��.
var lose; //�Q�[���I�[�o�[����t���O.
var interval; // �^�C�}�ێ��ϐ�.
var current; // ���ݑ��쒆�̃u���b�N�`��.
var currentX, currentY; // ���ݑ��쒆�̃u���b�N�ʒu.
var MAX_Y =4; // ����\��.
var MAX_X =4; // ����\��.
var count = 0; // �u���b�N������.
var point = 1000; //�|�C���g��.

var script = document.createElement('script');
script.type = 'text/javascript';
script.src = '../js/Block.js';
var glb_blockset = new BlockSet();
var glb_stackedblock = new StackedBlock();

// �u���b�N�F.
var colors = ["cyan","orange","blue","yellow","red","green","purple"];

// �u���b�N�`��.
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
���Ֆʃ��Z�b�g�֐�.
�������F0�ˉ����Ȃ��A1~�˃u���b�N
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
���V�K����u���b�N�Z�b�g�֐�.
�������_���Ƀu���b�N�p�^�[�����o�͂��A�Ֆʂ̈�ԏ�փZ�b�g.
--------------------------------------------------------------------*/
function newShape(){
    // �����_���ɃC���f�b�N�X���o��.
    // Math.floor�F�����ɑ΂���؎̂Ă̐�����Ԃ�.
    var id = Math.floor( Math.random() * shapes.length );
    var shape = shapes[id]; // �u���b�N�`�󌈒�.
    current = []; // �p�^�[���𑀍�u���b�N�փZ�b�g.
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
    // �u���b�N��Ֆʂ̏�ɃZ�b�g.
    currentX = MAX_X + 1;
    currentY = 0;
}

/*------------------------------------------------------------------
�����C�����[�v�֐�.
���Q�[���J�n��A250�b���ɌĂяo�����֐�.
--------------------------------------------------------------------*/
function tick(){
    //1�}�X���Ɉړ��ł��邩����.
    var ret = glb_blockset.moveDown();
    if (glb_stackedblock.isCollision(ret)){
      //�u���b�N�̑�����֎~����
      glb_blockset.control_en = 0;
      //�ꎞ�I�ɗ������x�𑁂߂�
      clearInterval(interval);
      interval = setInterval(tick,30);
      //�u���b�N����������
      var left_block = glb_stackedblock.linkBlockSet(glb_blockset);
      glb_blockset.block_list = left_block;
      if (left_block.length == 0)
      {
        //�u���b�N�̏�������
        glb_stackedblock.clearLink();
        clearInterval(interval);
        interval = setInterval(tick,500); //���x�����ɖ߂�.
        //�V�K�u���b�N�̍쐬�i�I�u�W�F�N�g�̏������ڂ����߁Aclear������ɂ��j
        var id = Math.floor( Math.random() * 7 );
        glb_blockset.createNewBlock(id);
      }
    }
    /*
    if(valid(0,1)){
        //�ړ��\����1�}�X���ֈړ�������.
        ++currentY;
     }else{
        freeze();  //���삵�Ă����u���b�N��ՖʂɌŒ�.
         clearLines(); //�u���b�N�������\�����肷��֐��R�[��.
        if(lose){ // �Q�[���I�[�o�[����.
            // newGame();
            return false; // �Q�[���I�[�o�[���Ă����ꍇ�A�{���[�v�֐���蔲����.
        }
        newShape(); // ���̃u���b�N�𐶐�.
    }
    */
    
}

/*------------------------------------------------------------------
���w�肵�������Ƀu���b�N�ړ��۔��f�֐�.
���w�肵�������ֈړ��ł��邩���f����֐�.
�@�ړ��s���ɂ͈ړ������Ȃ�.
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
                if(typeof board[y + offsetY] == 'undefined' // ��`���ꂽ�͈͊m�F.
                   || typeof board[y + offsetY][x + offsetX] == 'undefined' // ��`���ꂽ�͈͊m�F.
                   || board[y + offsetY][x + offsetX] //�u���b�N���������ꍇ.
                   || x + offsetX < 0 // �ՖʊO�Ɉړ����悤�Ƃ����ꍇ.
                   || y + offsetY >=ROWS // �ՖʊO�Ɉړ����悤�Ƃ����ꍇ.
                   || x + offsetX >=COLS) { // �ՖʊO�Ɉړ����悤�Ƃ����ꍇ.
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
�����삵�Ă����u���b�N���Œ肷��֐�.
�����삵�Ă����u���b�N��ՖʂɌŒ肵�������Ȃ��悤�ɂ���֐�.
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
���u���b�N�����֐�.
����s��������Ă���ӏ��𒲂ׁA������Ă���Έ�s�폜����֐�.
--------------------------------------------------------------------*/
function clearLines(){
    for(var y = ROWS - 1; y>=0; --y){
        var rowFilled = true;
        //��s������Ă��邩�`�F�b�N.
        for(var x = 0; x < COLS; ++x){
            if(board[y][x] == 0){
                rowFilled = false;
                break;
            }
        }
        // ������Ă���΂��������s�ɑ΂��ău���b�N��������.
        if(rowFilled){
            count++; //���������񐔂��J�E���g.
            // �u���b�N����i�����Ƃ��Ă���.
            for(var yy = y; yy > 0;--yy){
                for(var x = 0;x < COLS; ++x){
                    board[yy][x] = board[yy-1][x];
                }
            }
            ++y;
         }
     }
     // �|�C���g�\��
     target = document.getElementById("point"); //id:point��style.css�ɂĒ�`. 
     target.innerHTML = '�|�C���g�F'+count*1000; // ���������s���~1000�Ń|�C���g�v�Z.
     console.log('�J�E���^���O:',count); //���O.
}

/*------------------------------------------------------------------
���Q�[���I�[�o�[�֐�.
���Q�[���I�[�o�[�ł��邱�Ƃ�\������֐�.
--------------------------------------------------------------------*/
function showlose() {
    location.href = "../start/restart.html";
}

/*------------------------------------------------------------------
���Q�[���J�n�֐�.
���X�^�[�g�֐�(main�֐�).
--------------------------------------------------------------------*/
function newGame() {
    clearInterval(interval);
    init(); //�Ֆʂ���ɂ���.
    var id = Math.floor( Math.random() * 7 );
    glb_blockset.createNewBlock(id);
    if(lose == false){
        interval = setInterval(tick,500); //���C�����[�v�ֈڍs.
    }
}

// �X�^�[�g.
newGame();

