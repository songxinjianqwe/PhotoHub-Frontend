<template>
  <div class="register-tag">
    <h2>选择你的兴趣</h2>
    <el-checkbox-group v-model="user.tags" size="large" fill="#324057" text-color="#a4aebd">
      <el-row :gutter="20" v-for="i in 4" :key="i">
        <el-checkbox-button v-for="tag in tags.slice((i-1)*5,i*5)" :label="tag.id" :key="tag.id">{{tag.name}}</el-checkbox-button>
      </el-row>
    </el-checkbox-group>
    <el-button  @click="back">上一步</el-button>
    <el-button type="primary" @click="next" :disabled="user.username === '' || user.password === '' || user.tags.length === 0">下一步</el-button>
  </div>
</template>
<script>
export default {
  props: ['user'],
  data() {
    return {
      tags: []
    }
  },
  methods: {
    next(){
      this.$emit('tag-success')
      this.$router.push('/register/follows')
    },
    back(){
      this.user.tags = []
      this.$router.push('/register/form')
    },
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
          console.log(this.tags)
        })
        .catch(error => {
          throw error
        })
    }
  },
  created() {
    this.fetchHotTags()
  }
}
</script>

<style scoped>
.register-tag {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
