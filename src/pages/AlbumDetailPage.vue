<template>
  <el-container>
    <!-- 左侧 -->
    <el-aside class="aside">
      <div class="album-info" v-loading="albumLoading">
        <div>
          <span class="album-name">{{album.name}}</span>
          <!-- 必须是自己才能编辑 -->
          <el-button v-show="_isLogin() && album.user.id == _id()" @click="changeAlbumName">重命名</el-button>
        </div>
        <div>
          <time class="time">{{ album.create_time }}</time>
        </div>
        <span>{{album.description}}</span>
        <!-- 必须是自己才能编辑 -->
        <el-button v-show="_isLogin() && album.user.id == _id()" @click="changeAlbumDesc">修改简介</el-button>
        <div>
          <el-tag :key="tag.id" v-for="tag in album.tags" :closable="true" :disable-transitions="false" @close="handleClose(tag.name)">
            {{tag.name}}
          </el-tag>
          <!-- 必须是自己才能编辑 -->
          <div v-show="_isLogin() && album.user.id == _id()">
            <el-input style="width: 100px" class="input-new-tag" v-if="inputTagVisible" v-model="inputTag" ref="saveTagInput" size="mini" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
          </div>
        </div>
        <!-- 必须是自己才能编辑 -->
        <div v-show="_isLogin() && album.user.id == _id()">
          <el-button @click="modify">修改</el-button>
          <el-button @click="remove">删除</el-button>
        </div>
      </div>
    </el-aside>
    <!-- 右侧 -->
    <el-main id="main-content" v-loading="momentsLoading">
      <moment class="moment" v-for="item in moments" :key="item.id" :moment="item" from="album-detail"></moment>
      <el-button @click="fetchMoments">加载更多</el-button>
    </el-main>
  </el-container>
</template>

<script>
const userIndexPattern = new RegExp('/albums/\\d+')
import Moment from '@/components/moment/Moment'
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
      albumLoading: true,
      momentsLoading: true
    }
  },
  methods: {
    modify() {
      this.$confirm('此操作将修改该相册, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let body = {
          id: this.album.id,
          name: this.album.name,
          description: this.album.description,
          tags: this.album.tags,
          user_id: this.album.user.id
        }
        this.axios
          .put(`/albums/${this.album.id}`, body)
          .then(response => {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          })
          .catch(error => {
            this.$message.error('修改失败')
            throw error
          })
      })
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
            this.$router.push('/')
          })
          .catch(error => {
            if(error.response.status == 400){
              this.$message.error('默认相册不可删除')
            }else{
              this.$message.error('删除失败')
            }
            throw error
          })
      })
    },
    changeAlbumName() {
      this.$prompt('请输入新的相册名', '重命名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.album.name = value
      })
    },
    changeAlbumDesc() {
      this.$prompt('请输入新的简介', '修改简介', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.album.description = value
      })
    },
    fetchAlbum() {
      this.axios
        .get(`/albums/${this.$route.params.id}`)
        .then(response => {
          this.album = response.data
          this.albumLoading = false
        })
        .catch(error => {
          throw error
        })
    },
    fetchMoments() {
      if (this.page > this.totalPages) {
        this.$message({
          showClose: true,
          message: '已无更多动态',
          type: 'warning'
        })
        return
      }
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
        })
        .catch(error => {
          throw error
        })
    },
    //处理标签
    handleClose(tagName) {
      console.log('关闭标签', tagName)
      let index = -1
      for (let i = 0; i < this.album.tags.length; ++i) {
        if (this.album.tags[i].name === tagName) {
          console.log('找到了', i)
          index = i
          break
        }
      }
      if (index !== -1) {
        this.album.tags.splice(index, 1)
        console.log('删除后的数组', this.album.tags)
      }
    },
    handleInputConfirm() {
      let inputValue = this.inputTag
      if (inputValue) {
        this.album.tags.push({ name: inputValue.trim() })
      }
      this.inputTagVisible = false
      this.inputTag = ''
    },
    showInput() {
      this.inputTagVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    bindScroll() {
      if (
        this.isScrollInBottom(document.getElementById('main-content')) &&
        userIndexPattern.test(this.$route.path)
      ) {
        console.log('UserIndexPage bindScroll triggered...')
        this.$message('加载中...')
        this.fetchMoments()
      }
    }
  },
  //document绑定eventlistener可以在created，document中的某个文档元素绑定eventlistener必须在mounted之后
  mounted() {
    document
      .getElementById('main-content')
      .addEventListener('scroll', this.throttle(this.bindScroll, 5000))
  },
  components: {
    Moment
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
