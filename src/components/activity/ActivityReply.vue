<template>
    <div class="reply">
        <div class="username">
            <router-link :to="`/users/${reply.user.id}/index`">
                {{reply.user.username}}
            </router-link>
        </div>
        <router-link :to="`/users/${reply.user.id}/index`">
            <img class="avatar" :src="reply.user.avatar" />
        </router-link>
        <el-button v-show="_isLogin() && reply.user.id == _id()" @click="remove">删除</el-button>
        <div class="article" v-html="compiledMarkdown"></div>
    </div>
</template>

<script>
import Marked from 'marked'
export default {
  props: ['activityId', 'reply'],
  methods: {
    remove() {
      this.$confirm('此操作将删除该条回复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios
          .delete(`/activities/${this.activityId}/replies/${this.reply.id}`)
          .then(response => {
            this.$emit('activity-reply-remove', this.reply.id)
            this.$message({
              message: '删除回复成功',
              type: 'success'
            })
          })
          .catch(error => {
            this.$message.error('删除失败')
          })
      })
    }
  },
  computed: {
    compiledMarkdown() {
      return Marked(this.reply.message.text, { sanitize: true })
    }
  },
  components: {
    Marked
  }
}
</script>

<style scoped>
.reply {
  text-align: left;
}
.username {
  text-align: left;
  font-size: 16px;
}
.avatar {
  width: 100px;
  height: 100px;
}
.article {
  text-align: center;
  overflow: hidden;
}
</style>
