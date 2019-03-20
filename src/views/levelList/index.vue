<template>
        <div>
            <search :checkType="checkType">
                <user-list :level="checkType"></user-list>
            </search>
        </div>
    </template>
    <script>
    import Search from '@/components/search/index'
    import UserList from '@/components/userList/index'
    export default {
        data(){
            return {
                checkType:'level'
            }
        },
        components:{
            Search,
            UserList
        }
    }
    </script>