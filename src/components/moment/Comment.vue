<template>
  <el-table :data="moment.message.comments">
    <el-table-column prop="user.username" width="100">
      <template slot-scope="props">
        <router-link :to="`/users/${props.row.user.id}/index`">
          {{props.row.user.username}}
        </router-link>
      </template>
    </el-table-column>
    <el-table-column prop="text" width="200">
    </el-table-column>
    <el-table-column width="80">
      <template slot-scope="props">
        <el-button v-if="props.row.user.id === _id()" @click="unComment(props.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: ['moment'],
  data() {
    return {}
  },
  methods: {
    unComment(comment) {
      this.$confirm('此操作将删除该评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios
          .delete(`/messages/${this.moment.message.id}/comment/${comment.id}`)
          .then(response => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.$emit('comment-delete', comment.id)
          })
          .catch(error => {
            this.$message.error('删除失败')
          })
      })
    }
  }
}
</script>

<style scoped>

</style>
