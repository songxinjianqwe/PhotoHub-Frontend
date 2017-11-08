<template>
    <el-container direction="horizontal">
        <el-aside class="aside" width="160px">
            <el-menu class="menu" default-active="User" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" @select="select">
                <el-menu-item index="User">
                    <span slot="title">用户管理</span>
                </el-menu-item>
                <el-menu-item index="Activity">
                    <span slot="title">活动管理</span>
                </el-menu-item>
                <el-menu-item index="Moment">
                    <span slot="title">动态管理</span>
                </el-menu-item>
                <el-menu-item index="Album">
                    <span slot="title">相册管理</span>
                </el-menu-item>
                <el-menu-item index="Tag">
                    <span slot="title">标签管理</span>
                </el-menu-item>
                <el-menu-item index="Follow">
                    <span slot="title">关注管理</span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-main class="main-content">
            <keep-alive>
                <component :is="view"></component>
            </keep-alive>
        </el-main>
    </el-container>
</template>

<script>
import User from '@/components/manage/user/User'
import Activity from '@/components/manage/activity/Activity'
import Album from '@/components/manage/album/Album'
import Follow from '@/components/manage/follow/Follow'
import Tag from '@/components/manage/tag/Tag'
import Moment from '@/components/manage/moment/Moment'
export default {
  data() {
    return {
      view: 'User'
    }
  },
  methods: {
    select(index) {
      this.view = index
    }
  },
  components: {
    User,
    Activity,
    Album,
    Follow,
    Tag,
    Moment
  }
}
</script>

<style scoped>
.menu {
  text-align: center;
  height: 507px;
}
.main-content {
  float: left;
}
</style>
