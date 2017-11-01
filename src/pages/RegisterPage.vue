<template>
  <div class="register">
    <el-steps class="register-steps" :space="100" :active="step" finish-status="success">
      <el-step title="填写注册表单"></el-step>
      <el-step title="添加标签"></el-step>
      <el-step title="添加关注"></el-step>
    </el-steps>
    <!-- 嵌套路由 -->
    <!-- 渲染出来的router-view向父页面传值可以使用自定义事件 -->
    <router-view @form-success="onFormSuccess" @tag-success="onTagSuccess" @register-success="onRegisterSuccess" :user="user"></router-view>
  </div>
</template>
<script>
//this.$router.push
//this.$route.params
export default {
  data() {
    return {
      step: 0,
      user: {
        username: '',
        password: '',
        tags: [],
        follows: []
      }
    }
  },
  methods: {
    onFormSuccess() {
      this.step = 1
    },
    onTagSuccess() {
      this.step = 2
    },
    onRegisterSuccess() {
      this.step = 3
    }
  }
}
</script>

<style scoped>
.register-steps {
  text-align: left;
  margin: auto;
  margin-left: 550px;
}
</style>
