<template>
    <div>
        <el-row v-for="i in Math.ceil(this.albums.length / 2)" :key="i">
            <el-col :span="8" v-for="(o, index) in 2" :key="o" :offset="index > 0 ? 2 : 0">
                <el-card :body-style="{ padding: '0px' }">
                    <h1>呵呵</h1>
                    <div v-if="$route.params.id == _id()">
                        <el-button>修改</el-button>
                        <el-button>删除</el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
  data() {
    return {
      albums: []
    }
  },
  methods: {
    fetchAlbums() {
      let params = { page: 1, 'per-page': 0 }
      this.axios
        .get(`/users/${this.$route.params.id}/albums`, { params })
        .then(response => {
          this.albums = response.data.items
          console.log('this.albums', this.albums)
        })
        .catch(error => {
          throw error
        })
    }
  },
  //在/users/:id/index <=> 其他页面 之间跳转时被调用
  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log('beforeRouteEnter:跳转至', to.path)
      vm.fetchAlbums()
    })
  }
}
</script>

<style scoped>

</style>
