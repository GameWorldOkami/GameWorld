/**
 * Title: Block.js
 * Note : 
 */


var Block = (function(){

    //constructer
    var Block = function(y, x, id) {
        this.local_y = y;
        this.local_x = x;
        this.id = id;
    };

    var p = Block.prototype;

    p.getAllInformation = function() {
        return (this.local_y, this.local_x, this.id);
    }

    return Block;
})();


var BlockSet = (function(){
    //constant
    var BLOCKSIZE= 4;
    var MAX_X= 4;
    var MAX_Y= 4;

    // ブロックの形状
    var SHAPES = [];
    SHAPES[0]=  [
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0]    
    ];
    SHAPES[1]=  [
        [1,1,1],
        [1,0,0],
        [0,0,0],
    ];
    SHAPES[2]=  [
        [1,1,1],
        [0,0,1],
        [0,0,0]
    ];
    SHAPES[3]=  [
        [1,1],
        [1,1]
    ];
    SHAPES[4]=  [
        [1,1,0],
        [0,1,1],
        [0,0,0]
    ];
    SHAPES[5]=  [
        [0,1,1],
        [1,1,0],
        [0,0,0]
    ];
    SHAPES[6]=  [
        [0,1,0],
        [1,1,1],
        [0,0,0]
    ];    

    //constructer
    var BlockSet = function(){
    };

    var p = BlockSet.prototype;

    p.createNewBlock = function(id) {
        this.block_list = [];
        this.glb_x = 1;
        this.glb_y = 1;
        this.control_en = 1;
        //ローテート関数のため、高さと幅をメンバとして保持する
        this.ylength = SHAPES[id].length
        this.xlength = SHAPES[id][0].length
        var i = 0;
        for (var y=0; y < this.ylength; ++y){
            for (var x=0; x < this.xlength; ++x){
                if (SHAPES[id][y][x] == 1){
                    this.block_list[i] = new Block(y,x,id);
                    i++;
                 }
            }
         }
        return true;
    }

    p.makeReturnList = function() {
        var ret_list = [];
        var index = 0;
        for (var i of this.block_list)
        {
            ret_list[index++] = [i.local_y + this.glb_y, i.local_x + this.glb_x];
        }
        return ret_list;
    }

    p.rotateLeft = function() {
        for (var i of this.block_list)
        {
            var tmp = i.local_y;
            i.local_y = this.xlength - i.local_x - 1;
            i.local_x = tmp;
        }
        this.reverse = this.rotateRight;
        return this.makeReturnList();
    }
    
    p.rotateRight = function() {
        for (var i of this.block_list)
        {
            var tmp = i.local_y;
            i.local_y = i.local_x;
            i.local_x = this.ylength - tmp - 1;
        }
        this.reverse = this.rotateLeft;
        return this.makeReturnList();
    }

    p.moveDown = function() {
        this.glb_y++;
        this.reverse = this.moveUp;
        return this.makeReturnList();
    }

    p.moveUp = function() {
        this.glb_y--;
        this.reverse = this.moveDown;
        return this.makeReturnList();
    }


    p.moveLeft = function() {
        this.glb_x--;
        this.reverse = this.moveRight;
        return this.makeReturnList();
    }

    p.moveRight = function() {
        this.glb_x++;
        this.reverse = this.moveLeft;
        return this.makeReturnList();
    }


    p.cancelOperation = function() {
        //revese()実行先でコールバックが書き換えられられるので、
        //再びreveseを上書きする
        var tmp = this.reverse;
        this.reverse();
        this.reverse = tmp;
        return this.makeReturnList();
    }

    p.getGrobalList = function() {
        var ret_list = [];
        for (var i = 0; i < this.block_list.length; i++){
            var y = this.block_list[i] .local_y+ this.glb_y;
            var x = this.block_list[i] .local_x + this.glb_x;
            var id= this.block_list[i].id;
            ret_list[i] = new Block(y, x, id);
        }
        return ret_list;
    }
    return BlockSet;
})();


var StackedBlock = (function(){
    
        var FLAME_OUTLEGION = 1;
        var FLAME_WIDTH = 10 + FLAME_OUTLEGION*2;
        var FLAME_HEIGHT = 20 + FLAME_OUTLEGION*2;
        var CLEAR_BLOCK_SIZE = 6;

        //constructer
        var StackedBlock = function() {
            this.coordinates_status = new Array(FLAME_HEIGHT);
            for (var y = 0; y < FLAME_HEIGHT; y++)
            {
                this.coordinates_status[y] = new Array(FLAME_WIDTH);
                for (var x = 0; x < FLAME_WIDTH; x++)
                {
                    this.coordinates_status[y][x] = 0;
                }
            }

            for (var y = 0; y < FLAME_HEIGHT; y++)
            {
                this.coordinates_status[y][0] = 1;
                this.coordinates_status[y][FLAME_WIDTH-1] = 1;
            }
            for (var x = 0; x < FLAME_WIDTH; x++)
            {
                this.coordinates_status[0][x] = 1;
                this.coordinates_status[FLAME_HEIGHT-FLAME_OUTLEGION][x] = 1;
            }
            this.cleared_list = [];
            this.cleared_index = [];
            this.stacked_list = [];
            this.prestacked_blocklist = [];
        };
    
        var p = StackedBlock.prototype;
    
        //ブロックリストを結合する
        p.linkBlockSet = function(new_blockset)
        {
            var glb_list = new_blockset.getGrobalList();
            //最大のyが先にくるようにソートする
            glb_list.sort(function(a,b){
                var a_y = a.local_y;
                var b_y = b.local_y;
                if( a_y < b_y ) return 1;
                if( a_y > b_y ) return -1;
                return 0;
            });
            var left_blocklist = [];
            for (var i of glb_list)
            {
                if (this.coordinates_status[i.local_y][i.local_x])
                {
                    //ブロック位置を戻す
                    i.local_y -= 1;
                    this.prestacked_blocklist.push(i);
                    this.coordinates_status[i.local_y][i.local_x] = 1;
                }
                else
                {
                    i.local_x -= new_blockset.glb_x;
                    i.local_y -= new_blockset.glb_y;
                    left_blocklist.push(i);
                }
            }
            if (left_blocklist.length == 0)
            {
                for (var i of this.prestacked_blocklist)
                {
                    this.linkBlock(i);
                }
                this.prestacked_blocklist.length = 0;
            }
            return left_blocklist;
        }

        //ブロックを結合する
        p.linkBlock = function(new_block) {
            var link_flg = false;
            var link_candidate = [];
            for (var y=0; y < this.stacked_list.length; ++y) {
                for (i of this.stacked_list[y]) {
                    if (this.isLinkable(i, new_block))
                    {
                        link_candidate.push(y);
                        link_flg = true;
                        break;
                    }
                }
            }
            if (link_flg == true)
            { //リンク先が見つかった場合
                var new_stacked_list = [];
                var offset = 0;
                for (y of link_candidate) {
                    for (old_block of this.stacked_list[y-offset]) {
                        new_stacked_list.push(old_block);
                    }
                    this.stacked_list[y-offset].length = 0;
                    this.stacked_list.splice(y-offset,1);
                    offset++;
                }
                new_stacked_list.push(new_block);
                this.stacked_list.push(new_stacked_list);
            }
            else
            { //リンク先が見つからない場合
                this.stacked_list[this.stacked_list.length] = []
                this.stacked_list[this.stacked_list.length - 1].push(new_block);
            }
        }

        //ブロックが結合可能か判断
        p.isLinkable = function(block1, block2){
            var ret = false;
            if (block1.id == block2.id)
            {
                var norm_1d = Math.abs(block1.local_x - block2.local_x) + Math.abs(block1.local_y - block2.local_y);
                if (norm_1d == 1)
                {
                    ret = true;
                }
            }
            return ret;
        }

        //返す値は消したリンクリストの数
        p.clearLink = function(){
            var ret = 0;
            for(var y=0; y < this.stacked_list.length; ++y){
                if (this.isSatisfiedClear(this.stacked_list[y]))
                {
                    this.cleared_list[this.cleared_list.length] = this.stacked_list[y][0].local_y;
                    this.cleared_index[this.cleared_index.length] = y;
                    this.clearBlock(this.stacked_list[y]);
                    y--;
                    ret++;
                }
            }
            //一つでも消去対象のラインがあれば
            if (ret > 0)
            {
                var offset = 0;
                for(var y of this.cleared_index){
                    this.stacked_list.splice(y-offset,1);
                    offset++;
                }
                this.cleared_index.length = 0;
                //落下判定は上から順番に行うので、ソートする
                this.cleared_list.sort(function(a,b){
                    if( a < b ) return -1;
                    if( a > b ) return 1;
                    return 0;
                });
                //上に積み重なっているブロックから落下させる
                for(var y of this.cleared_list){
                    for(var i of this.stacked_list)
                    {
                        for(var j of i){
                            if (j.local_y < y)
                            {
                                this.fallBlock(j)
                            }
                        }
                    }
                }
                this.cleared_list.length = 0;
            }
            return ret;
        };

        p.clearBlock = function(link_list){
            for (var i of link_list)
            {
                this.coordinates_status[i.local_y][i.local_x] = 0;
            }
            link_list.length = 0;
        };

        p.isSatisfiedClear = function(block_list){
            var ret = false;
            if (block_list.length >= CLEAR_BLOCK_SIZE)
            {
                ret = true;
            }
            return ret;
        }

        p.fallBlock = function(block){
            this.coordinates_status[block.local_y][block.local_x] = 0;
            block.local_y++;
            this.coordinates_status[block.local_y][block.local_x] = 1;
        }

        p.isCollision = function(axis_list){
            var ret = 0;
            for (var i of axis_list){
                var y = i[0];
                var x = i[1];
                ret |= this.coordinates_status[y][x];
            }
            return ret;
        }

        p.getGrobalList = function() {
            var ret_list = []
            var index = 0;
            for(var i of this.stacked_list){
                for(var j of i){
                    ret_list[index] = j;
                    index++;
                }
            }
            for(var i of this.prestacked_blocklist){
                ret_list[index] = i;
                index++;
            }
            return ret_list;
        }
    
        return StackedBlock;
    })();


/*
function newGame() {
    var tmp = new BlockSet();
    var tmp2 = new StackedBlock();
    tmp.createNewBlock(2);
    tmp.moveDown();
    tmp.moveRight();
    var retlist = tmp.moveRight();
    var ret = tmp2.isConflict(retlist);
    if (ret == true)
    {
        tmp.cancelOperation();
    }
    var retlist1 = tmp.getGrobalList();
    var retlist2 = tmp2.getGrobalList();  
    tmp2.linkBlockSet(tmp);
    retlist2 = tmp2.getGrobalList();
}

newGame();
*/
