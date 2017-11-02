<template>
    <el-container>
        <el-aside class="aside">
            <div class="user-info">
                <img :src="user.avatar" />
                <h2>{{user.username}}</h2>
                <div v-text="user.introduction"></div>
            </div>
        </el-aside>
        <el-main class="main-moments">
            <moment v-for="item in moments" :key="item.id" :moment="item"></moment>
        </el-main>
    </el-container>
</template>

<script>
const userIndexPattern = new RegExp('\/users\/\\d+\\/index')
import Moment from '@/components/moment/Moment'
export default {
  data() {
    return {
      user: {},
      loginResult: {},
      moments: [],
      page: 1
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
          if (response.data.items.length === 0) {
            this.$message({
              showClose: true,
              message: '已无更多动态',
              type: 'warning'
            })
            return
          }
          this.moments = this.moments.concat(response.data.items)
          console.log(this.moments)
          this.page++
          this.$message({
            message: '加载动态完毕',
            type: 'success'
          })
        })
        .catch(error => {
          throw error
        })
    },
    bindScroll() {
      console.log('bindScroll triggered...')
      console.log('userIndexPattern.test(this.$route.path)',userIndexPattern.test(this.$route.path));
      if (this.isScrollInBottom() && userIndexPattern.test(this.$route.path)) {
        this.$message('加载中...')
        this.fetchMoments()
      }
    }
  },
  components: {
    Moment
  },
  created() {
    this.fetchUser()
    window.addEventListener('scroll', this.bindScroll)
  }
}
</script>

<style scoped>
.aside {
  width: 300px;
  height: 507px;
  background-color: rgb(238, 241, 246);
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
.main-moments {
  margin-left: 200px;
  height: 507px;
  overflow: auto;
}
</style>
