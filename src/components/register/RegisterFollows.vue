<template>
  <div class="register-follow">
    <h3关注你喜欢的达人</h3>
    <div v-for="tag in tags" :key="tag">
      <h3 v-if="tagTalents[tag].length > 0" >来自标签 {{tag}}</h3>
      <div class="user" v-for="user in tagTalents[tag]" :key="user.id">
        <span>{{user.username}}</span>
        <img :src="user.avatar" />
        <el-button @click="followOrUnFollow(user.id)">
          <span v-if="!isFollowed(user.id)">关注</span>
          <span v-else>取消关注</span>
        </el-button>
      </div>
    </div>

    <el-button @click="back">上一步</el-button>
    <el-button type="primary" :disabled="user.username === '' || user.password === '' || user.tags.length === 0 || user.follows.length === 0" @click="register">注册</el-button>
  </div>
</template>
<script>
export default {
  props: ['user'],
  data() {
    return {
      tags: [],
      tagTalents: {}
    }
  },
  methods: {
    back() {
      this.user.follows = []
      this.$router.push('/register/tags')
    },
     register() {
      console.log('表单内容',this.user)
      this.axios.post('/users', this.user).then(response => {
        console.log(response.data)
        const h = this.$createElement
        this.$notify({
          title: '注册成功',
          message: h('i', { style: 'color: teal' }, '欢迎您加入我们')
        })
        this.$emit('register-success')
        this.$message('5秒后跳转回主页')
        setTimeout(() => {
          this.$router.push('/')
        }, 5000);
      }).catch(error => {
        throw error
      })
    },
    followOrUnFollow(userId) {
      if (this.isFollowed(userId)) {
        let index = this.user.follows.indexOf(userId)
        this.user.follows.splice(index, 1)
      } else {
        this.user.follows.push(userId)
      }
    },
    isFollowed(userId) {
      return this.user.follows.indexOf(userId) !== -1
    },
    fetchTagTalents() {
      let body = {
        tagIds: this.user.tags
      }
      this.axios
        .post('/tags/talents/batch', body)
        .then(response => {
          this.tagTalents = response.data
          for (let tag in this.tagTalents) {
            this.tags.push(tag)
          }
        })
        .catch(error => {
          throw error
        })
    },
  },
  created() {
    this.fetchTagTalents()
  }
}
</script>

<style scoped>
.register-follow {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
}
.user {
  position: relative;
  width: 200px;
  height: 150px;
  box-sizing: border-box;
  border: 4px solid #d9dde1;
  margin: 0 auto;
  text-align: center;
  overflow: hidden;
}

.user img {
  width: 90px;
  height: 90px;
}
</style>
