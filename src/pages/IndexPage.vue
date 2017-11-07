<template>
  <div>
    <!-- 主要内容 -->
    <div class="index-wrap">
      <!-- 左侧 -->
      <div class="index-left">
        <keep-alive>
          <router-view ref="view" @user-update="onUserUpdate" :user="user">
          </router-view>
        </keep-alive>
      </div>
      <!-- 右侧 -->
      <div class="index-right">
        <!-- 右上侧登录块或用户信息块 -->
        <div class="user-block">
          <user-menu v-if="_isLogin()"></user-menu>
          <login-form v-else></login-form>
        </div>
        <!-- 右下侧标签块 -->
        <div class="top-moments">
          <router-link to="/tags">
            <h2>热门标签</h2>
          </router-link>
          <ul class="tag-ul">
            <router-link active-class="active" tag="li" v-for="tag in top10Tags.items" :key="tag.id" :to="`/tags/${tag.id}`">{{tag.name}}</router-link>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/user/LoginForm'
import UserMenu from '@/components/index/UserMenu'
export default {
  data() {
    return {
      top10Tags: {},
      user: null,
      avatar: require('../assets/index/avatar.png')
    }
  },
  methods: {
    onUserUpdate(newUser) {
      this.user = newUser
      this.$router.push('/')
    },
    fetchTopTags() {
      let params = { page: 1, 'per-page': 10 }
      this.axios
        .get('/tags/hot', { params: params })
        .then(response => {
          this.top10Tags = response.data
        })
        .catch(error => {
          throw error
        })
    },
    fetchUser() {
      if (!this._isLogin()) {
        return
      }
      this.axios
        .get(`/users/${this._id()}`)
        .then(response => {
          this.user = response.data
          console.log(this.user)
          if (this.user.avatar === null) {
            this.user.avatar = this.avatar
          }
        })
        .catch(error => {
          throw error
        })
    },
    bindScroll() {
      if (this.isScrollInBottom() && this.$route.path === '/') {
        console.log('bindScroll triggered...')
        //告诉Feed去fetch数据
        this.$refs.view.$emit('feed-fetch')
      }
    }
  },
  created() {
    this.fetchTopTags()
    this.fetchUser()
    window.addEventListener(
      'scroll',
      this.throttle(this.bindScroll, this.DEFAULE_LOAD_INTERVAL)
    )
  },
  components: {
    LoginForm,
    UserMenu
  }
}
</script>
<style scoped>
.index-wrap {
  width: 1200px;
  margin: 0 auto;
  overflow: hidden;
}
.index-left {
  float: left;
  width: 800px;
  text-align: left;
}
.index-right {
  float: left;
  margin-left: 50px;
}
.tag-ul {
  padding-left: 0px;
}
.tag-ul li {
  text-align: center;
  padding: 10px 0px;
  cursor: pointer;
  list-style-type: none;
}
.tag-ul li:hover {
  background: #4fc08d;
  color: #fff;
}
</style>