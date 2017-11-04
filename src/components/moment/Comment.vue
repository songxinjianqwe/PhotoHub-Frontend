<template>
  <el-table :data="moment.message.comments" style="width: 100%">
    <el-table-column prop="user.username" width="100">
      <template slot-scope="props">
        <router-link :to="`/users/${props.row.user.id}/index`">
          {{props.row.user.username}}
        </router-link>
      </template>
    </el-table-column>
    <el-table-column prop="text" width="200">
    </el-table-column>
    <el-table-column v-if="myComment" width="80" inline-template>
      <el-button @click="unComment(row)">删除</el-button>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: ['moment', 'loginResult'],
  data() {
    return {
      unComment(comment) {}
    }
  },
  computed: {
    //是否是自己评论的
    myComment() {
      if (this.loginResult === null) {
        return false
      }
      this.moment.message.comments.forEach(comment => {
        if (comment.user.id === this.loginResult.id) {
          return true
        }
      })
      return false
    }
  }
}
</script>

<style scoped>

</style>
