<template>
  <el-container>
    <!-- 左侧 -->
    <el-aside class="aside">
      <div class="album-info" v-loading="albumLoading">
        <div>
          <span class="album-name">{{album.name}}</span>
        </div>
        <div>
          <time class="time">{{ album.create_time }}</time>
        </div>
        <span>{{album.description}}</span>
        <div>
          <el-tag :key="tag.id" v-for="tag in album.tags">
            <router-link :to="`/tags/${tag.id}`">
              {{tag.name}}
            </router-link>
          </el-tag>
        </div>
        <!-- 必须是自己才能编辑 -->
        <div v-show="_isLogin() && album.user.id == _id()">
          <el-button @click="albumEditDialogVisible = true">修改</el-button>
          <el-button @click="remove">删除</el-button>
        </div>
      </div>
    </el-aside>

    <!-- 右侧 -->
    <el-main id="main-content" v-loading="momentsLoading">
      <moment class="moment" v-for="item in moments" :key="item.id" :moment="item" from="album-detail"></moment>
      <el-button @click="fetchMoments">加载更多</el-button>
    </el-main>

    <el-dialog title="修改相册" :visible.sync="albumEditDialogVisible" width="30%">
      <album-edit :albumFromParent="album" @album-edit-success="onAlbumEditSuccess"></album-edit>
    </el-dialog>
  </el-container>
</template>
<script>
const userIndexPattern = new RegExp('/albums/\\d+')
import Moment from '@/components/moment/Moment'
import AlbumEdit from '@/components/album/AlbumEdit'

export default {
  data() {
    return {
      album: {
        user: {
          id: ''
        }
      },
      page: 1,
      totalPages: 1,
      moments: [],
      inputTag: '',
      inputTagVisible: false,
      albumLoading: false,
      momentsLoading: true,
      albumEditDialogVisible: false,
      fetchComplete: true
    }
  },
  methods: {
    onAlbumEditSuccess(newAlbum) {
      this.album = newAlbum
      this.albumEditDialogVisible = false
    },
    remove() {
      this.$confirm('此操作将删除该相册以及相册内的所有动态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios
          .delete(`/albums/${this.album.id}`)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.$router.push(`/users/${this.album.user.id}/albums`)
          })
          .catch(error => {
            if (error.response.status == 400) {
              this.$message.error('默认相册不可删除')
            } else {
              this.$message.error('删除失败')
            }
            throw error
          })
      })
    },
    fetchAlbum() {
      this.albumLoading = true
      this.axios
        .get(`/albums/${this.$route.params.id}`)
        .then(response => {
          this.album = response.data
          this.albumLoading = false
        })
        .catch(error => {
          this.albumLoading = false
          throw error
        })
    },
    fetchMoments() {
      console.log('开始加载动态')
      if (this.page > this.totalPages) {
        this.$message({
          showClose: true,
          message: '已无更多动态',
          type: 'warning'
        })
        console.log('已无更多动态')
        return
      }
      if(!this.fetchComplete){
        return 
      }
      this.fetchComplete = false
      this.$message('加载中...')
      let params = {
        album_id: this.$route.params.id,
        page: this.page,
        'per-page': this.DEFAULE_PER_PAGE
      }
      this.axios
        .get('/moments', {
          params: params
        })
        .then(response => {
          this.totalPages = response.data._meta.pageCount
          this.moments = this.moments.concat(response.data.items)
          console.log(this.moments)
          this.page++
          this.$message({
            message: '加载动态完毕',
            type: 'success'
          })
          this.momentsLoading = false
          this.fetchComplete = true
        })
        .catch(error => {
          this.momentsLoading = false
          this.fetchComplete = true
          throw error
        })
    },
    bindScroll() {
      if (
        this.isScrollInBottom(document.getElementById('main-content')) &&
        userIndexPattern.test(this.$route.path)
      ) {
        console.log('UserIndexPage bindScroll triggered...')
        
        this.fetchMoments()
      }
    }
  },
  //document绑定eventlistener可以在created，document中的某个文档元素绑定eventlistener必须在mounted之后
  mounted() {
    document
      .getElementById('main-content')
      .addEventListener('scroll', this.throttle(this.bindScroll,  this.DEFAULE_LOAD_INTERVAL))
  },
  components: {
    Moment,
    AlbumEdit
  },
  //在/albums/:id <=> 其他页面 之间跳转时被调用
  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log('beforeRouteEnter:跳转至', to.path)
      vm.fetchAlbum()
      vm.fetchMoments()
    })
  }
}
</script>

<style scoped>
.aside {
  width: 300px;
  height: 507px;
  text-align: center;
  background: url('../assets/album/album.jpg') no-repeat;
}
.album-info {
  margin-top: 50px;
  color: cyan;
  margin-bottom: 20px;
}
.album-name {
  font-size: 18px;
  font-weight: bold;
}

.time {
  font-size: 16px;
  color: chartreuse;
}

#main-content {
  margin-left: 200px;
  height: 507px;
  overflow: auto;
}

.moment {
  width: 600px;
  overflow: hidden;
}
</style>
