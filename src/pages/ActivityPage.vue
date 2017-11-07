<template>
  <div class="activity-page">
    <div class="radio">
      <el-radio v-model="mode" label="hot" border @change="onModeChange">热门</el-radio>
      <el-radio v-model="mode" label="latest" border @change="onModeChange">最新</el-radio>
      <el-button @click="activityNewDialogVisible =  true">发起活动</el-button>
    </div>
    <div v-loading="activitiesLoading">
      <el-row v-for="row in Math.ceil(this.activities.length / 2)" :key="row">
        <el-col :span="10" v-for="(activity, index) in activities.slice((row-1)*2,row*2)" :key="activity.id" :offset="index > 0 ? 2 : 0">
          <!-- 一个Album -->
          <el-card class="activity-card" :body-style="{ padding: '0px' }">
            <activity :activity="activity" :key="activity.id"></activity>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-button @click="fetchActivities">加载更多</el-button>
    <el-dialog class="activity-new" title="新增活动" :visible.sync="activityNewDialogVisible" width="70%">
      <activity-new @activity-new-success="onActivityNewSuccess"></activity-new>
    </el-dialog>
  </div>
</template>

<script>
import Activity from '@/components/activity/Activity'
import ActivityNew from '@/components/activity/ActivityNew'

export default {
  data() {
    return {
      mode: 'hot',
      activities: [],
      page: 1,
      totalPages: 1,
      activitiesLoading: false,
      activityNewDialogVisible: false
    }
  },
  methods: {
    onModeChange(){
      this.page = 1
      this.activities = []
      this.activitiesLoading = true
      this.fetchActivities()
    },
    onActivityNewSuccess(activity) {
      this.activityNewDialogVisible = false
      this.$message({
        message: '发表成功',
        type: 'success'
      })
      this.activities.push(activity)
    },
    fetchActivities() {
      if (this.page > this.totalPages) {
        this.$message({
          showClose: true,
          message: '已无更多活动',
          type: 'warning'
        })
        return
      }
      this.activitiesLoading = true
      let params = {
        page: this.page,
        'per-page': 6
      }
      this.axios
        .get(`/activities/${this.mode}`, {
          params: params
        })
        .then(response => {
          this.totalPages = response.data._meta.pageCount
          this.activities = this.activities.concat(response.data.items)
          console.log(this.activities)
          this.page++
          this.$message({
            message: '加载活动完毕',
            type: 'success'
          })
          this.activitiesLoading = false
        })
        .catch(error => {
          throw error
        })
    },
    bindScroll() {
      if (this.isScrollInBottom() && this.$route.path === '/activities') {
        console.log('UserIndexPage bindScroll triggered...')
        this.$message('加载中...')
        this.fetchActivities()
      }
    }
  },
  components: {
    Activity,
    ActivityNew
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log('beforeRouteEnter:跳转至', to.path)
      vm.page = 0
      vm.activities = []
      vm.fetchActivities()
    })
  },
  //document绑定eventlistener可以在created，document中的某个文档元素绑定eventlistener必须在mounted之后
  created() {
    window.addEventListener('scroll', this.throttle(this.bindScroll, 5000))
    this.fetchActivities()
  }
}
</script>

<style scoped>
.activity-page {
  margin-left: 200px;
  margin-right: 200px;
  text-align: center;
  margin-top: 20px;
  background-color:#FFFFFF;
}
.radio {
  text-align: left;
}
.activity-new {
  text-align: left;
}
.activity-card{
  width: 400px;
}
</style>
