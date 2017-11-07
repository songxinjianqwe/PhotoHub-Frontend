<template>
  <div v-if="_isLogin() && isFollow !== undefined && target != _id()">
    <el-button v-show="!isFollow" @click="showDialog">关注</el-button>
    <el-button v-show="isFollow" @click="unFollow">取消关注</el-button>
    <el-dialog v-loading="loading" title="放入分组" :visible.sync="groupSelectDialogVisible" width="30%">
      <el-select v-model="groupId" placeholder="请选择分组">
        <el-option v-for="group in groups" :key="group.id" :label="group.group_name" :value="group.id">
        </el-option>
      </el-select>
      <el-button :disabled="groupId === undefined" @click="follow">关注</el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['target'],
  data() {
    return {
      isFollow: undefined,
      groupSelectDialogVisible: false,
      groups: [],
      groupId: undefined,
      loading: false
    }
  },
  methods: {
    showDialog() {
      this.groupSelectDialogVisible = true
      if (this.groups.length === 0) {
        this.loading = true
        this.axios
          .get(`/users/${this._id()}/follow_groups`)
          .then(response => {
            this.groups = response.data.items
            this.loading = false
          })
          .catch(error => {
            throw error
          })
      }
    },
    follow() {
      this.loading = true
      let body = {
        group_id: this.groupId,
        followed_user_id: this.target,
        user_id: this._id()
      }
      this.axios
        .post(`/users/${this._id()}/follows`, body)
        .then(response => {
          this.loading = false
          this.groupSelectDialogVisible = false
          this.isFollow = true
          this.$message({
            message: '关注成功',
            type: 'success'
          })
        })
        .catch(error => {
          this.$message.error('关注失败')
        })
    },
    unFollow() {
      this.$confirm('此操作将取关该用户,是否继续?', '取关用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios
          .delete(`/users/${this._id()}/follows/${this.target}`)
          .then(response => {
            this.$message({
              message: '取关成功',
              type: 'success'
            })
            this.isFollow = false
          })
          .catch(error => {
            this.$message.error('取关失败')
          })
      })
    },
    findIsFollow() {
      this.axios
        .get(`/users/${this._id()}/follows/${this.target}`)
        .then(response => {
          this.isFollow = response.data
        })
        .catch(error => {
          this.isFollow = false
        })
    }
  },
  created() {
    this.findIsFollow()
  }
}
</script>

<style>

</style>
