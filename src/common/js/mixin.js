import {mapGetters} from 'vuex'
import Qs from 'qs'
export const friendsListMixin = {
    data(){
        return {
            ready:true,
            listParams:{
                loading:false,
                nomore:false,
                page:1, //初始搜索页码
                number:10 //每页返回数据
            }
        }
    },
    methods:{
        searchFriends(){
            let params = Qs.stringify({
                page:this.listParams.page,
                number:this.listParams.number,
                keywords:this.keywords,
                fromLevel:'member',//'需要的人脉的最低级别'
                toLevel:this.checkType==='generalAgent'?'vip':'member'//'需要的人脉的最高级别'
            })
            this.$axios.post('/customer/service/search-friends',params).then((res)=>{
                if(res.data.code === 200) {
                    this.ready = true
                    // 原来已请求到的
                    let friendsList = this.friendsList
                    // 本次请求的
                    let _list = res.data.data.friendsInfo
                    // 合并数组
                    this.friendsList = friendsList.concat(_list)
                    // 如果本次请求到的为空则禁止滚动加载
                    if(!_list.length){
                        this.listParams.loading = false
                        this.listParams.nomore = true
                    }
                }
            })
        },
        handleKeyWords(val){
            // input值改变后重置page相关参数
            this.listParams.nomore = false
            this.listParams.page = 1
            this.friendsList = []
            this.keywords = val
            this.searchFriends()
        },
        // 滚动加载更多
        loadMore(){
            if(!this.keywords) return
            if(!this.listParams.nomore){
                this.listParams.page++;
                this.listParams.loading = true
                this.searchFriends()
            } else {
                this.listParams.loading = false
            }
        }
    },
    computed:{
        ...mapGetters([
            'userInfo'
        ])
    }
}