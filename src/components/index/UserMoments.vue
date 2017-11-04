<template>
  <div v-loading="loading">
    <h1>我的动态</h1>
    <moment class="moment" v-for="item in moments" :key="item.id" :moment="item" from="user-moments" :loginResult="loginResult" @moment-edit="onMomentEdit" @moment-delete="onMomentDelete"></moment>
    <el-button @click="fetchMoments">加载更多</el-button>

    <!-- 编辑动态Dialog -->
    <el-dialog title="编辑动态" :visible.sync="momentEditDialogVisible" width="70%">
      <message-edit :copiedMoment="copiedMoment" :loginResult="loginResult" @moment-edit-success="onMomentEditSuccess"></message-edit>
    </el-dialog>
  </div>
</template>

<script>
import Moment from '@/components/moment/Moment'
import MessageEdit from '@/components/message/MessageEdit'
const userMomentsPattern = new RegExp('/users/\\d+\\/moments')
export default {
  props: ['user', 'loginResult'],
  data() {
    return {
      moments: [],
      page: 1,
      totalPages: 1,
      loading: true,
      momentEditDialogVisible: false,
      editingMoment: null
    }
  },
  methods: {
    onMomentDelete(momentId) {
      console.log('onMomentDelete', momentId)
      for (let i = 0; i < this.moments.length; ++i) {
        if (this.moments[i].id === momentId) {
          this.moments.splice(i, 1)
          break
        }
      }
    },
    onMomentEdit(moment) {
      this.editingMoment = moment
      this.momentEditDialogVisible = true
    },
    onMomentEditSuccess(newMoment) {
      console.log('moment接收到moment-edit-success事件')
      this.$message({
        message: '修改成功',
        type: 'success'
      })
      this.momentEditDialogVisible = false
      this.editingMoment = null

      for (let i = 0; i < this.moments.length; ++i) {
        if (this.moments[i].id === newMoment.id) {
          this.$set(this.moments, i, newMoment)
          break
        }
      }
    },
    fetchMoments() {
      console.log(this.user)
      if (this.page > this.totalPages) {
        this.$message({
          showClose: true,
          message: '已无更多动态',
          type: 'warning'
        })
        return
      }
      let params = {
        user_id: this.loginResult.id,
        page: this.page,
        'per-page': this.DEFAULE_PER_PAGE
      }
      let headers = { Authentication: this.loginResult.token }
      this.axios
        .get('/moments', {
          params: params,
          headers: headers
        })
        .then(response => {
          this.totalPages = response.data._meta.pageCount
          this.moments = this.moments.concat(response.data.items)
          console.log(this.moments)
          this.page++
          this.loading = false
          this.$message({
            message: '加载动态完毕',
            type: 'success'
          })
        })
        .catch(error => {
          throw error
        })
    },
    bindScroll() {
      if (
        this.isScrollInBottom() &&
        userMomentsPattern.test(this.$route.path)
      ) {
        console.log('UserIndexPage bindScroll triggered...')
        this.$message('加载中...')
        this.fetchMoments()
      }
    }
  },
  components: {
    Moment,
    MessageEdit
  },
  computed: {
    //深拷贝
    copiedMoment() {
      return JSON.parse(JSON.stringify(this.editingMoment))
    }
  },
  created() {
    this.fetchMoments()
    document.addEventListener('scroll', this.throttle(this.bindScroll, 2000))
  }
}
</script>

<style scoped>
.moment {
  width: 600px;
  overflow: hidden;
}
</style>
