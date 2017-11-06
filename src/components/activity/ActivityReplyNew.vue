<template>
    <div class="activity-reply-new" v-loading="loading">
        <message-new ref="message_new" @message-new-success="onMessageNewSuccess"></message-new>
        <div class="public-btn">
            <el-button @click="publish" type="primary">发 表</el-button>
        </div>
    </div>
</template>
<script>
import MessageNew from '@/components/message/MessageNew'
export default {
  props:['activity'],
  data() {
    return {
      loading: false,
      title: ''
    }
  },
  methods: {
    onMessageNewSuccess(messageId) {
      let body = {
        user_id: this._id(),
        message_id: messageId,
        activity_id: this.activity.id
      }
      this.axios
        .post(`/activities/${this.activity.id}/replies`, body)
        .then(response => {
          console.log('新增activityReply')
          console.log(response.data)
          this.loading = false                                      
          this.$emit('activity-reply-new-success', response.data)
        })
        .catch(error => {
          throw error
        })
    },
    publish() {
      this.loading = true
      this.$refs.message_new.$emit('publish')
    }
  },
  components: {
    MessageNew
  }
}
</script>
<style>
.activity-reply-new {
  margin: 0 auto;
  width: 100%;
  text-align: center;
}
.public-btn {
  margin-top: 10px;
}
.input {
  width: 200px;
  margin-bottom: 20px;
}
</style>
