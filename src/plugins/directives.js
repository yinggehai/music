export default function(Vue){
    Vue.directive('height',{
        inserted(el,binding){
            if(binding.value == undefined){ //v-height没传值
                $(el).height($(window).height())
            }else{
                $(el).height($(window).height() - binding.value)
            }
        }
    })
}