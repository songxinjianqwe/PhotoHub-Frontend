<template>
    <!-- 键盘监听回车键，按下时提交表单 -->
    <div class="login" @keydown.enter="submitForm">
        <el-form :model="loginForm" ref="loginForm" label-width="100px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="loginForm.username" size="tiny"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="loginForm.password" auto-complete="off" size="tiny"></el-input>
            </el-form-item>
            <el-form-item class="item">
                <el-button type="primary" @click="submitForm">登录</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    submitForm() {
      console.log(this.loginForm);
      this.axios
        .post("/tokens", this.loginForm)
        .then(response => {
          console.log("登录成功");
          console.log(response.data);
          //清空表单
          this.resetForm();
          //发出成功提示
          const h = this.$createElement;
          this.$notify({
            title: "登录成功",
            message: h(
              "i",
              { style: "color: teal" },
              "欢迎您，" + response.data.username
            )
          });
          localStorage.setItem("loginResult", JSON.stringify(response.data));
          this.initCos(response.data.token)
          //跳转回主页
          this.$router.push("/")
          //刷新当前页面
          window.location.reload()
        })
        .catch(error => {
          console.log(error);
          if ("response" in error) {
            this.$notify.error({
              title: "登录失败",
              message: "用户名或密码错误"
            });
          }
        });
    },
    resetForm() {
      this.$refs["loginForm"].resetFields();
    }
  }
};
</script>

<style scoped>
.item {
  text-align: center;
}
</style>
