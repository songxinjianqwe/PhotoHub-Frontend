<template>
  <div class="user-info">
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
        <el-checkbox-group v-model="user.tags" size="large" fill="#324057" text-color="#a4aebd">
          <el-row :gutter="20" v-for="i in Math.ceil(1.0 * tags.length / 5) " :key="i">
            <el-checkbox-button v-for="tag in tags.slice((i-1)*5,i*5)" :label="tag.id" :key="tag.id">{{tag.name}}</el-checkbox-button>
          </el-row>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="confirmUpdate">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ['loginResult'],
  data() {
    return {
      tags: [],
      user: {
        tags: []
      }
    }
  },
  methods: {
    fetchHotTags() {
      let param = {
        page: 1,
        'per-page': 20
      }
      this.axios
        .get('/tags/hot', { params: param })
        .then(response => {
          this.tags = response.data.items
          console.log('tags')
          console.log('this.user', this.user)
          for(let userTag in this.user.tags){
            //如果已经出现在tags里，那么不再添加
            let appeared = false
            for(let tag in this.tags){
              if(userTag.id === tag.id){
                appeared = true
              }
            }
            if(!appeared){
              this.tags.push(userTag)
            }
          }
          this.user.tags = this.user.tags.map(tag => {
            return tag.id
          })
          console.log(this.tags)
        })
        .catch(error => {
          throw error
        })
    },
    confirmUpdate() {
      this.$confirm('此操作将修改用户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.onModify()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消修改'
          })
        })
    },
    onModify() {
      console.log('待更新的表单数据')
      //调用全局函数
      console.log(this.user)
      let header = { Authentication: this.loginResult.token }
      this.axios
        .put(`/users/${this.user.id}`, this.user, { headers: header })
        .then(response => {
          console.log('更新完毕')
          this.$message({
            type: 'success',
            message: '更新成功!'
          })
          this.user = {
            tags: []
          }
          this.$emit('user-update', response.data)
        })
        .catch(error => {
          console.log('更新失败')
          console.log(error)
        })
    },
    fetchUser() {
      console.log('获取用户信息')
      let header = { Authentication: this.loginResult.token }
      this.axios
        .get(`/users/${this.loginResult.id}`, { headers: header })
        .then(response => {
          this.user = response.data
          this.fetchHotTags()
        })
        .catch(error => {
          throw error
        })
    }
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      console.log('beforeRouteEnter:跳转至', to.path)
      vm.fetchUser()
    })
  }
}
</script>

<style scoped>

</style>
