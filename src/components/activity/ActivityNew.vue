<template>
    <div class="activity-new" v-loading="loading">
        <el-input class="input" v-model="title" placeholder="请输入标题"></el-input>
        <message-new ref="message_new" @message-new-success="onMessageNewSuccess"></message-new>
        <div class="public-btn">
            <el-button @click="publish" type="primary">发 表</el-button>
        </div>
    </div>
</template>
<script>
import MessageNew from '@/components/message/MessageNew'
export default {
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
        title: this.title,
        message_id: messageId
      }
      this.axios
        .post('/activities', body)
        .then(response => {
          console.log('新增activity')
          console.log(response.data)
          this.loading = false                                      
          this.$emit('activity-new-success', response.data)
          this.title = ''
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
<style scoped>
.activity-new {
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
