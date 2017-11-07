<<template>
  <div>
    <!-- 左上侧：发表 -->
    <div v-if="_isLogin()" class="post-block">
        <ul class="post-nav">
        <li class="avatar-li">
            <user-avatar-uplpad v-if="user !== null" :avatar="user.avatar" @avatar-upload-success="onAvatarUploadSuccess"></user-avatar-uplpad>
        </li>
        <li class="moment-li" @click="momentNewDialogVisible = true">发表动态</li>
        <li class="album-li" @click="albumNewDialogVisible = true">创建相册</li>
        </ul>
    </div>
    
    <!-- 左下侧：动态 -->
    <!-- 父组件向子组件传值既可以通过props，也可以通过事件 -->
    <div class="feed-block" v-loading="loadingMoments">
        <moment class="moment" v-for="item in feed" :key="item.id" :moment="item" from="feed"></moment>
        <el-button @click="fetchFeed">加载更多</el-button>
    </div>
    
    <!-- 返回顶部Dialog -->
    <div id="to_top" @click="toTop">返回顶部</div>
      
    <!-- 新增动态Dialog -->
    <el-dialog title="新增动态" :visible.sync="momentNewDialogVisible" width="70%">
      <moment-new  @moment-new-success="onMomentNewSuccess"></moment-new>
    </el-dialog>
  
    <!-- 新增AlbumDialog -->
    <el-dialog title="新增相册" :visible.sync="albumNewDialogVisible" width="30%">
      <album-new @album-new-success="onAlbumNewSuccess"></album-new>
    </el-dialog>
  </div>
</template>

<script>
import MomentNew from '@/components/moment/MomentNew'
import AlbumNew from '@/components/album/AlbumNew'
import Moment from '@/components/moment/Moment'
import UserAvatarUplpad from '@/components/user/UserAvatarUpload'

export default {
  props: ['user'],
  data() {
    return {
      feed: [],
      feedPage: 1,
      isUserFeedNotEnough: false,
      momentNewDialogVisible: false,
      albumNewDialogVisible: false,
      loadingMoments: true,
      fetchComplete: true
    }
  },
  methods: {
    onAvatarUploadSuccess(avatar) {
      this.user.avatar = avatar
      this.axios
        .put(`/users/${this._id()}`, this.user)
        .then(response => {
          console.log('用户头像更新完毕')
          this.$message({
            type: 'success',
            message: '头像更换成功!'
          })
          this.$emit('user-update', response.data)
        })
        .catch(error => {
          throw error
        })
    },
    toTop() {
      //设置定时器
      let timer = setInterval(function() {
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
    onMomentNewSuccess(newMoment) {
      this.$message({
        message: '发表成功',
        type: 'success'
      })
      this.momentNewDialogVisible = false
      this.feed.unshift(newMoment)
    },
    onAlbumNewSuccess(albumId) {
      this.$message({
        message: '创建成功',
        type: 'success'
      })
      this.albumNewDialogVisible = false
      this.$router.push(`/albums/${albumId}`)
    },
    processFeedResponse(response, type) {
      this.fetchComplete = true
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
      if (!this.fetchComplete) {
        return
      }
      this.$message('加载中...')
      this.fetchComplete = false
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
            this.fetchComplete = true
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
            this.loadingMoments = false
            this.fetchComplete = true
            throw error
          })
      }
    }
  },
  components: {
    MomentNew,
    AlbumNew,
    Moment,
    UserAvatarUplpad
  },
  created() {
    this.fetchFeed()
    this.$nextTick(() => {
      this.$on('feed-fetch', this.fetchFeed)
    })
  }
}
</script>

<style scoped>
.post-block {
  margin-bottom: 200px;
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
  background: url(../../assets/index/moment-new.png) no-repeat;
}
.album-li {
  background: url(../../assets/index/album-new.png) no-repeat;
}
.moment {
  width: 600px;
  overflow: hidden;
}
.feed-block {
  margin-top: 20px;
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
