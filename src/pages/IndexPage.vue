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
              <img :src="avatar"></img>
            </li>
            <li class="moment-li" @click="momentNewDialogVisible = true">发表动态</li>
            <li class="album-li" @click="albumNewDialogVisible = true">创建相册</li>
          </ul>
        </div>
        <!-- 动态 -->
        <div class="feed-block">
          <moment v-for="item in feed.items" :key="item.id" :moment="item"></moment>
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

  </div>
</template>

<script>
import MessageNew from '@/components/message/MessageNew'
import AlbumNew from '@/components/album/AlbumNew'
import Moment from '@/components/moment/Moment'
import LoginForm from '@/components/user/LoginForm'
import UserMenu from '@/components/user/UserMenu'

export default {
  props: ['loginResult', 'isLogin'],
  data() {
    return {
      momentNewDialogVisible: false,
      albumNewDialogVisible: false,
      feed: {},
      feedPage: 1,
      top10Tags: {},
      user: {},
      avatar: require('../assets/index/avatar.png')
    }
  },
  methods: {
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
    fetchFeed() {
      if (this.isLogin) {
        let params = { page: this.feedPage, 'per-page': this.DEFAULE_PER_PAGE }
        let headers = { Authentication: this.loginResult.token }
        this.axios
          .get(`/users/${this.loginResult.id}/feed`, {
            params: params,
            headers: headers
          })
          .then(response => {
            this.feed = response.data
            console.log('获取用户feed成功')
            console.log(this.feed)
          })
          .catch(error => {
            throw error
          })
      } else {
        let params = { page: this.feedPage, 'per-page': this.DEFAULE_PER_PAGE }
        this.axios
          .get('/moments/hot', { params: params })
          .then(response => {
            this.feed = response.data
            console.log('热门动态获取成功')
            console.log(this.feed)
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
    }
  },
  created() {
    this.fetchFeed()
    this.fetchTopTags()
    this.fetchUser()
  },
  components: {
    MessageNew,
    AlbumNew,
    Moment,
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

.avatar-li img {
  width: 100px;
  height: 100px;
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
</style>