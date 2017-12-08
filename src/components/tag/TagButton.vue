<template>
  <div v-if="_isLogin() && isFollow !== undefined" v-loading.fullscreen.lock="loading">
    <el-button v-show="!isFollow" @click="follow">关注</el-button>
    <el-button v-show="isFollow" @click="unFollow">取消关注</el-button>
  </div>
</template>

<script>
export default {
  props: ['tagId'],
  data() {
    return {
      isFollow: undefined,
      loading: false
    }
  },
  methods: {
    follow() {
      this.loading = true
      this.axios
        .post(`/tags/${this.tagId}/users/${this._id()}`)
        .then(response => {
          this.loading = false
          this.isFollow = true
          this.$message({
            message: '关注成功',
            type: 'success'
          })
        })
        .catch(error => {
          this.loading = false
          this.$message.error('关注失败')
        })
    },
    unFollow() {
      this.$confirm('此操作将不再关注此标签,是否继续?', '取关标签', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.axios
          .delete(`/tags/${this.tagId}/users/${this._id()}`)
          .then(response => {
            this.$message({
              message: '取关成功',
              type: 'success'
            })
            this.loading = false
            this.isFollow = false
          })
          .catch(error => {
            this.loading = false
            this.$message.error('取关失败')
          })
      })
    },
    findIsFollow() {
      this.axios
        .get(`/tags/${this.tagId}/users/${this._id()}`)
        .then(response => {
          this.isFollow = response.data
        })
        .catch(error => {
          this.isFollow = false
        })
    }
  },
  created() {
    if (this._isLogin()) {
      this.findIsFollow()
    }
  }
}
</script>

<style scoped>

</style>
