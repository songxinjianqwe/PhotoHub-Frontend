<template>
    <div>
        <h3 class="group-name" @click="isDetailed = !isDetailed">{{group.group_name}}({{group.follows.length}})</h3>
        <el-collapse-transition>
            <div v-show="isDetailed">
                <el-button @click="editGroup">修改分组名</el-button>
                <el-button @click="removeGroup">删除该分组</el-button>
                <div v-for="follow in group.follows" :key="follow.id">
                    <router-link :to="`/users/${follow.followedUser.id}/index`">
                        <h4>{{follow.followedUser.username}}</h4>
                    </router-link>
                    <el-button @click="unFollow(follow.followedUser.id)">取关</el-button>
                </div>
            </div>
        </el-collapse-transition>
    </div>
</template>

<script>
export default {
  props: ['group'],
  data() {
    return {
      isDetailed: false
    }
  },
  methods: {
    unFollow(userId) {
      this.$confirm('此操作将取关该用户, 是否继续?', '取关用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios
          .delete(`/users/${this._id()}/follows/${userId}`)
          .then(response => {
            console.log('取关成功')
            this.$message({
              message: '取关成功',
              type: 'success'
            })
            for (let i = 0; i < this.group.follows.length; ++i) {
              if (this.group.follows[i].followedUser.id == userId) {
                this.group.follows.splice(i, 1)
              }
            }
          })
          .catch(error => {
            this.$message.error('取关失败')
            throw error
          })
      })
    },
    editGroup() {
      this.$prompt('请输入新的分组名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: this.group.group_name
      }).then(({ value }) => {
        let body = {
          user_id: this._id(),
          group_name: value
        }
        this.axios
          .put(`/users/${this._id()}/follow_groups/${this.group.id}`, body)
          .then(response => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.$emit('follow-group-edit-success', response.data)
          })
          .catch(error => {
            this.$message.error('修改失败')
          })
      })
    },
    removeGroup() {
      this.$confirm('此操作将删除该分组以及该分组下的全部关注, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios
          .delete(`/users/${this._id()}/follow_groups/${this.group.id}`)
          .then(response => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.$emit('follow-group-remove-success', this.group.id)
          })
          .catch(error => {
            this.$message.error('删除失败')
            throw error
          })
      })
    }
  }
}
</script>

<style scoped>
.group-name {
  cursor: pointer;
}
</style>
