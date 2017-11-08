<template>
    <div class="user-info" v-loading="loading">
        <el-form ref="user" :model="user" label-width="80px">
            <el-form-item label="用户名" prop="username">
                {{user.username}}
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="user.password"></el-input>
            </el-form-item>
            <el-form-item label="自我介绍" prop="introduction">
                <el-input v-model="user.introduction"></el-input>
            </el-form-item>
            <el-form-item label="关注标签" prop="tags">
                <el-tag :key="tag.id" v-for="tag in user.tags" :closable="true" :close-transition="false" @close="handleClose(tag.name)">
                    {{tag.name}}
                </el-tag>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="confirmUpdate">修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
  props: ['userFromParent'],
  data() {
    return {
      user: null,
      loading:false
    }
  },
  methods: {
    confirmUpdate() {
      this.$confirm('此操作将修改用户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.onModify()
      })
    },
    onModify() {
        this.loading = true
      console.log('待更新的表单数据')
      //调用全局函数
      console.log(this.user)
      this.axios
        .put(`/users/${this.user.id}`, this.user)
        .then(response => {
          console.log('更新完毕')
          this.$message({
            type: 'success',
            message: '更新成功!'
          })
          this.loading = false
          this.$emit('user-edit-success', response.data)
        })
        .catch(error => {
          console.log('更新失败')
          console.log(error)
        })
    },
    copyValue() {
      this.user = JSON.parse(JSON.stringify(this.userFromParent))
    },
    handleClose(tagName) {
      console.log('关闭标签', tagName)
      let index = -1
      for (let i = 0; i < this.user.tags.length; ++i) {
        if (this.user.tags[i].name === tagName) {
          console.log('找到了', i)
          index = i
          break
        }
      }
      if (index !== -1) {
        this.user.tags.splice(index, 1)
        console.log('删除后的数组', this.user.tags)
      }
    }
  },
  watch: {
    userFromParent() {
      this.copyValue()
    }
  },
  created() {
    this.copyValue()
    this.$nextTick(() => {
      this.$on('reset', this.copyValue)
    })
  }
}
</script>

<style scoped>

</style>
