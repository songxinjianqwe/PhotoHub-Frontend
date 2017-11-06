<template>
  <div>
    <!-- 主要内容 -->
    <div class="index-wrap">
      <!-- 左侧 -->
      <div class="index-left">
        <keep-alive>
          <router-view @fetch-feed="fetchFeed" @user-update="onUserUpdate" :loadingMoments="loadingMoments" :feed="feed" :user="user" :copiedUser="copiedUser" :avatar="avatar">
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
      feed: [],
      feedPage: 1,
      top10Tags: {},
      user: null,
      isUserFeedNotEnough: false,
      avatar: require('../assets/index/avatar.png'),
      loadingMoments: true
    }
  },
  methods: {
    onUserUpdate(newUser) {
      this.user = newUser
      this.$router.push('/')
    },
    processFeedResponse(response, type) {
      if (response.data.items.length === 0) {
        console.log('本次读取条数为0，重新读取热门动态')
        this.isUserFeedNotEnough = true
        this.feedPage = 1
        this.fetchFeed()
        return
      }
      response.data.items.forEach(item => {
        item['type'] = type
        this.feed.push(item)
      })
      console.log('获取动态成功')
      console.log(this.feed)
      this.$message({
        message: '加载动态完毕',
        type: 'success'
      })
      //已经读完
      if (response.data.items.length < this.DEFAULE_PER_PAGE) {
        console.log('本次读取条数少于一页，下次读取热门动态')
        this.isUserFeedNotEnough = true
        this.feedPage = 1
      } else {
        this.feedPage++
      }
      this.loadingMoments = false
    },
    fetchFeed() {
      //如果登录并且自己的feed没有读取完毕，那么读取用户feed；否则读取热门动态
      if (this._isLogin() && !this.isUserFeedNotEnough) {
        console.log('获取用户动态')
        let params = { page: this.feedPage, 'per-page': this.DEFAULE_PER_PAGE }
        this.axios
          .get(`/users/${this._id()}/feed`, {
            params: params
          })
          .then(response => {
            this.processFeedResponse(response, 'user')
          })
          .catch(error => {
            this.loadingMoments = false
            throw error
          })
      } else {
        console.log('获取热门动态')
        let params = { page: this.feedPage, 'per-page': this.DEFAULE_PER_PAGE }
        this.axios
          .get('/moments/hot', { params: params })
          .then(response => {
            this.processFeedResponse(response, 'hot')
          })
          .catch(error => {
            throw error
          })
      }
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
          if (this.user.avatar !== null) {
            this.avatar = this.user.avatar
          }
        })
        .catch(error => {
          throw error
        })
    },
    bindScroll() {
      if (this.isScrollInBottom() && this.$route.path === '/') {
        console.log('bindScroll triggered...')
        this.$message('加载中...')
        this.fetchFeed()
      }
    }
  },
  created() {
    if (this.$route.path === '/') {
      this.fetchFeed()
    }
    this.fetchTopTags()
    this.fetchUser()
    window.addEventListener('scroll', this.throttle(this.bindScroll, 5000))
  },
  computed: {
    copiedUser() {
      return Object.assign({}, this.user)
    }
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