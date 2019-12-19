<template>
    <div class="home" ref="home">
        <div class="header">
            <v-layout row wrap>
                <v-flex xs6>
                    <div class="number">
                        <p>分数</p>
                        <p>{{scores}}</p>
                    </div>
                </v-flex>
                <v-flex xs6>
                    <div class="number">
                        <p>最高分</p>
                        <p>{{highScores}}</p>
                    </div>
                </v-flex>
                <v-flex xs6>
                    <v-btn @click.native="revocation()" color="warning">撤销({{revocationNum}})</v-btn>
                </v-flex>
                <v-flex xs6>
                    <v-btn @click.native="restart()" color="warning">重新开始</v-btn>
                </v-flex>
            </v-layout>
        </div>
        <div class="content">
            <div class="chessboard" v-touch="{
                left: () => swipe('Left'),
                right: () => swipe('Right'),
                up: () => swipe('Up'),
                down: () => swipe('Down')
            }">
                <!-- <transition-group name="flip-list"> -->
                    <v-layout v-for="(item,index) in DataList" :key="index" row wrap>
                        <v-flex v-for="(items,indexs) in item" :key="index + '-' + indexs" xs3>
                            <div class="grid" :class="items>128 ? `color_128` : `color_${items}`" :style="{width:gridWidth+'px',height:gridWidth+'px','line-height':gridWidth+'px'}">
                                {{items==0?'':items}}
                            </div>
                        </v-flex>
                    </v-layout>
                <!-- </transition-group> -->
            </div>
            <v-layout row justify-space-around>
                <v-flex xs4>
                    <v-btn @click="swipe('Up')" color="info">上</v-btn>
                </v-flex>
            </v-layout>
            <v-layout row justify-center>
                <v-flex xs4>
                    <v-btn @click="swipe('Left')" color="info">左</v-btn>
                </v-flex>
                <v-flex xs4>
                    <v-btn @click="swipe('Down')" color="info">下</v-btn>
                </v-flex>
                <v-flex xs4>
                    <v-btn @click="swipe('Right')" color="info">右</v-btn>
                </v-flex>
            </v-layout>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src

export default {
    name: "home",
    components: {
    },
    data(){
        return {
            //表示棋盘的数组
            DataList:[
                [0,0,0,0,],
                [0,0,0,0,],
                [0,0,0,0,],
                [0,0,0,0,],
            ],
            //棋盘格子宽度
            gridWidth:0,
            //当前分数
            scores:0, 
            //最高分
            highScores:0,
            //移动操作记录
            stepList:[],
            //可撤销次数
            revocationNum:20,
        };
    },
    watch: {
        scores: function (val) {
            if(val>this.highScores) {
                this.highScores = val;
                window.localStorage.setItem('highScores', this.highScores)
            }
        },
    },
    computed:{
    },
    methods:{
        //撤销操作
        revocation(){
            console.log(this.stepList)
            if(this.revocationNum>0 && this.stepList.length && this.stepList.length>0){
                this.$set(this,'DataList',this.stepList.pop());
                this.revocationNum -= 1;
            }else{
                alert('不能再撤销了 ╮(╯▽╰)╭');
            }
        },
        //记录操作步骤，用于撤销到上一步
        stepUpdate(data){
            if((this.stepList.length == 0) || (this.stepList[this.stepList.length-1].toString() !== data.toString())){
                this.stepList.push([...data]);
            }
            //以下为只记录9步
            // if(this.stepList.length < 9){
            //     if((this.stepList.length == 0) || (this.stepList[this.stepList.length-1].toString() !== data.toString())){
            //         this.stepList.push([...data]);
            //     }
            // }else if((this.stepList.length == 9) && (this.stepList[8].toString() !== data.toString())){
            //     this.stepList.splice(0,1);
            //     this.stepList.push([...data]);
            // }
        },
        ArrayCompute2(data){
            if(data.length>1){
                let aa = [];
                if(data[0]==data[1]){
                    const a1 = data[0] + data[1];
                    this.scores += a1;
                    const a2 = this.ArrayCompute2(data.slice(2,data.length));
                    aa = [...[a1],...a2];
                }else{
                    if(data.length==2){
                        aa = data;
                    }else{
                        const a1 = data[0];
                        data.splice(0, 1);
                        const a2 = this.ArrayCompute2([...data]);
                        aa = [...[a1],...a2];
                    }
                }
                return aa
            }else{
                return data
            }
        },
        //计算传入数组（相邻非零相同数向左合并）并返回结果
        ArrayCompute(data){
            let arr = []
            data.forEach((el,index)=>{
                if(el>0) arr.push(el);
            })
            arr = this.ArrayCompute2([...arr])
            while (arr.length < this.DataList.length) {
                arr.push(0);
            }
            return arr
        },
        //移动计算
        move(direction,data){
            let dataArr = JSON.parse(JSON.stringify(data))
            switch (direction){
                case 'Left':
                    for (let i = 0; i < data.length; i++) {
                        let arr = this.ArrayCompute([...data[i]]);
                        dataArr[i] = arr
                    };
                    break;

                case 'Right':
                    for (let i = 0; i < data.length; i++) {
                        let arr = [...data[i]];
                        arr = this.ArrayCompute(arr.reverse()).reverse();
                        dataArr[i] = arr
                    };
                    break;

                case 'Up':
                    for (let i = 0; i < data.length; i++) {
                        let arr = [];
                        for (let i2 = 0; i2 < data.length; i2++) {
                            arr.push(data[i2][i]);
                        }
                        arr = this.ArrayCompute(arr)
                        for (let i2 = 0; i2 < data.length; i2++) {
                            dataArr[i2][i] = arr[i2]
                        }
                    };
                    break;

                case 'Down':
                    for (let i = 0; i < data.length; i++) {
                        let arr = [];
                        for (let i2 = 0; i2 < data.length; i2++) {
                            arr.push(data[i2][i]);
                        }
                        arr = this.ArrayCompute(arr.reverse()).reverse();
                        for (let i2 = 0; i2 < data.length; i2++) {
                            dataArr[i2][i] = arr[i2]
                        }
                    };
                    break;
            };
            return dataArr;
        },
        //执行移动操作及输赢判断
        swipe(direction){
            const oldArr = JSON.parse(JSON.stringify(this.DataList));

            this.$set(this , 'DataList' , this.move(direction,this.DataList));

            const newArr = JSON.parse(JSON.stringify(this.DataList));
            let vacanay = [];
            newArr.forEach((el1,index1)=>{
                el1.forEach((el2,index2)=>{
                    if(el2 == 0)  vacanay.push([index1,index2]);
                })
            })
            if(vacanay.length>0 || this.judge(direction , newArr) ){
                if(oldArr.toString() === this.DataList.toString()) return;
                let rNum = this.randomNumber(0,vacanay.length-1);
                this.$set(this.DataList[vacanay[rNum][0]],vacanay[rNum][1],this.randomNumber(0,5)==5 ? 4 : 2);
                this.stepUpdate(oldArr);
            }else{
                alert("游戏结束ヽ（≧□≦）ノ");
            }
        },
        //判断棋盘放置满后是否还能移动
        judge(direction , Data){
            const oldData = JSON.parse(JSON.stringify(Data));
            const fx = (direction=='Left' || direction=='Right') ? 'Up' : 'Left';
            if(oldData.toString() === this.move(fx,Data).toString()){
                return false;
            }else{
                console.log('还可以再抢救一下…(⊙_⊙;)…')
                return true;
            }
        },
        //获取规定范围随机数，用于初始化游戏计算位置等。
        randomNumber(lowerValue,upperValue){
            return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
        },
        //重新开始游戏
        restart(){
            this.scores = 0;
            //将所有数据清0
            this.DataList.forEach(el=>{
                el.fill(0);
            })
            //下面是对两个随机位置的数据添加（会出现两次随机位置相同的问题，暂时不解决）
            this.$set(this.DataList[this.randomNumber(0,this.DataList.length-1)],this.randomNumber(0,this.DataList[0].length-1),this.randomNumber(0,3)==3 ? 4 : 2);
            this.$set(this.DataList[this.randomNumber(0,this.DataList.length-1)],this.randomNumber(0,this.DataList[0].length-1),this.randomNumber(0,3)==3 ? 4 : 2);
            this.stepUpdate(JSON.parse(JSON.stringify(this.DataList)))
        },
    },
    mounted(){
        let _this = this;
        this.$nextTick(()=>{
            this.gridWidth = ((this.$refs.home.offsetWidth - 74) / 4)
        })
        window.onresize = ()=>{
            _this.gridWidth =  this.$refs.home.offsetWidth>500 ? ((500 - 74) / 4) : ((this.$refs.home.offsetWidth - 74) / 4)
        };
        //绑定键盘事件（方向键）
        document.onkeydown = function(e){
            let _key = window.event.keyCode;
            switch(_key){
                case 37: 
                    _this.swipe('Left');break;
                case 38:
                    _this.swipe('Up');break;
                case 39:
                    _this.swipe('Right');break;
                case 40:
                    _this.swipe('Down');break;
            }
        };
        //拿到缓存的最高分
        this.highScores = window.localStorage.getItem('highScores') || 0;
        //游戏初始化
        this.restart();
    },
    created(){
    }
};
</script>
<style lang="less">
    // .flip-list-move {
    //     transition: transform 0.5s;
    // }
    .home{
        width: 100%;
        max-width: 500px;
        margin: auto;
        height: 100%;
        background-color: #fdeed4;
        .header{
            width: 100%;
            height: 150px;
            .number{
                margin: 12px;
                padding-top: 10px;
                font-size: 19px;
                line-height: 30px;
                border-radius: 5px;
                background-color: rgba(121, 85, 72, 0.3);
                p{
                    margin: 0px;
                }
            }
        }
        .content{
            width: 100%;
            overflow: hidden;
            height: ~'calc(100% - 150px)';
            .chessboard{
                padding: 5px;
                margin: 12px;
                width: ~'calc(100% - 24px)';
                background-color: rgba(121, 85, 72, 0.3);
                .grid{
                    margin: 5px;
                    font-size: 25px;
                    box-shadow: 
                        0px 2px 1px -1px rgba(0,0,0,0.2), 
                        0px 1px 1px 0px rgba(0,0,0,0.14), 
                        0px 1px 3px 0px rgba(0,0,0,0.12);
                }
            }
        }
    }
    .color_0{ background-color: rgba(255, 255, 255, 0.2); }
    .color_2{ background-color: rgba(255, 255, 255, 0.4); }
    .color_4{ background-color: rgba(243, 221, 184, 0.77); }
    .color_8{ background-color: rgba(255, 197, 100, 0.8); }
    .color_16{ background-color: rgba(245, 127, 43, 0.8); }
    .color_32{ background-color: rgb(245, 96, 39, 0.9); }
    .color_64{ background-color: rgb(247, 54, 39, 0.9); }
    .color_128{ background-color: rgba(247, 216, 77, 0.85); }
</style>
