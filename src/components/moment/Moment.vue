<<template>
    <div class="moment">
      <el-popover
        ref="comments"
        placement="top-start"
        title="评论"
        width="300"
        trigger="hover">
        <!-- 显示评论内容 -->
        <comment class="comment"  :loginResult="loginResult" :moment="moment"></comment>
      </el-popover>
      <!-- from可选值为user-moments,user-index和feed -->
      <!-- feed是显示在首页的，需要显示动态类型和点赞评论转发 -->
      <!-- user-index是显示在用户主页的 -->
      <!-- user-moments是显示在用户动态页的，需要显示编辑和删除 -->
      <div v-if="from === 'feed'">
        <router-link :to="`/users/${moment.user.id}/index`">
          <h4>{{moment.user.username}}</h4>
        </router-link>
        <span v-if="moment.type === 'user'">关注动态</span>  
        <span v-else>热门动态</span>
      </div>
      <router-link v-if="from !== 'moment-detail'" :to="`/moments/${moment.id}`">
        <span class="detail">查看详情</span>
      </router-link>
      <!-- 下面这部分是公共的 -->
      <time class="time">{{ moment.message.create_time }}</time>
      <span>来自相册:
        <router-link :to="`/users/${moment.user.id}/albums/${moment.album.id}`">{{moment.album.name}}</router-link>
      </span>
      <el-tag v-for="tag in moment.tags" :key="tag.id">
        <router-link :to="`/tags/${tag.id}`">
          {{tag.name}}
        </router-link>
      </el-tag>
      <div class="article" v-html="compiledMarkdown"></div>

      <!-- 显示在首页 -->
      <div v-if="from === 'feed' && loginResult !== null">
        <el-button v-show="!isVoted" @click="vote">点赞({{moment.message.votes.length}})</el-button>
        <el-button v-show="isVoted" @click="unVote">取消点赞({{moment.message.votes.length}})</el-button>
        <el-button @click="comment"  v-popover:comments>评论({{moment.message.comments.length}})</el-button>
        <el-button @click="forward">转发({{moment.message.forwards.length}})</el-button>
      </div>

      <!-- 显示在用户动态页 -->
      <div v-if="from === 'user-moments'">
        <el-button @click="edit">编辑</el-button>
        <el-button @click="remove">删除</el-button>
      </div>

      <!-- 展示在动态详情页 -->
      <div v-if="from === 'moment-detail'">
        <!-- 没有登录时显示热度和评论 -->
        <span>热度({{moment.message.votes.length}})</span>
        <comment class="comment"  :loginResult="loginResult" :moment="moment"></comment>
        <!-- 登陆后可以点赞评论转发 -->
        <div v-if="loginResult !== null">
          <el-button v-show="!isVoted" @click="vote">点赞({{moment.message.votes.length}})</el-button>
          <el-button v-show="isVoted" @click="unVote">取消点赞({{moment.message.votes.length}})</el-button>
          <el-button @click="forward">转发({{moment.message.forwards.length}})</el-button>
        </div>
      </div>
    </div>
</template>
<script>
import Marked from 'marked'
import Comment from '@/components/moment/comment'

export default {
  props: ['moment', 'loginResult', 'from'],
  data() {
    return {}
  },
  methods: {
    vote() {
      let header = { Authentication: this.loginResult.token }
      this.axios
        .post(`/messages/${this.moment.message.id}/vote`, null, {
          headers: header
        })
        .then(response => {
          this.$message({
            message: '点赞成功',
            type: 'success'
          })
          this.moment.message.votes.push(response.data)
        })
        .catch(error => {
          this.$message.error('点赞失败')
          throw error
        })
    },
    unVote() {
      let header = { Authentication: this.loginResult.token }
      this.axios
        .post(`/messages/${this.moment.message.id}/vote`, null, {
          headers: header
        })
        .then(response => {
          this.$message({
            message: '点赞成功',
            type: 'success'
          })
          this.moment.message.votes.push(response.data)
        })
        .catch(error => {
          this.$message.error('点赞失败')
          throw error
        })
    },
    comment() {
      this.$prompt('请输入评论内容', '评论', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          let body = { text: value }
          let header = { Authentication: this.loginResult.token }
          this.axios
            .post(`/messages/${this.moment.message.id}/comment`, body, {
              headers: header
            })
            .then(response => {
              this.$message({
                message: '评论成功',
                type: 'success'
              })
              this.moment.message.comments.push(response.data)
            })
            .catch(error => {
              this.$message.error('评论失败')
              throw error
            })
        })
        .catch(error => {
          this.$message.error('评论失败')
          throw error
        })
    },
    forward() {},
    edit() {
      this.$emit('moment-edit', this.moment)
    },
    remove() {
      this.$confirm('此操作将删除该动态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //先删消息，再删动态
        let header = { Authentication: this.loginResult.token }
        this.axios
          .delete(`/messages/${this.moment.message.id}`, { headers: header })
          .then(response => {
            this.axios
              .delete(`/moments/${this.moment.id}`, { headers: header })
              .then(response => {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
                this.$emit('moment-delete', this.moment.id)
              })
              .catch(error => {
                this.$message.error('删除失败')
                throw error
              })
          })
          .catch(error => {
            this.$message.error('删除失败')
            throw error
          })
      })
    }
  },
  computed: {
    compiledMarkdown() {
      return Marked(this.moment.message.text, { sanitize: true })
    },
    //判断自己是否点赞过该动态
    isVoted() {
      this.moment.message.votes.forEach(vote => {
        if (vote.user.id === this.loginResult.id) {
          return true
        }
      })
      return false
    }
  },
  components: {
    Marked,
    Comment
  }
}
</script>

<style scoped>
.detail {
  float: right;
}
.moment {
  display: block;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}
.time {
  font-size: 13px;
  color: #999;
}
.comment {
  margin: auto;
}
</style>
