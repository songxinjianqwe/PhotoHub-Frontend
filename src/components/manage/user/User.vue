<template>
  <div>
    <h1>用户管理</h1>
    <el-table v-loading="loading" :data="users" stripe highlight-current-row>
      <el-table-column prop="id" label="ID" width="50">
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="100">
      </el-table-column>
      <el-table-column prop="reg_time" label="注册时间" width="200">
      </el-table-column>
      <el-table-column prop="introduction" label="自我介绍" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="关注标签" width="200">
        <template slot-scope="scope">
          <el-tag v-for="tag in scope.row.tags" :key="tag.id">
            <router-link :to="`/tags/${tag.id}`">
              {{tag.name}}
            </router-link>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <span v-show="scope.row.isNormal">正常</span>
          <span v-show="!scope.row.isNormal">封禁</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.isAdmin" @click="edit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button v-show="scope.row.isNormal" :disabled="scope.row.isAdmin" @click="remove(scope.row)">封禁</el-button>
          <el-button v-show="!scope.row.isNormal" :disabled="scope.row.isAdmin" @click="recover(scope.row)">解封</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="text-align:center; margin-top:10px;" layout="prev, pager, next" :page-count="totalPages" @current-change="handlePageChanged" :current-page.sync="page">
    </el-pagination>

    <el-dialog title="编辑用户" :visible.sync="userEditDialogVisible" width="70%" @close="resetEditForm">
      <user-edit ref="user_edit" :userFromParent="editingUser" @user-edit-success="onUserEditSuccess"></user-edit>
    </el-dialog>
  </div>
</template>

<script>
import UserEdit from '@/components/user/UserEdit'
export default {
  data() {
    return {
      page: 1,
      totalPages: 1,
      users: [],
      loading: true,
      userEditDialogVisible: false,
      editingUser: null
    }
  },
  methods: {
    fetchUser() {
      this.loading = true
      let params = { page: this.page, 'per-page': this.DEFAULE_PER_PAGE }
      this.axios
        .get(`/users`, { params })
        .then(response => {
          this.users = response.data.items
          this.totalPages = response.data._meta.pageCount
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          throw error
        })
    },
    edit(user) {
      this.editingUser = user
      this.userEditDialogVisible = true
    },
    onUserEditSuccess(newUser) {
      this.userEditDialogVisible = false
      for (let i = 0; i < this.users.length; ++i) {
        if (this.users[i].id === newUser.id) {
          this.$set(this.users, i, newUser)
          break
        }
      }
    },
    remove(user) {
      this.$confirm('此操作将封禁该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.axios.delete(`/users/${user.id}`).then(response => {
          this.loading = false
          this.$message({
            message: '封禁成功',
            type: 'success'
          })
          user.isNormal = false
        })
      })
    },
    recover(user) {
      this.$confirm('此操作将解封该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.axios.put(`/users/${user.id}/recover`).then(response => {
          this.loading = false
          this.$message({
            message: '解封成功',
            type: 'success'
          })
          user.isNormal = true
        })
      })
    },
    handlePageChanged(newPageNum) {
      this.page = newPageNum
      this.fetchUser()
    },
    resetEditForm() {
      this.$refs.user_edit.$emit('reset')
    }
  },
  components: {
    UserEdit
  },
  created() {
    this.fetchUser()
  }
}
</script>

<style>

</style>
