import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import directives from './plugins/directives.js'

//轮播图插件：https://github.com/surmon-china/vue-awesome-swiper
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper)
Vue.use(Vuex)
Vue.use(VueAxios, axios)
Vue.use(directives)

Vue.config.productionTip = false

const store = new Vuex.Store({
    state:{
        mapList:[],
        player:{
            isShowAlbum:false,
            album:[],  //专辑的数据
            index:null //专辑的index
        },
        audio:{
            isShowAudio:false,  //播放界面的显示和隐藏
            album:[],       //专辑的数据
            index:null,     //第几首歌曲
            albumImg:null,  //专辑的图片，在热歌里面没有
            playerbg:null,  //播放器的背景图
            //专辑的index
            //null 表示播放单曲（热歌）
            //0     表示第一张专辑
            //1     表示第二张专辑，以此类推
            albumIndex:null

        }
    },
    mutations:{
        GETALL(state,payload){
            state.mapList = payload.mapList
        },
        SHOWORHIDEALBUM(state,payload){
            // 控制点击显示专辑页面（上树）
            state.player.isShowAlbum = payload.isShowAlbum;
            // 保存整张专辑的数据
            state.player.album = payload.album;
            // 保存专辑的下标
            state.player.index = payload.index;
        },
        HIDEALBUM(state, payload) {
            state.player.isShowAlbum = payload.isShowAlbum;
        },
        SHOWORHIDEPLAYER(state, payload) {
            state.audio.isShowAudio = payload.isShowAudio;
        },
        SHOWPLAYER(state, payload){
            //显示播放器
            state.audio.isShowAudio = payload.isShowAudio;
            //播放器里面的列表，有可能时单曲 有可能时专辑
            state.audio.album = payload.album;
            //先进显示播放器的时候，设置当前点击的是第几首歌曲
            state.audio.index = payload.index;
            //专辑或单曲作者的头像
            state.audio.albumImg = payload.albumImg;
            //播放器背景
            state.audio.playerbg = payload.playerbg;
            //专辑的index（第几张专辑）
            state.audio.albumIndex = payload.albumIndex;
        },
        CHANGEMUSIC(state,payload){
            state.audio.index = payload.index
            state.audio.albumImg = payload.albumImg
            state.audio.playerbg = payload.playerbg
        }
    },
    actions:{
        GETALL({commit}){
            //这里不能用this，因为this时store的实例，并不是vue的实例
            Vue.axios.get("../static/data.json").then((res) => {
                commit("GETALL", res.data)
            })
        }
    }
});

new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})
