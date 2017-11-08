<template>
  <div class="moment-new" v-loading="loading">
    <message-new ref="message_new" @message-new-success="onMessageNewSuccess"></message-new>
    <div class="tag">
      <el-tag :key="tag" v-for="tag in tags" :closable="true" :disable-transitions="false" @close="handleClose(tag)">
        {{tag}}
      </el-tag>
      <el-input style="width: 100px" class="input-new-tag" v-if="inputTagVisible" v-model="inputTag" ref="saveTagInput" size="mini" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
    </div>
    <el-select v-model="albumId" placeholder="请选择所在相册">
      <el-option v-for="album in albums" :key="album.id" :label="album.name" :value="album.id">
      </el-option>
    </el-select>
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
      albumId: undefined,
      loading: false,
      albums: [],
      tags: [],
      inputTag: '',
      inputTagVisible: false
    }
  },
  methods: {
    fetchAlbums() {
      let param = {
        user_id: this._id(),
        page: 1,
        'per-page': 0,
        fields: 'id,name'
      }
      this.axios
        .get(`/albums`, { params: param })
        .then(response => {
          this.albums = response.data.items
          console.log('加载albums成功')
          console.log(this.albums)
        })
        .catch(error => {
          throw error
        })
    },
    onMessageNewSuccess(messageId) {
      let body = {
        user_id: this._id(),
        album_id: this.albumId,
        message_id: messageId,
        tags: this.tags
      }
      this.axios
        .post('/moments', body)
        .then(response => {
          console.log('新增moment')
          console.log(response.data)
          this.loading = false
          this.$emit('moment-new-success', response.data)
        })
        .catch(error => {
          throw error
        })
    },
    publish() {
      this.loading = true
      this.$refs.message_new.$emit('publish')
    },
    //处理标签
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
    },
    handleInputConfirm() {
      let inputValue = this.inputTag
      if (inputValue) {
        this.tags.push(inputValue.trim())
      }
      this.inputTagVisible = false
      this.inputTag = ''
    },
    showInput() {
      this.inputTagVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  },
  components: {
    MessageNew
  },
  created() {
    this.fetchAlbums()
  }
}
</script>

<style scoped>
.moment-new {
  margin: 0 auto;
  width: 100%;
  text-align: center;
}
.public-btn {
  margin-top: 10px;
}
.tag {
  margin-bottom: 20px;
}
</style>
