<template>
  <div class="register">
    <el-form :model="user" ref="user" label-width="100px">
      <el-form-item label="用户名">
        <el-input v-model="user.username" size="tiny" @blur="onUsernameBlur"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="user.password" auto-complete="off" size="tiny"></el-input>
      </el-form-item>
      <el-form-item label="自我介绍">
        <el-input type="textarea" autosize placeholder="请输入自我介绍" v-model="user.introduction">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ['user'],
  data() {
    return {}
  },
  methods: {
    isUsernameDuplicated() {
      if (this.user.username === '') {
        return
      }
      this.axios
        .get(`/users/${this.user.username}/duplication`)
        .then(response => {
          if (response.data) {
            this.resetForm()
            this.$alert('用户名不可重复', '输入错误', {
              confirmButtonText: '确定'
            })
          }
        })
    },
    onUsernameBlur() {
      this.isUsernameDuplicated()
    },
    next() {
      this.isUsernameDuplicated()
      console.log('表单数据为', this.user)
      if (this.user.username !== '' && this.user.password !== '') {
        this.$emit('form-success')
        this.$router.push('/register/tags')
      } else {
        this.$alert('用户名和密码不可重复', '输入错误', {
          confirmButtonText: '确定'
        })
      }
    },
    resetForm() {
      this.user.username = ''
      this.user.password = ''
      this.user.introduction = ''
    }
  }
}
</script>

<style scoped>
.register {
  width: 30%;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
