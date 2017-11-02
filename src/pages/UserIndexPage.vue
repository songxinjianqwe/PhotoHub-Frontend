<template>
  <el-container  >
    <el-aside class="aside" v-loading.fullscreen.lock="fullscreenLoading">
      <div class="user-info">
        <img :src="user.avatar" />
        <h2>{{user.username}}</h2>
        <div v-text="user.introduction"></div>
      </div>
    </el-aside>
    <el-main id="main-moments">
      <moment v-for="item in moments" :key="item.id" :moment="item"></moment>
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
  mounted() {
    this.fetchUser()
    document
      .getElementById('main-moments')
      .addEventListener('scroll', this.throttle(this.bindScroll, 1000))
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
</style>
