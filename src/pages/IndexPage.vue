<template>
  <div>
    <!-- 主要内容 -->
    <div class="index-wrap">
      <!-- 左侧 -->
      <div class="index-left">
        <!-- 发表 -->
        <div class="post-block">
          <ul class="post-nav">
            <li class="avatar-li">
              <user-avatar-uplpad :avatar="avatar" :loginResult="loginResult" @avatar-upload-success="onAvatarUploadSuccess"></user-avatar-uplpad>
            </li>
            <li class="moment-li" @click="momentNewDialogVisible = true">发表动态</li>
            <li class="album-li" @click="albumNewDialogVisible = true">创建相册</li>
          </ul>
        </div>
        <!-- 动态 -->
        <div class="feed-block" v-loading="loadingMoments">
          <moment v-for="item in feed" :key="item.id" :moment="item"></moment>
          <el-button @click="fetchFeed">加载更多</el-button>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="index-right">
        <div class="user-block">
          <user-menu v-if="isLogin" :loginResult="loginResult"></user-menu>
          <login-form v-else></login-form>
        </div>
        <div class="top-moments">
          <router-link to="/tags">
            <h2>热门标签</h2>
          </router-link>
          <ul>
            <li v-for="tag in top10Tags.items" :key="tag.id">{{tag.name}}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 新增动态Dialog -->
    <el-dialog title="新增动态" :visible.sync="momentNewDialogVisible" width="70%">
      <message-new :loginResult="loginResult" @moment-new-success="onMomentNewSuccess"></message-new>
    </el-dialog>

    <!-- 新增AlbumDialog -->
    <el-dialog title="新增相册" :visible.sync="albumNewDialogVisible" width="30%">
      <album-new :loginResult="loginResult" @album-new-success="onAlbumNewSuccess"></album-new>
    </el-dialog>

    <!-- 返回顶部Dialog -->
    <div id="to_top" @click="toTop">返回顶部</div>

  </div>
</template>

<script>
import MessageNew from '@/components/message/MessageNew'
import AlbumNew from '@/components/album/AlbumNew'
import Moment from '@/components/moment/Moment'
import LoginForm from '@/components/user/LoginForm'
import UserMenu from '@/components/user/UserMenu'
import UserAvatarUplpad from '@/components/user/UserAvatarUpload'

export default {
  props: ['loginResult', 'isLogin'],
  data() {
    return {
      momentNewDialogVisible: false,
      albumNewDialogVisible: false,
      feed: [],
      feedPage: 1,
      top10Tags: {},
      user: {},
      avatar: require('../assets/index/avatar.png'),
      isUserFeedNotEnough: false,
      loadingMoments: true
    }
  },
  methods: {
    onAvatarUploadSuccess(avatar) {
      this.avatar = avatar
      this.user.avatar = avatar
      this.axios
        .put(`/users/${this.loginResult.id}`, this.user)
        .then(response => {
          console.log('用户更新完毕')
        })
        .catch(error => {
          throw error
        })
    },
    toTop() {
      //设置定时器
      setInterval(function() {
        //获取滚动条距离顶部高度
        let osTop =
          document.documentElement.scrollTop || document.body.scrollTop
        let ispeed = Math.floor(-osTop / 7)
        document.documentElement.scrollTop = document.body.scrollTop =
          osTop + ispeed
        //到达顶部，清除定时器
        if (osTop == 0) {
          clearInterval(timer)
        }
        isTop = true
      }, 30)
    },
    onMomentNewSuccess(momentId) {
      this.$message({
        message: '发表成功',
        type: 'success'
      })
      this.momentNewDialogVisible = false
      this.$router.push(`/users/${this.loginResult.id}/moments/${momentId}`)
    },
    onAlbumNewSuccess(albumId) {
      this.$message({
        message: '创建成功',
        type: 'success'
      })
      this.albumNewDialogVisible = false
      this.$router.push(`/users/${this.loginResult.id}/albums/${albumId}`)
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
      if (this.isLogin && !this.isUserFeedNotEnough) {
        console.log('获取用户动态')
        let params = { page: this.feedPage, 'per-page': this.DEFAULE_PER_PAGE }
        let headers = { Authentication: this.loginResult.token }
        this.axios
          .get(`/users/${this.loginResult.id}/feed`, {
            params: params,
            headers: headers
          })
          .then(response => {
            this.processFeedResponse(response, 'user')
          })
          .catch(error => {
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
      if (!this.isLogin) {
        return
      }
      let header = { Authentication: this.loginResult.token }
      this.axios
        .get(`/users/${this.loginResult.id}`, { headers: header })
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
    this.fetchFeed()
    this.fetchTopTags()
    this.fetchUser()
    window.addEventListener('scroll', this.throttle(this.bindScroll, 1000))
  },
  components: {
    MessageNew,
    AlbumNew,
    Moment,
    LoginForm,
    UserMenu,
    UserAvatarUplpad
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
.post-nav {
  position: relative;
  z-index: 9;
  margin: 0 0 18px;
  padding: 1px 2px 3px;
  background-position: 0 0;
}

.post-nav li {
  cursor: pointer;
  height: 100px;
  width: 100px;
  display: block;
  float: left; /* 往左浮动 */
  margin-right: 20px;
}

.avatar-li {
  position: relative;
  width: 100px;
  height: 100px;
  box-sizing: border-box;
  border: 4px solid #d9dde1;
  margin: 0 auto;
  text-align: center;
  overflow: hidden;
}

.moment-li {
  background: url(../assets/index/moment-new.png) no-repeat;
}
.album-li {
  background: url(../assets/index/album-new.png) no-repeat;
}

.feed-block {
  margin-top: 200px;
}

#to_top {
  width: 30px;
  height: 40px;
  padding: 20px;
  font: 14px/20px arial;
  text-align: center;
  background: #06c;
  position: absolute;
  cursor: pointer;
  color: #fff;
}
</style>