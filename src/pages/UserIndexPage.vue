<template>
  <el-container v-loading.fullscreen.lock="fullscreenLoading">
    <el-aside class="aside">
      <div class="user-info">
        <img :src="user.avatar" />
        <h2>{{user.username}}</h2>
        <div v-text="user.introduction"></div>
      </div>
    </el-aside>
    <el-main id="main-moments">
      <moment class="moment" v-for="item in moments" :key="item.id" :moment="item" from="user-index"></moment>
      <el-button @click="fetchMoments">加载更多</el-button>
    </el-main>
  </el-container>
</template>

<script>
const userIndexPattern = new RegExp('/users/\\d+\\/index')
import Moment from '@/components/moment/Moment'
export default {
  data() {
    return {
      user: {},
      loginResult: {},
      moments: [],
      page: 1,
      totalPages: 1,
      fullscreenLoading: true
    }
  },
  methods: {
    fetchUser() {
      this.loginResult = JSON.parse(localStorage.getItem('loginResult'))
      let header = { Authentication: this.loginResult.token }
      this.axios
        .get(`/users/${this.$route.params.id}`, { headers: header })
        .then(response => {
          this.user = response.data
          this.fetchMoments()
        })
        .catch(error => {
          throw error
        })
    },
    fetchMoments() {
      if (this.page > this.totalPages) {
        this.$message({
          showClose: true,
          message: '已无更多动态',
          type: 'warning'
        })
        return
      }
      let params = {
        user_id: this.user.id,
        page: this.page,
        'per-page': this.DEFAULE_PER_PAGE
      }
      let headers = { Authentication: this.loginResult.token }
      this.axios
        .get('/moments', {
          params: params,
          headers: headers
        })
        .then(response => {
          this.totalPages = response.data._meta.pageCount
          this.moments = this.moments.concat(response.data.items)
          console.log(this.moments)
          this.page++
          this.$message({
            message: '加载动态完毕',
            type: 'success'
          })
          this.fullscreenLoading = false
        })
        .catch(error => {
          throw error
        })
    },
    bindScroll() {
      if (
        this.isScrollInBottom(document.getElementById('main-moments')) &&
        userIndexPattern.test(this.$route.path)
      ) {
        console.log('UserIndexPage bindScroll triggered...')
        this.$message('加载中...')
        this.fetchMoments()
      }
    }
  },
  components: {
    Moment
  },
  //document绑定eventlistener可以在created，document中的某个文档元素绑定eventlistener必须在mounted之后
  mounted() {
    document
      .getElementById('main-moments')
      .addEventListener('scroll', this.throttle(this.bindScroll, 2000))
  },
  //在/users/:id/index <=> 其他页面 之间跳转时被调用
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
#main-moments {
  margin-left: 200px;
  height: 507px;
  overflow: auto;
}
.moment{
  width: 600px;
  overflow: hidden;
}
</style>
