<template>
    <div class="audioplayerPage" :style="{background: `#14277a url(${audio.playerbg}) 0 0/100% 100%`}">
        <div class="popwindow" :class="{cur:isShowPlayList}" @click="isShowPlayListBtn"></div>
        <header>
            <span class="iconfont icon-houtui1" @click="goback"></span>
            <!-- 需要判断index的类型显示响应的歌曲名字 -->
            {{typeof audio.index == 'number' ? audio.album[audio.index].musicName :'播放器'}}
        </header>
        <span v-if="typeof audio.index == 'number'">
            <audio :src="audio.album[audio.index].musicUrl" autoplay @timeupdate="play" class="audio"></audio>
        </span>

        <div class="content" v-if="!isShowLyric" @click="showLyric">
            <div class="cd">
                <img src="../../static/img/cd.png">
                <div class="singerbg" :class="{cur:isPlay}">
                    <img :src="audio.albumImg">
                </div>
            </div>
            <div class="swith":class="{cur:isPlay}">
                <img src="../../static/img/swith.png">
            </div>
        </div>
        <!-- 歌词盒子 -->
        <!-- 当前播放时间 > 当前歌词语句的时间就加类 -->
        <!-- 并且当前时间 + 本句歌的持续时间（下一行 减去本行 就时本句唱了多少秒） 但是下一行不能超过歌词总数（index + 1 > lyric.length - 1 ? lyric.length - 1 : index + 1）,但也不能小于0（index <= 0 就是0 -->
        <!-- 大不能超过数组的长度，小不能小于0  -->
        <!-- currentTime + (lyric[index][0] - lyric[index <= 0 ? 0 : index + 1 > lyric.length - 1 ? lyric.length - 1 : index + 1][0]) < lyric[index][0] -->
        <div class="lyric" v-if="isShowLyric" @click="hideLyric" v-height="280">
            <ul>
                <li v-for="(item,index) in lyric" :class="{cur:currentTime > lyric[index][0] && currentTime + (lyric[index][0] - lyric[index <= 0 ? 0 : index + 1 > lyric.length - 1 ? lyric.length - 1 : index + 1][0]) < lyric[index][0]}">
                    <span class="animationLyric_origin">
                        {{item[1]}}
                        <span class="animationLyric_current" :style="[
                            {'animation-play-state':isPlay ? 'running' : 'paused'},
                            {'animation-duration':parseFloat(lyric[index+1 > lyric.length-1 ? lyric.length-1 : index+1][0] - parseFloat(lyric[index][0])) + 's' }
                        ]">
                            {{item[1]}}
                        </span>
                    </span>

                </li>
            </ul>
        </div>
        <!-- 歌词盒子 -->

        <!-- 分割线 -->
        <ul class="setting">
            <li class="iconfont icon-xin1"></li>
            <li class="iconfont icon-icon--"></li>
            <li class="iconfont icon-BAI-pinglun"></li>
            <li class="iconfont icon-more-vert"></li>
        </ul>
        <div class="progressBar">
            <p class="start">{{currentTime | zhuanhuan}}</p>
            <p class="range">
                <span class="duration" @click="gotoTime($event)">
                    <span class="currentTime" :style="{width:currentTime / duration * 100 + '%' }"></span>
                </span>
            </p>
            <p class="end">{{duration | zhuanhuan}}</p>
        </div>
        <div class="controller">
            <p class="playmodebtn iconfont"
               :class="[
                  {'icon-xunhuan': playState === 'all'},
                  {'icon-singlecycle': playState === 'once'},
                  {'icon-bofangye-caozuolan-suijibofang': playState === 'random'}
               ]"
               @click="changePlayState"
            >
            </p>
            <ul>
                <li class="iconfont icon-previous" @click="goPrev"></li>
                <li class="iconfont" @click="pause_play"
                    :class="[isPlay == true ? 'icon-pause-20' : 'icon-bofang']"
                >
                </li>
                <li class="iconfont icon-next" @click="goNext"></li>
            </ul>
            <p class="playlistbtn iconfont icon-zhankaicaidan" @click="isShowPlayListBtn"></p>
        </div>
        <div class="playlist" :class="{cur:isShowPlayList}">
            <ul>
                <li v-for="(item,index) in audio.album" :class="{cur:index == audio.index}" @click="playList(index)">
                    <span
                        class="iconfont laba"
                        :class="{'icon-laba':index == audio.index}"
                        :style="{fontSize:index != audio.index ? '14px' : '28px'}"
                    >
                        {{index != audio.index ? index + 1 : ""}}
                    </span>
                    <span>{{item.musicName}}</span>
                </li>
            </ul>
            <footer>
                <span class="iconfont icon-guanbi" @click="isShowPlayListBtn"></span>
            </footer>
        </div>
    </div>
</template>
<script>
    export default {
        props:["audio"],
        data(){
            return {
                isShowPlayList : false,
                isPlay:true, //因为audio标签有autoplay所以默认时true（加cur类）
                duration: 0,
                currentTime: 0,
                isAddClass:true,   //需要一个量去控制什么时候加类
                playState:'all',    //播放模式all once random
                isShowLyric:false,
                lyric:[]
            }
        },
        computed:{
            playerIndex(){
                return this.$store.state.audio.index;
            }
        },
        methods:{
            goback(){
                this.$store.commit("SHOWORHIDEPLAYER",{isShowAudio:false})
            },
            isShowPlayListBtn(){
                //显示更多歌曲列表
                this.isShowPlayList = !this.isShowPlayList;
            },
            play(){
                // 每帧都执行这个方法
                this.duration = $('.audio')[0].duration; //获取音频的总时长
                this.currentTime = $('.audio')[0].currentTime; //获取音频当前的播放时间
                if($('.audio')[0].paused && this.isAddClass){
                    //表示暂停时
                    this.isPlay = false
                    this.isAddClass = false
                }else{
                    this.isPlay = true
                }

                //ended返回当前音频是否已经结束
                if($('.audio')[0].ended){
                    if(this.playState === 'all'){  //顺序播放
                        if(this.playerIndex >= this.audio.album.length - 1){
                            this.changeMusic(0)
                        }else{
                            this.changeMusic(this.audio.index + 1)
                        }
                    }else if(this.playState === 'random'){  //随机播放
                        var index = ~~(Math.random() * this.audio.album.length);
                        this.changeMusic(index);

                    }else if(this.playState === 'once'){ //单曲循环
                        this.changeMusic(this.audio.index)
                        $('.audio')[0].load(); //重新播放
                    }
                }

                //歌词向上滚动
                for(var i = 0; i < this.lyric.length - 1;i++){
                    if(this.currentTime > this.lyric[i][0]){
                        $('.lyric ul').css({
                            "top" : $('.lyric').height() / 2 - 26 * (i + 1)
                        })
                        // $('.lyric ul li').removeClass('cur');
                        // $('.lyric ul li').eq(i).addClass('cur');
                    }
                }
            },
            gotoTime(e){
                $('.audio')[0].currentTime = (e.offsetX / $('.duration').width()) * $('.audio')[0].duration
            },
            changePlayState(){
                //点击切换播放模式
                if(this.playState === 'all'){
                    this.playState = 'random'
                }else if(this.playState === 'random'){
                    this.playState = 'once'
                }else if(this.playState === 'once'){
                    this.playState = 'all'
                }
            },
            pause_play(){
                //暂停和播放
                this.isPlay = !this.isPlay;
                if(this.isPlay != true){
                    $('.audio')[0].pause(); //暂停
                    //暂停的时候将变为设为默认（true）方便给定时器使用。
                    this.isAddClass = true
                }else{
                    $('.audio')[0].play(); //播放
                }
            },
            changeMusic(index){
                 // 下一首（单曲播放或专辑播放）
                if(this.$store.state.audio.albumIndex == null){
                    this.$store.commit("CHANGEMUSIC", {
                        index : index,
                        playerbg : this.audio.album[index].playerbg,
                        albumImg : this.audio.album[index].singerImg
                    })
                }else if(typeof this.$store.state.audio.albumIndex == 'number'){
                    this.$store.commit("CHANGEMUSIC", {
                        index : index,
                        playerbg : this.audio.playerbg,
                        albumImg : this.audio.albumImg
                    })
                }
            },
            goNext(){
                //根据播放逻辑切换歌曲，只要不是随机模式，点击的时候一律下一首可循环播放
                if(this.playState === 'random'){
                    var index = ~~(Math.random() * this.audio.album.length);
                    this.changeMusic(index)
                }else{
                    if(this.playerIndex >= this.audio.album.length - 1){
                        this.changeMusic(0)
                    }else{
                        this.changeMusic(this.audio.index + 1)
                    }
                }
            },
            goPrev(){
                //根据播放逻辑切换歌曲，只要不是随机模式，点击的时候一律下一首可循环播放
                if(this.playState === 'random'){
                    var index = ~~(Math.random() * this.audio.album.length);
                    this.changeMusic(index)
                }else{
                    if(this.playerIndex <= 0){
                        this.changeMusic(this.audio.album.length - 1)
                    }else{
                        this.changeMusic(this.audio.index - 1)
                    }
                }
            },
            playList(index){
                // 播放列表的歌曲
                this.changeMusic(index)
            },
            hideLyric(){
                this.isShowLyric = false;
            },
            showLyric(){
                //显示歌曲，并发出请求得到歌词
                this.isShowLyric = true;
                this.$http.get(this.audio.album[this.playerIndex].musicLyric).then((res) => {
                    this.lyric = this.parseLyric(res.data)
                })
            },
            parseLyric(lyric){
                var arr = []
                //换成一行，放到数组中
                var lines = lyric.split(/\n/);

                //得到时间
                var getLyricTime = /\[\d{2}:\d{2}.\d{2}\]/g;
                //得到有时间的歌词
                while(!getLyricTime.test(lines[0])){
                    lines = lines.splice(1)
                }

                lines.forEach(item=>{
                    //得到时间和歌词的分界点
                    var index = item.indexOf("]");
                    //字符串方法截取，得到时间
                    var time = item.substr(1,index-1);
                    // 将这样的时间03:13.61转换成['03','13.08']

                    var timeArr = time.split(':')

                    //得到歌词
                    var geci = item.substr(index + 1);
                    //['120','爱上对方就哭了'] 将处理过的歌词放进arr数组
                    arr.push([timeArr[0] * 60 + parseFloat(timeArr[1]), geci])

                    arr.sort((a,b)=>{
                        return a[0] - b [0]
                    })
                })

                return arr;
            }
        },
        filters:{
            zhuanhuan(s){
                var t;
                if(s > -1){
                    //向下取整，计算分
                    var min = Math.floor(s / 60) % 60;
                    var sec = s % 60; //计算出0 ~ 59秒

                    if(min < 10){t += "0";}
                    t = min + ":";
                    if(sec < 10){t += "0";}
                    t += ~~sec;
                }
                return t;
            }
        },
        //监听换歌，切换歌曲（重新请求歌词）
        watch:{
            playerIndex(){
                this.$http.get(this.audio.album[this.playerIndex].musicLyric).then((res) => {
                    this.lyric = this.parseLyric(res.data)
                })
            },
            '$store.state.audio.albumIndex'(){
                this.$http.get(this.audio.album[this.playerIndex].musicLyric).then((res) => {
                    this.lyric = this.parseLyric(res.data)
                })
            }
        }
    };
</script>
<style scoped lang='stylus' src="./autoplayer.styl"></style>