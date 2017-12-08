<<template>
    <div class="moment">
      <el-popover
        ref="comments"
        placement="top-start"
        title="评论"
        width="400"
        trigger="hover">
        <!-- 显示评论内容 -->
        <comment class="comment-detail" :moment="moment" @comment-delete="onCommentDelete"></comment>
      </el-popover>
      
      <!-- feed是显示在首页的，需要显示动态类型和点赞评论转发 -->
      <!-- user-index是显示在用户主页的 -->
      <!-- user-moments是显示在用户动态页的，需要显示编辑和删除 -->
      <div v-if="from === 'feed'">
        <div class="h4-username"> 
          <router-link :to="`/users/${moment.user.id}/index`" >
            <span>{{moment.user.username}}</span>
          </router-link>
          <follow-button :target="moment.user.id"></follow-button>
        </div>
        <span v-if="moment.type === 'user'">关注动态</span>  
        <span v-else>热门动态</span>
      </div>
      <router-link v-if="from !== 'moment-detail'" :to="`/moments/${moment.id}`">
        <span class="detail">查看详情</span>
      </router-link>
      <!-- 下面这部分是公共的 -->
      <time class="time">{{ moment.message.create_time }}</time>
      <span>来自相册:
        <router-link :to="`/albums/${moment.album.id}`">{{moment.album.name}}</router-link>
      </span>
      <el-tag v-for="tag in moment.tags" :key="tag.id">
        <router-link :to="`/tags/${tag.id}`">
          {{tag.name}}
        </router-link>
      </el-tag>
      <div :class="{'markdown' : from !== 'moment-detail'}" v-html="compiledMarkdown"></div>

      <!-- 显示在首页 -->
      <div v-if=" from === 'feed' && _isLogin()">
        <el-button v-show="!isVoted" @click="vote">点赞({{moment.message.votes.length}})</el-button>
        <el-button v-show="isVoted" @click="unVote">取消点赞({{moment.message.votes.length}})</el-button>
        <el-button @click="comment"  v-popover:comments>评论({{moment.message.comments.length}})</el-button>
        <el-button>转发({{moment.message.forwards.length}})</el-button>
      </div>

      <!-- 显示在用户动态页和动态详情页 -->
      <div v-if="(from === 'user-moments' || from === 'moment-detail') && this._id() === moment.user.id">
        <el-button @click="edit">编辑</el-button>
        <el-button @click="remove">删除</el-button>
      </div>

      <!-- 展示在动态详情页 -->
      <div v-if="from === 'moment-detail'">
        <!-- 没有登录时显示热度和评论 -->
        <span>热度({{moment.message.votes.length}})</span>
        <h4>评论</h4>
        <comment class="comment-detail" :moment="moment" @comment-delete="onCommentDelete"></comment>
        <!-- 登陆后可以点赞评论转发 -->
        <div v-if="_isLogin()">
         <el-button v-show="!isVoted" @click="vote">点赞({{moment.message.votes.length}})</el-button>
         <el-button v-show="isVoted" @click="unVote">取消点赞({{moment.message.votes.length}})</el-button>
         <el-button @click="comment">评论({{moment.message.comments.length}})</el-button>
         <el-button>转发({{moment.message.forwards.length}})</el-button>
        </div>
      </div>
    </div>
</template>
<script>
import Marked from 'marked'
import Comment from '@/components/moment/comment'
import FollowButton from '@/components/follow/FollowButton'

export default {
  props: ['moment', 'from'],
  data() {
    return {
      isVoted: false
    }
  },
  methods: {
    voteOrUnVote() {
      if (this.isVoted) {
        this.unVote()
      } else {
        this.vote()
      }
    },
    vote() {
      this.axios
        .post(`/messages/${this.moment.message.id}/vote`)
        .then(response => {
          this.$message({
            message: '点赞成功',
            type: 'success'
          })
          this.isVoted = true
          this.moment.message.votes.push(response.data)
        })
        .catch(error => {
          this.$message.error('点赞失败')
          throw error
        })
    },
    unVote() {
      let voteId = undefined
      for (let vote of this.moment.message.votes) {
        if (vote.user.id === this._id()) {
          voteId = vote.id
          break
        }
      }
      this.axios
        .delete(`/messages/${this.moment.message.id}/vote/${voteId}`)
        .then(response => {
          this.$message({
            message: '取消点赞成功',
            type: 'success'
          })
          for (let i = 0; i < this.moment.message.votes.length; ++i) {
            if (voteId === this.moment.message.votes[i].id) {
              this.moment.message.votes.splice(i, 1)
              break
            }
          }
          this.isVoted = false
        })
        .catch(error => {
          this.$message.error('取消点赞失败')
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
          this.axios
            .post(`/messages/${this.moment.message.id}/comment`, body)
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
    onCommentDelete(commentId) {
      for (let i = 0; i < this.moment.message.comments.length; ++i) {
        if (commentId === this.moment.message.comments[i].id) {
          this.moment.message.comments.splice(i, 1)
          break
        }
      }
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
        this.axios
          .delete(`/messages/${this.moment.message.id}`)
          .then(response => {
            this.axios
              .delete(`/moments/${this.moment.id}`)
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
      //将图片变成缩略图
      return Marked(this.moment.message.text, { sanitize: true })
    }
  },
  components: {
    Marked,
    Comment,
    FollowButton
  },
  created() {
    for (let vote of this.moment.message.votes) {
      if (vote.user.id === this._id()) {
        this.isVoted = true
      }
    }
  }
}
</script>
<style >
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
.comment-detail {
  width: 400px;
  margin: 0 auto;
}
.h4-username {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 10px;
}
.markdown img{
  width: 250px;
}
</style>
