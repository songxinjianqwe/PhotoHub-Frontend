<template>
  <div class="activity-detail" v-loading="loading">
    <h1 v-if="activity !== null" v-text="activity.title"></h1>
    <div v-if="activity !== null" v-html="compiledMarkdown"></div>
    <el-button v-if="_isAdmin()" @click="activityEditDialogVisible = true">编辑活动</el-button>
    <el-button v-if="_isAdmin()" @click="remove">删除活动</el-button>
    <el-button @click="activityReplyNewDialogVisible = true">参与活动</el-button>
    <!-- 新增活动回复Dialog -->
    <el-dialog class="activity-reply-new" title="新增活动回复" :visible.sync="activityReplyNewDialogVisible" width="70%">
      <activity-reply-new :activity="activity" @activity-reply-new-success="onActivityReplyNewSuccess"></activity-reply-new>
    </el-dialog>
    <div v-if="activity !== null" class="activity-reply">
      <activity-reply :activityId="activity.id" @activity-reply-remove="onReplyRemoved" v-for="reply in activity.replies" :key="reply.id" :reply="reply"></activity-reply>
    </div>
    <!-- 修改活动Dialog -->
    <el-dialog class="activity-edit" title="修改活动回复" :visible.sync="activityEditDialogVisible" width="70%">
      <activity-edit :activityFromParent="activity" @activity-edit-success="onActivityEditSuccess"></activity-edit>
    </el-dialog>
  </div>
</template>
<script>
import Marked from 'marked'
import ActivityReplyNew from '@/components/activity/ActivityReplyNew'
import ActivityReply from '@/components/activity/ActivityReply'
import ActivityEdit from '@/components/activity/ActivityEdit'

export default {
  data() {
    return {
      activity: null,
      activityReplyNewDialogVisible: false,
      activityEditDialogVisible: false,
      loading: false
    }
  },
  methods: {
    onActivityReplyNewSuccess(reply) {
      this.activityReplyNewDialogVisible = false
      this.activity.replies.push(reply)
      this.$message({
        message: '回复成功',
        type: 'success'
      })
    },
    onActivityEditSuccess(newActivity) {
      this.activity = newActivity
      this.activityEditDialogVisible = false
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },
    onReplyRemoved(replyId) {
      for (let i = 0; i < this.activity.replies.length; ++i) {
        if (this.activity.replies[i].id == replyId) {
          this.activity.replies.splice(i, 1)
          break
        }
      }
    },
    remove() {
      this.$confirm('此操作将永久删除该活动以及其所有回复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios
          .delete(`/activities/${this.$route.params.id}`)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.$router.push('/activities')
          })
          .catch(error => {
            this.$message.error('删除失败')
            throw error
          })
      })
    },
    fetchActivity() {
      this.loading = true
      this.axios
        .get(`/activities/${this.$route.params.id}`)
        .then(response => {
          this.activity = response.data
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          throw error
        })
    }
  },
  components: {
    Marked,
    ActivityReplyNew,
    ActivityReply,
    ActivityEdit
  },
  computed: {
    compiledMarkdown() {
      return Marked(this.activity.message.text, { sanitize: true })
    }
  },
  //在/activities/:id <=> 其他页面 之间跳转时被调用
  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log('beforeRouteEnter:跳转至', to.path)
      vm.fetchActivity()
    })
  }
}
</script>

<style>
.activity-detail {
  margin-left: 200px;
  margin-right: 200px;
  text-align: center;
  background-color: #ffffff;
}
.thumbnail {
  width: 125px;
  height: 125px;
}
.activity-reply {
  margin-top: 20px;
  border: 1px solid #00a2e8;
}
</style>
