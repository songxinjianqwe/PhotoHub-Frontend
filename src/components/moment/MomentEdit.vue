<template>
  <div id="editor" v-loading="loading">
    <message-edit :messageFromParent="moment.message" ref="message_edit" @message-edit-success="onMessageEditSuccess"></message-edit>
    <el-select v-model="moment.album.id">
      <el-option v-for="album in albums" :key="album.id" :label="album.name" :value="album.id">
      </el-option>
    </el-select>
    <div class="tag">
      <el-tag :key="tag.id" v-for="tag in moment.tags" :closable="true" :disable-transitions="false" @close="handleClose(tag.name)">
        {{tag.name}}
      </el-tag>
      <el-input style="width: 100px" class="input-new-tag" v-if="inputTagVisible" v-model="inputTag" ref="saveTagInput" size="mini" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
    </div>
    <el-button @click="publish" type="primary" :disabled="moment.text === ''">发 表</el-button>
  </div>
</template>
<script>
/**
 * 编辑一个数据的套路：从外部传入一个原始对象xxxFromParent，在编辑页面created时深度拷贝原始对象至data中，
 * 并watch原始对象，实时深度拷贝到data中；在编辑页面中可以直接使用data中的拷贝对象。
 */
import MessageEdit from '@/components/message/MessageEdit'
export default {
  props: ['momentFromParent'],
  data() {
    return {
      //因为props是一次性绑定，不会实时更新，所有需要将props赋值给data中的变量，然后watch这个props，变化时更新到data中
      moment:null,
      albums: [],
      inputTag: '',
      inputTagVisible: false,
      loading: false
    }
  },
  methods: {
    fetchAlbums() {
      console.log('加载albums')
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
    onMessageEditSuccess() {
      let body = {
        id: this.moment.id,
        user_id: this._id(),
        album_id: this.moment.albumId,
        message_id: this.moment.message.id,
        tags: this.moment.tags
      }
      this.axios
        .put(`/moments/${this.moment.id}`, body)
        .then(response => {
          console.log('修改moment')
          console.log(response.data)
          this.loading = false
          this.$emit('moment-edit-success', response.data)
        })
        .catch(error => {
          throw error
        })
    },
    publish() {
      this.loading = true
      this.$refs.message_edit.$emit('publish')
    },
    //处理标签
    handleClose(tagName) {
      console.log('关闭标签', tagName)
      let index = -1
      for (let i = 0; i < this.moment.tags.length; ++i) {
        if (this.moment.tags[i].name === tagName) {
          console.log('找到了', i)
          index = i
          break
        }
      }
      if (index !== -1) {
        this.moment.tags.splice(index, 1)
        console.log('删除后的数组', this.moment.tags)
      }
    },
    handleInputConfirm() {
      let inputValue = this.inputTag
      if (inputValue) {
        this.moment.tags.push({ name: inputValue.trim() })
      }
      this.inputTagVisible = false
      this.inputTag = ''
    },
    showInput() {
      this.inputTagVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    copyValue() {
      this.moment = JSON.parse(JSON.stringify(this.momentFromParent))
    }
  },
  watch: {
    momentFromParent() {
      this.copyValue()
    }
  },
  created() {
    this.copyValue()
    this.fetchAlbums()
  },
  components: {
    MessageEdit
  }
}
</script>

<style scoped>
#editor {
  margin: 0 auto;
  width: 100%;
  text-align: center;
}
.tag {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
