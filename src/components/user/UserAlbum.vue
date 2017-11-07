<template>
  <el-main id="main-content" v-loading="loading">
    <div v-if="$route.params.id == _id()">
      <el-button @click="albumNewDialogVisible = true">创建相册</el-button>
    </div>
    <el-row v-for="row in Math.ceil(this.albums.length / 2)" :key="row">
      <el-col :span="10" v-for="(album, index) in albums.slice((row-1)*2,row*2)" :key="album.id" :offset="index > 0 ? 2 : 0">
        <!-- 一个Album -->
        <el-card class="album-card" :body-style="{ padding: '0px' }">
          <album :album="album"></album>
        </el-card>
      </el-col>
    </el-row>
     <!-- 新增AlbumDialog -->
    <el-dialog title="新增相册" :visible.sync="albumNewDialogVisible" width="30%">
      <album-new @album-new-success="onAlbumNewSuccess"></album-new>
    </el-dialog>
  </el-main>
</template>
<script>
import Album from '@/components/album/Album'
import AlbumNew from '@/components/album/AlbumNew'
export default {
  data() {
    return {
      albums: [],
      loading: false,
      inputTag: '',
      inputTagVisible: false,
      albumNewDialogVisible: false
    }
  },
  methods: {
    fetchAlbums() {
      this.loading = true
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
    },
    onAlbumNewSuccess(album) {
      this.$message({
        message: '创建成功',
        type: 'success'
      })
      this.albumNewDialogVisible = false
      this.albums.push(album)
    }
  },
  components:{
    Album,
    AlbumNew
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

.album-card{
  width: 400px;
}
</style>

