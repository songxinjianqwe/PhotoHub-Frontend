<template>
  <el-main id="main-content" v-loading="loading">
    <moment class="moment" v-for="item in moments" :key="item.id" :moment="item" from="user-index"></moment>
    <el-button @click="fetchMoments">加载更多</el-button>
  </el-main>
</template>

<script>
const userIndexPattern = new RegExp('/users/\\d+\\/index')
import Moment from '@/components/moment/Moment'
export default {
  data() {
    return {
      moments: [],
      page: 1,
      totalPages: 1,
      loading: true
    }
  },
  methods: {
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
        user_id: this.$route.params.id,
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
          this.loading = false
        })
        .catch(error => {
          throw error
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
      .addEventListener('scroll', this.throttle(this.bindScroll, 2000))
  },
  components: {
    Moment
  },
  //在/users/:id/index或albums <=> 其他页面 之间跳转时被调用
  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log('beforeRouteEnter:跳转至', to.path)
      vm.fetchMoments()
    })
  }
}
</script>

<style scoped>
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
