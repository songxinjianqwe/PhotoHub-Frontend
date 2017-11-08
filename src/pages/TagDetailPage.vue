<template>
  <div class="tag-page">
    <div class="tag-left">
      <div class="tag" v-if="tag !== null">
        <h1 v-text="tag.name"></h1>
        <tag-button :tagId="tag.id"></tag-button>
      </div>
      <div clas="moments">
        <el-radio v-model="mode" label="hot" border @change="onModeChange">热门</el-radio>
        <el-radio v-model="mode" label="latest" border @change="onModeChange">最新</el-radio>
        <div class="moments-detail" v-loading="momentsloading">
          <moment class="moment" v-for="item in moments" :key="item.id" :moment="item" from="feed"></moment>
        </div>
      </div>
    </div>
    <div class="tag-right">
      <h1>标签达人</h1>
      <ul v-loading="tagTalentsLoading">
        <router-link class="tag-talent" tag="li" v-for="user in tagTalents" :key="user.id" :to="`/users/${user.id}/index`">{{user.username}}</router-link>
      </ul>
      <div v-if="tagTalents.length === 0">暂无</div>
    </div>
  </div>
</template>
<script>
import TagButton from '@/components/tag/TagButton'
import Moment from '@/components/moment/Moment'
const tagDetailPattern = new RegExp('/tags/\\d+')
export default {
  data() {
    return {
      mode: 'hot',
      tag: null,
      tagTalents: [],
      page: 1,
      totalPages: 1,
      momentsloading: true,
      tagTalentsLoading: true,
      fetchComplete: true,
      moments: [],
      isFollow: undefined
    }
  },
  methods: {
    onModeChange() {
      this.page = 1
      this.totalPages = 1
      this.moments = []
      this.momentsloading = true
      this.fetchMoments()
    },
    fetchTag() {
      this.axios
        .get(`/tags/${this.$route.params.id}`)
        .then(response => {
          this.tag = response.data
        })
        .catch(error => {
          throw error
        })
    },
    checkIsFollow() {
      this.axios
        .get(`/tags/${this.$route.params.id}/users/${this._id()}`)
        .then(response => {
          this.isFollow = response.data
        })
        .catch(error => {
          this.isFollow = false
        })
    },
    fetchTagTalents() {
      let param = { page: 1, 'per-page': 20 }
      this.axios
        .get(`/tags/talents/${this.$route.params.id}`)
        .then(response => {
          this.tagTalents = response.data.items
          this.tagTalentsLoading = false
        })
        .catch(error => {
          this.tagTalentsLoading = false
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
      if (!this.fetchComplete) {
        return
      }
      this.$message('加载中...')
      this.fetchComplete = false
      this.axios
        .get(`/moments/${this.mode}/by_tag/${this.$route.params.id}`)
        .then(response => {
          this.totalPages = response.data._meta.pageCount
          this.moments = this.moments.concat(response.data.items)
          console.log(this.moments)
          this.page++
          this.$message({
            message: '加载动态完毕',
            type: 'success'
          })
          this.momentsloading = false
          this.fetchComplete = true
        })
        .catch(error => {
          this.fetchComplete = true
          throw error
        })
    },
    bindScroll() {
      if (this.isScrollInBottom() && tagDetailPattern.test(this.$route.path)) {
        console.log('TagDetailPage bindScroll triggered...')
        this.fetchMoments()
      }
    },
    init() {
      this.fetchTag()
      this.checkIsFollow()
      this.fetchTagTalents()
      this.fetchMoments()
    }
  },
  components: {
    Moment,
    TagButton
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log('beforeRouteEnter:跳转至', to.path)
      vm.init()
    })
  },
  created() {
    window.addEventListener(
      'scroll',
      this.throttle(this.bindScroll, this.DEFAULE_LOAD_INTERVAL)
    )
  }
}
</script>

<style scoped>
.tag-page {
  width: 800px;
  margin: 0 auto;
  overflow: hidden;
}
.tag-left {
  float: left;
  width: 600px;
  text-align: left;
}
.tag-right {
  float: left;
  margin-left: 50px;
}
.moment {
  width: 600px;
  overflow: hidden;
}
.tag-talent {
  list-style-type: none;
  cursor: pointer;
}
.moments-detail {
  margin-top: 20px;
}
</style>
