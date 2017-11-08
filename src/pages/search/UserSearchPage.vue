<template>
  <div class="user-search">
    <h1>用户搜索结果</h1>
    <div v-loading="userLoading">
      <div class="user" v-for="user in users" :key="user.id">
        <router-link :to="`/users/${user.id}/index`">
          {{user.username}}
        </router-link>
        <follow-button :target="user.id"></follow-button>
        <img class="avatar" :src="user.avatar" />
      </div>
    </div>
  </div>
</template>

<script>
import FollowButton from '@/components/follow/FollowButton'
export default {
  data() {
    return {
      users: [],
      page: 1,
      totalPages: 1,
      userLoading: true,
      fetchComplete: true
    }
  },
  methods: {
    reset(){
      this.users =  []
      this.page =  1
      this.totalPages =  1
      this.userLoading = true
    },
    fetchSearchResult() {
      if (this.page > this.totalPages) {
        this.$message({
          showClose: true,
          message: '已无更多搜索结果',
          type: 'warning'
        })
        return
      }
      if (!this.fetchComplete) {
        return
      }
      this.$message('加载中...')
      this.fetchComplete = false
      let params = {
        page: this.page,
        'per-page': 5,
        keyword: this.$route.query.keyword
      }
      this.axios
        .get('/users/search', { params })
        .then(response => {
          this.totalPages = response.data._meta.pageCount
          this.users = this.users.concat(response.data.items)
          console.log(this.users)
          this.page++
          this.$message({
            message: '加载搜索结果完毕',
            type: 'success'
          })
          this.userLoading = false
          this.fetchComplete = true
        })
        .catch(error => {
          this.fetchComplete = true
          throw error
        })
    },
    bindScroll() {
      if (this.isScrollInBottom() && this.$route.path === '/search/users') {
        console.log('UserSearchPage bindScroll triggered...')
        this.fetchSearchResult()
      }
    }
  },
  watch: {
    $route(to, from) {
      this.reset()
      this.fetchSearchResult()
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log('beforeRouteEnter:跳转至', to.path)
      vm.fetchSearchResult()
    })
  },
  components: {
    FollowButton
  },
  //document绑定eventlistener可以在created，document中的某个文档元素绑定eventlistener必须在mounted之后
  created() {
    window.addEventListener(
      'scroll',
      this.throttle(this.bindScroll, this.DEFAULE_LOAD_INTERVAL)
    )
  }
}
</script>

<style scoped>
.user-search {
  margin-left: 200px;
  margin-right: 200px;
  text-align: center;
}
.user {
  border: 1px solid;
}
.avatar {
  width: 90px;
  height: 90px;
}
</style>
