<template>
  <el-main id="main-content" v-loading="loading">
    <el-row v-for="row in Math.ceil(this.albums.length / 2)" :key="row">
      <el-col :span="10" v-for="(album, index) in albums.slice((row-1)*2,row*2)" :key="album.id" :offset="index > 0 ? 2 : 0">
        <!-- 一个Album -->
        <el-card class="album-card" :body-style="{ padding: '0px' }">
          <div>
            <router-link :to="`/albums/${album.id}`">
              <span class="album-name">{{album.name}}</span>
            </router-link>
          </div>
          <div>
            <time class="time">{{ album.create_time }}</time>
          </div>
          <el-tag v-for="tag in album.tags" :key="tag.id">
            <router-link :to="`/tags/${tag.id}`">
              {{tag.name}}
            </router-link>
          </el-tag>
          <!-- 显示6张图片 -->
          <table>
            <tr v-for="row in 2" :key="row">
              <td v-for="col in 3" :key="col">
                
                <img class="thumbnail" :src="album.thumbnails[( row - 1 )*2 + col -1 ]"></img>
              </td>
            </tr>
          </table>
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</template>
<script>
export default {
  data() {
    return {
      albums: [],
      loading: true,
      inputTag: '',
      inputTagVisible: false
    }
  },
  methods: {
    fetchAlbums() {
      let params = { user_id: this.$route.params.id,page: 1, 'per-page': 4 }
      this.axios
        .get(`/albums`, { params })
        .then(response => {
          this.albums = response.data.items
          this.loading = false
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
#main-content {
  height: 507px;
  overflow: auto;
}
.time {
  font-size: 13px;
  color: #999;
}
.album-name {
  font-size: 18px;
  font-weight: bold;
}
.thumbnail {
  width: 125px;
  height: 125px;
}
.album-card{
  width: 400px;
}
</style>

