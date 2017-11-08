<template>
  <el-container>
    <el-aside class="aside">
      <div class="user-info" v-loading="userLoading">
        <img :src="user.avatar" />
        <h2>{{user.username}}</h2>
        <div v-text="user.introduction"></div>
        <div>
          <el-menu class="menu" :default-active="$route.path" :router="true" text-color="#000000">
            <el-menu-item :index="`/users/${$route.params.id}/index`">
              <i class="el-icon-menu"></i>
              <span slot="title">查看主页</span>
            </el-menu-item>
            <el-menu-item :index="`/users/${$route.params.id}/albums`">
              <i class="el-icon-document"></i>
              <span slot="title">查看相册</span>
            </el-menu-item>
            <follow-button :target="user.id"></follow-button>
          </el-menu>
        </div>
      </div>
    </el-aside>
    <!-- 右侧 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </el-container>
</template>

<script>
import FollowButton from '@/components/follow/FollowButton'
export default {
  data() {
    return {
      user: {},
      userLoading: false
    }
  },
  methods: {
    fetchUser() {
      this.userLoading = true
      this.axios
        .get(`/users/${this.$route.params.id}`)
        .then(response => {
          this.user = response.data
          this.userLoading = false
        })
        .catch(error => {
          this.userLoading = false
          throw error
        })
    }
  },
  components:{
    FollowButton
  },
  //在/users/:id/index或albums <=> 其他页面 之间跳转时被调用
  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log('beforeRouteEnter:跳转至', to.path)
      vm.fetchUser()
    })
  }
}
</script>

<style scoped>
.aside {
  width: 300px;
  height: 507px;
  text-align: center;
  background: url('../assets/user/user-index.png') no-repeat;
}
.user-info {
  margin-top: 50px;
  color: cyan;
}
.user-info img {
  width: 100px;
  height: 100px;
}
.menu {
  background-color: rgba(0, 0, 0, 0);
}
</style>
