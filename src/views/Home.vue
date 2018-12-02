<template>
    <div class="home">
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
                <v-layout v-for="(item,index) in DataList" :key="index" row wrap>
                    <v-flex v-for="(items,indexs) in item" :key="indexs" xs3>
                        <div class="grid" :style="{width:gridWidth+'px',height:gridWidth+'px','line-height':gridWidth+'px','background-color':gridColor(items)}">
                            {{items==0?'':items}}
                        </div>
                    </v-flex>
                </v-layout>
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
import HelloWorld from "@/components/HelloWorld.vue";

export default {
    name: "home",
    components: {
        HelloWorld
    },
    data(){
        return {
            DataList:[
                [0,0,0,0,],
                [0,0,0,0,],
                [0,0,0,0,],
                [0,0,0,0,],
            ],
            // gridWidth:(document.body.offsetWidth - 74) / 4,
            scores:0, 
            highScores:0,
            stepList:[],
            revocationNum:9,
        };
    },
    watch: {
        scores: function (val, oldVal) {
            if(val>this.highScores) this.highScores = val;
        },
    },
    computed:{
        gridWidth(){
            return (document.body.offsetWidth - 74) / 4;
        }
    },
    methods:{
        //撤销操作
        revocation(){
            if(this.revocationNum>0 && this.stepList.length && this.stepList.length>0){
                this.stepList.pop();
                let data = JSON.parse(JSON.stringify(this.stepList[this.stepList.length-1]));
                this.$set(this,'DataList',data);
                this.revocationNum -= 1;
            }else{
                alert('无法撤销');
            }
        },
        //记录操作步骤，用于撤销到上一步
        stepUpdate(data){
            if(this.stepList.length<9){
                if((this.stepList.length == 0) || (this.stepList[this.stepList.length-1].toString() !== data.toString())){
                    this.stepList.push([...data]);
                }
            }else if((this.stepList.length == 9) && (this.stepList[8].toString() !== data.toString())){
                this.stepList.splice(0,1);
                this.stepList.push([...data]);
            }
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
                        const a2 = this.ArrayCompute2(JSON.parse(JSON.stringify(data)));
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
            arr = this.ArrayCompute2(JSON.parse(JSON.stringify(arr)))
            while (arr.length < this.DataList.length) {
                arr.push(0);
            }
            return arr
        },
        //触摸操作控制方向
        swipe(direction){
            const oldArr = this.DataList.toString();
            if(direction == 'Left'){
                for (let i = 0; i < this.DataList.length; i++) {
                    let arr = this.ArrayCompute(JSON.parse(JSON.stringify(this.DataList[i])));
                    this.$set(this.DataList,i,arr);
                }
            }else if(direction == 'Right'){
                for (let i = 0; i < this.DataList.length; i++) {
                    let arr = JSON.parse(JSON.stringify(this.DataList[i]));
                    arr = this.ArrayCompute(arr.reverse()).reverse();
                    this.$set(this.DataList,i,arr);
                }
            }else if(direction == 'Up'){
                for (let i = 0; i < this.DataList.length; i++) {
                    let arr = [];
                    for (let i2 = 0; i2 < this.DataList.length; i2++) {
                        arr.push(this.DataList[i2][i]);
                    }
                    arr = this.ArrayCompute(arr)
                    for (let i2 = 0; i2 < this.DataList.length; i2++) {
                        this.$set(this.DataList[i2],i,arr[i2]);
                    }
                }
            }else if(direction == 'Down'){
                for (let i = 0; i < this.DataList.length; i++) {
                    let arr = [];
                    for (let i2 = 0; i2 < this.DataList.length; i2++) {
                        arr.push(this.DataList[i2][i]);
                    }
                    arr = this.ArrayCompute(arr.reverse()).reverse();
                    for (let i2 = 0; i2 < this.DataList.length; i2++) {
                        this.$set(this.DataList[i2],i,arr[i2]);
                    }
                }
            }
            let aa = [];
            this.DataList.forEach((el1,index1)=>{
                el1.forEach((el2,index2)=>{
                    if(el2 == 0)  aa.push([index1,index2]);
                })
            })
            if(aa.length>0){
                if(oldArr === this.DataList.toString()) return;
                let bb = this.randomNumber(0,aa.length-1);
                this.$set(this.DataList[aa[bb][0]],aa[bb][1],this.randomNumber(0,5)==5 ? 4 : 2);
                this.stepUpdate(JSON.parse(JSON.stringify(this.DataList)));
            }else{
                alert("游戏结束");
            }
        },
        //数字背景颜色
        gridColor(item){
            switch (item){
                case 0: 
                    return 'rgba(255, 255, 255, 0.2)';
                case 2: 
                    return 'rgba(255, 255, 255, 0.4)';
                case 4: 
                    return 'rgba(243, 221, 184, 0.77)';
                case 8: 
                    return 'rgba(255, 197, 100, 0.8)';
                case 16: 
                    return 'rgba(245, 127, 43, 0.8)';
                case 32: 
                    return 'rgb(245, 96, 39, 0.9)';
                case 64: 
                    return 'rgb(247, 54, 39, 0.9)';
                case 128: 
                    return 'rgba(247, 216, 77, 0.85)';
                case 256: 
                    return 'rgba(247, 216, 77, 0.85)';
                case 512: 
                    return 'rgba(247, 216, 77, 0.85)';
                default:
                    return 'rgba(247, 216, 77, 0.85)';
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
        this.restart();
    },
    created(){
        //绑定键盘事件（方向键）
        let _this = this;
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
        }
    }
};
</script>
<style lang="less">
    .home{
        width: 100%;
        height: 100%;
        background-color: #fdeed4;
        .header{
            width: 100%;
            height: 150px;
            .number{
                margin: 12px;
                height: 50px;
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
</style>
