<template>
    <div class="register-tag">
        <h2>选择你的兴趣</h2>
        <el-checkbox-group v-model="chosenTags" size="large" fill="#324057" text-color="#a4aebd" :min="1" :max="3">
            <el-checkbox-button v-for="tag in tags" :label="tag.name" :key="tag.id">{{tag.name}}</el-checkbox-button>
        </el-checkbox-group>
    </div>
</template>
<script>
export default {
  props: ['user'],
  data() {
    return {
      tags: [],
      chosenTags: []
    }
  },
  methods: {
    fetchHotTags() {
      let param = {
        'page': 1,
        'per-page': 20
      }
      this.axios
        .get('/tags/hot', { params: param })
        .then(response => {
          this.tags = response.data.items
          console.log('tags');
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
</style>
