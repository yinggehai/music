<template>
    <div id="app">
        <div class="header">
            <span class="iconfont icon-caidan menu"></span>
            <header>
                <ul>
                    <li class="iconfont"
                        :class="[item.fontClass, {cur:$route.name == item.fontClass}]" v-for="item in tabNav"
                        @click="routerGo(item.url)"
                    >
                    </li>
                </ul>
            </header>
            <span class="iconfont icon-zhuanjiguangpan" @click="showPlayer"></span>
        </div>
        <!-- https://cn.vuejs.org/v2/guide/transitions.html -->
        <transition name="haha">
            <router-view/>
        </transition>
        <transition name="haha">
            <album :player="player"></album>
        </transition>
        <transition name="haha">
            <audioplayer :audio="audio" v-show="audio.isShowAudio"></audioplayer>
        </transition>
    </div>
</template>
<script>
    import album from "./components/album.vue";
    import audioplayer from "./components/audioplayer.vue";
    export default {
        data(){
            return {
                tabNav:[
                    {url:'/indexmusic', fontClass:'icon-music'},
                    {url:'/faxianmusic',fontClass:'icon-wangyiyunyinlezizhi-copy'},
                    {url:'/radiomusic', fontClass:'icon-diantai'}
                ]
            }
        },
        methods:{
            routerGo(url){
                this.$router.push({path:url})
            },
            //显示播放器界面
            showPlayer(){
                this.$store.commit("SHOWORHIDEPLAYER",{isShowAudio:true})
            }
        },
        computed:{
            player(){
                return this.$store.state.player;
            },
            audio(){
                return this.$store.state.audio;
            }
        },
        components:{
            album,
            audioplayer
        }
    };
</script>
<style scoped lang='stylus'>
    #app{
        width: 100%;height: 100%;overflow: hidden;
    }
    .header{
        position:relative;color:#fff;
        .menu,.icon-zhuanjiguangpan{
            width:50px;height:50px;line-height:50px;font-size:26px;position: absolute;
            top:0;left:0;text-align: center;
        }
        header{
            height:50px;line-height:50px;background:#c20c0c;
            ul{
                overflow:hidden;width:60%;margin:0 auto;
                li{font-size:26px;width:33.333%;float:left;text-align:center;}
                li.cur{background:#9b0909;}
            }
        }
        .icon-zhuanjiguangpan{right:0;left:auto;}

    }
</style>
