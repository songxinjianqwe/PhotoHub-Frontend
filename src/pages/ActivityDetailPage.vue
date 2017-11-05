<template>
  <div class="activity-detail" v-loading="loading">
    <h1 v-if="activity !== null " v-text="activity.title"></h1>
    <div v-if="activity !== null" v-html="compiledMarkdown"></div>
    <el-button @click="activityReplyNewDialogVisible = true">参与活动</el-button>
    <el-dialog class="activity-reply-new" title="新增活动回复" :visible.sync="activityReplyNewDialogVisible" width="70%">
      <activity-reply-new @activity-reply-new-success="onActivityReplyNewSuccess"></activity-reply-new>
    </el-dialog>
  </div>
</template>

<script>
import Marked from 'marked'
import ActivityReplyNew from '@/components/activity/ActivityReplyNew'
export default {
  data() {
    return {
      activity: null,
      activityReplyNewDialogVisible: false,
      loading: true
    }
  },
  methods: {
    onActivityReplyNewSuccess(){

    },
    fetchActivity() {
      this.axios
        .get(`/activities/${this.$route.params.id}`)
        .then(response => {
          this.activity = response.data
          this.loading = false
        })
        .catch(error => {
          throw error
        })
    }
  },
  components: {
    Marked,
    ActivityReplyNew
  },
  computed: {
    compiledMarkdown() {
      return Marked(this.activity.message.text, { sanitize: true })
    }
  },
  //在/activities/:id <=> 其他页面 之间跳转时被调用
  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log('beforeRouteEnter:跳转至', to.path)
      vm.fetchActivity()
    })
  }
}
</script>

<style>
.activity-detail {
  margin-left: 200px;
  margin-right: 200px;
  text-align: center;
  background-color:#FFFFFF;
}
</style>
