import {mapGetters} from 'vuex'
import {XDialog} from 'vux'
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
            },
            empty:'',
            code:'',
            showDialog:false,
            canSendCode:true
        }
    },
    components:{
        XDialog
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
                    let _list = res.data.data.friendsInfo
                    // 合并数组
                    this.friendsList = _list
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
            if(val) {
                this.keywords = val
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
                            this.empty = '没有查询到您所输入的用户'
                        }
                    }
                })
            } else {
                this.empty = null
            }
        },
        sendCode(){
            if(!this.canSendCode) return false
            let params = Qs.stringify({
                type:11
            })
            this.$axios.post('/customer/service/send-sms',params).then((res)=>{
                if(res.data.code === 200) {
                    this.$vux.toast.show({
                        text:'验证码发送成功',
                        type:'success'
                    })
                }
            })
            let reset = 60
            let timer = setInterval(()=>{
                reset--;
                this.canSendCode = false
                this.codeTxt = `${reset}秒后重新发送`
                if(reset<=0){
                    clearTimeout(timer)
                    this.canSendCode = true
                    this.codeTxt = '获取验证码'
                }
            },1000)
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