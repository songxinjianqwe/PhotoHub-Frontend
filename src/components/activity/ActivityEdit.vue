<template>
    <div class="activity-edit" v-loading="loading">
        <el-input class="input" v-model="activity.title"></el-input>
        <message-edit :messageFromParent="activity.message" ref="message_edit" @message-edit-success="onMessageEditSuccess"></message-edit>
        <div class="public-btn">
            <el-button @click="publish" type="primary">发 表</el-button>
        </div>
    </div>
</template>
<script>
import MessageEdit from '@/components/message/MessageEdit'
export default {
  props: ['activityFromParent'],
  data() {
    return {
      loading: false,
      activity: null
    }
  },
  methods: {
    onMessageEditSuccess() {
      let body = {
        id: this.activity.id,
        title: this.activity.title,
        message_id: this.activity.message.id,
        user_id: this._id(),
      }
      this.axios
        .put(`/activities/${this.activity.id}`, body)
        .then(response => {
          console.log('activity')
          console.log(response.data)
          this.loading = false
          this.$emit('activity-edit-success', response.data)
        })
        .catch(error => {
          throw error
        })
    },
    publish() {
      this.loading = true
      this.$refs.message_edit.$emit('publish')
    },
    copyValue() {
      this.activity = JSON.parse(JSON.stringify(this.activityFromParent))
    }
  },
  watch: {
    activityFromParent() {
      this.copyValue()
    }
  },
  created() {
    this.copyValue()
  },
  components: {
    MessageEdit
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
