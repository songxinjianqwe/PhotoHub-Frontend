<template>
  <div class="moment-detail" v-loading="loading">
    <h1 v-if="moment !== null" v-text="moment.user.username"></h1>
    <moment v-if="moment !== null" class="moment" :moment="moment" from="moment-detail" @moment-edit="onMomentEdit" @moment-delete="onMomentDelete"></moment>
    <!-- 编辑动态Dialog -->
    <el-dialog title="编辑动态" :visible.sync="momentEditDialogVisible" width="70%">
      <moment-edit :momentFromParent="moment" @moment-edit-success="onMomentEditSuccess"></moment-edit>
    </el-dialog>
  </div>
</template>
<script>
import Moment from '@/components/moment/Moment'
import MomentEdit from '@/components/moment/MomentEdit'
export default {
  data() {
    return {
      moment: null,
      loading: false,
      momentEditDialogVisible: false
    }
  },
  methods: {
    fetchMoment() {
      this.loading = true
      console.log('获取moment数据')
      this.axios
        .get(`/moments/${this.$route.params.id}`)
        .then(response => {
          this.moment = response.data
          this.loading = false
        })
        .catch(error => {
          throw error
        })
    },
    onMomentDelete() {
      this.$router.push(`/users/${this._id()}/moments`)
    },
    onMomentEdit() {
      this.momentEditDialogVisible = true
    },
    onMomentEditSuccess(newMoment) {
      console.log('moment接收到moment-edit-success事件')
      this.$message({
        message: '修改成功',
        type: 'success'
      })
      this.momentEditDialogVisible = false
      this.moment = newMoment      
    }
  },
  components: {
    Moment,
    MomentEdit
  },
  //在/users/:id/index <=> 其他页面 之间跳转时被调用
  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log('beforeRouteEnter:跳转至', to.path)
      vm.fetchMoment()
    })
  }
}
</script>

<style scoped>
.moment-detail {
  text-align: center;
}
.moment {
  margin: auto;
}
</style>
