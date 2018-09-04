<template>
    <div class="albumPage" v-if="player.isShowAlbum">
        <div class="header" :style="{background:`url(${player.album.albumbg}) 0 0/100% 100%`}">
            <header>
                <span class="iconfont icon-houtui1" @click="hideAlbum"></span>
                {{player.album.albumTitle}}
            </header>
            <div class="content">
                <div class="albumImg">
                    <img :src="player.album.albumImg">
                </div>
                <div class="albumDetail">
                    <p class="albumTitle">专辑：{{player.album.albumTitle}}</p>
                    <p class="singer">
                        <img :src="player.album.albumImg" width="30">
                        <span>歌手：{{player.album.albumSinger}}</span>
                    </p>
                </div>
            </div>
            <ul class="setting">
                <li class="iconfont icon-addfile"></li>
                <li class="iconfont icon-BAI-pinglun"></li>
                <li class="iconfont icon-fenxiang1"></li>
                <li class="iconfont icon-icon--"></li>
            </ul>
        </div>
        <div class="albumList" v-height="280">
            <ul>
                <li v-for="(item,index) in player.album.albumList" @click="playAudio(player.album.albumList,index)" :class="{cur:index == $store.state.audio.index && albumIndex == $store.state.audio.albumIndex}">
                    <span class="index">{{index + 1}}</span>
                    <div>
                        <p>{{item.musicName}}</p>
                        <p>{{item.musicSinger}}</p>
                    </div>
                    <span class="iconfont icon-laba"></span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    props: ["player"],
    computed:{
        //得到播放第几张专辑
        albumIndex(){
            return this.$store.state.player.index
        }
    },
    methods:{
        hideAlbum(){
            this.$store.commit("HIDEALBUM",{isShowAlbum:false})
        },
        playAudio(itemList,index){
            //点击显示播放器 itemList时专辑的数组，index 时点击专辑里面的第几首歌曲
            this.$store.commit("SHOWPLAYER",{
                isShowAudio:true,    //显示播放器界面
                album:itemList,      //专辑的列表
                index:index,         //专辑列表歌曲的下标
                albumImg:this.player.album.albumImg,   //专辑作者头像
                playerbg:this.player.album.playerbg,   //播放器背景图
                //设置播放的第几张专辑 对应0 1 2 3 ~~
                albumIndex:this.albumIndex
            })
        }
    }
};
</script>
<style scoped lang='stylus'>
.albumPage {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    z-index: 1;
    .header {
        height: 280px;
        header {
            position: relative;
            color: #fff;
            height: 50px;
            line-height: 50px;
            text-align: center;
            span.icon-houtui1 {
                position: absolute;
                top: 0;
                left: 0;
                width: 50px;
                height: 50px;
                font-size: 26px;
            }
        }
        .content{
            padding:5% 3.5%;
            overflow hidden;
            .albumImg{
                width 35%;
                float left
                img{
                    width 100%
                }
            }
            .albumDetail{
                width 65%
                padding-left:3%;
                float left
                color:#fff;
                p.albumTitle{
                    height 30px
                    line-height 30px
                    margin:3px 0;
                }
                p.singer{
                    height 30px
                    img{
                        width 30px
                        border-radius:50%;
                        float left
                        margin-right 10px;
                    }
                    span{
                        float left
                        line-height 30px
                    }
                }
            }
        }
        .setting{
            overflow hidden
            li{
                float left
                width 25%
                height 50px
                line-height 50px
                text-align center
                font-size 36px
                color #fff
                overflow hidden

            }
        }
    }
    .albumList {
        overflow-y:scroll;
        ul {
            li {
                overflow: hidden;
                padding-top: 5px;
                .index {
                    width: 50px;
                    height: 50px;
                    line-height: 50px;
                    text-align: center;
                    float: left;
                }
                div {
                    float: left;
                    p {
                        height: 25px;
                        line-height: 25px;
                    }
                    p:nth-child(1) {
                        font-size: 16px;
                        color: #4b4c4d;
                    }
                    p:nth-child(2) {
                        font-size: 14px;
                        color: #888;
                    }
                }
                .icon-laba {
                    height: 50px;
                    width: 50px;
                    line-height: 50px;
                    text-align: center;
                    float: right;
                    font-size: 26px;
                }
            }
            li.cur {
                color: red;
                div {
                    p {
                        color: red;
                    }
                }
            }
        }
    }
}
</style>