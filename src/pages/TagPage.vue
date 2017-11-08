<template>
  <div class="tag-page">
    <div>
      <h1>热门标签</h1>
      <div v-loading="loading">
        <router-link class="tag" tag="li" v-for="tag in tags" :key="tag.id" :to="`/tags/${tag.id}`">
          <span>{{tag.name}}</span>
        </router-link>
      </div>
    </div>
    <div v-if="_isLogin() && user !== null">
      <h1>我关注的标签</h1>
      <el-tag v-for="tag in user.tags" :key="tag.id">
        <router-link :to="`/tags/${tag.id}`">
          {{tag.name}}
        </router-link>
      </el-tag>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tags: [],
      loading: true,
      user: null
    }
  },
  methods: {
    fetchTags() {
      let params = {
        page: 1,
        'per-page': 20
      }
      this.axios
        .get('/tags/hot', { params })
        .then(response => {
          this.tags = response.data.items
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          throw error
        })
    },
    fetchUser() {
      this.axios
        .get(`/users/${this._id()}`)
        .then(response => {
          this.user = response.data
        })
        .catch(error => {
          throw error
        })
    }
  },
  created() {
    this.fetchTags()
    if (this._isLogin()) {
      this.fetchUser()
    }
  }
}
</script>

<style scoped>
.tag-page {
  margin-left: 200px;
  margin-right: 200px;
}
.tag {
  cursor: pointer;
  list-style-type: none;
}
</style>
