<template>
    <div>
        <swiper :options="swiperOption">
            <swiper-slide v-for="item in swiperArr" :key="item.imgSrc" >
                <img :src="item.imgSrc" >
            </swiper-slide>
            <div class="swiper-pagination"  slot="pagination"></div>
        </swiper>
    </div>
</template>
<script>
    export default {
        props:["swiperArr"],
        data(){
            return{
                //存放轮播图的配置
                swiperOption: {
                    pagination:{
                        el : '.swiper-pagination'
                    }
                }
            }
        }
    };
</script>
<style scoped lang='stylus'>
    img{width:100%;display: block;}
</style>