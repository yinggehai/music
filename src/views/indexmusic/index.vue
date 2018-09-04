<template>
    <div class="indexmusic" v-height="50">
        <swiper :swiperArr="swiperArr"></swiper>
        <div class="album">
            <h3>推荐专辑</h3>
            <ul>
                <li v-for="(item,index) in album" @click="showAlbum(item,index)">
                    <img :src="item.albumImg">
                    <p>{{item.albumTitle}}</p>
                </li>
            </ul>
        </div>

        <div class="recommend">
            <h3>热歌列表</h3>
            <!-- {{recommend}} -->
            <ul>
                <li v-for="(item,index) in recommend" @click="playRecommend(recommend,index)" :class="{cur:index == $store.state.audio.index && $store.state.audio.albumIndex == null}">
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
import swiper from "../../components/swiper.vue";
export default {
    data() {
        return {
            //轮播图的数组
            swiperArr: [
            {
                imgSrc:
                "http://p1.music.126.net/TJu1Rwbv-NJ6L6tQk-Sb9Q==/109951163459876072.jpg"
            },
            {
                imgSrc:
                "http://p1.music.126.net/fWAfYctPDbUlbdanKuGCkg==/109951163459718599.jpg"
            },
            {
                imgSrc:
                "http://p1.music.126.net/Io3YShsa0l0TwOPCf4M-SQ==/109951163459705298.jpg"
            },
            {
                imgSrc:
                "http://p1.music.126.net/UTKOeNMpx7Fm9-vZ6-yesA==/109951163459741228.jpg"
            }]
        };
    },
    components: {
        swiper
    },
    created(){
        this.$store.dispatch("GETALL"); //请求data.json的数据
    },
    methods:{
        showAlbum(item,index){
            //点击传入item整张专辑的数据和第 点击的是第几张专辑
            this.$store.commit("SHOWORHIDEALBUM", {
                isShowAlbum:true,
                album:item,
                index:index
            })
        },
        playRecommend(recommend,index){
            this.$store.commit("SHOWPLAYER", {
                //显示播放界面
                isShowAudio:true,
                //单曲的列表
                album:recommend,
                //当前歌曲的下标
                index:index,
                //歌曲作者头像
                albumImg: recommend[index].singerImg,
                //播放背景的图片
                playerbg: recommend[index].playerbg,
                //将专辑的下标设置为null，表示播放的是单曲
                albumIndex:null
            })
        }
    },
    computed:{
        album(){
            // 得到专辑列表
            return this.$store.state.mapList.album;
        },
        recommend(){
            // 得到热歌单曲列表
            return this.$store.state.mapList.recommend;
        }
    }
};
</script>
<style scoped lang='stylus'>
.indexmusic {
    overflow-y:scroll;
    h3 {
        font-weight: normal;
        font-size: 18px;
        height: 40px;
        line-height: 40px;
    }
    h3:before {
        content: '|';
        color: #c20c0c;
        background: #c20c0c;
        font-size: 15px;
        margin: 0 6px;
    }
    .album {
        ul {
            overflow: hidden;
            li {
                float: left;
                width: 33.333%;
                text-align: center;
                img {
                    width: 99%;
                    display: block;
                    padding: 1%;
                }
            }
        }
    }
    .recommend {
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