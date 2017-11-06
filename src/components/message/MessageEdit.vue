<template>
  <div id="editor" v-loading="loading">
    <mavon-editor style="height: 100%" v-model="text" @imgAdd="imgAdd" @imgDel="imgDel"></mavon-editor><br>
    <el-select v-model="albumId">
      <el-option v-for="album in albums" :key="album.id" :label="album.name" :value="album.id">
      </el-option>
    </el-select>
    <div class="tag">
      <el-tag :key="tag.id" v-for="tag in tags" :closable="true" :disable-transitions="false" @close="handleClose(tag.name)">
        {{tag.name}}
      </el-tag>
      <el-input style="width: 100px" class="input-new-tag" v-if="inputTagVisible" v-model="inputTag" ref="saveTagInput" size="mini" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
    </div>
    <el-button @click="publish" type="primary" :disabled="text === ''">发 表</el-button>
  </div>
</template>
<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
  props: ['copiedMoment'],
  data() {
    return {
      //因为props是一次性绑定，不会实时更新，所有需要将props赋值给data中的变量，然后watch这个props，变化时更新到data中
      cos: null,
      albumId: undefined,
      tags: [],
      text: '',
      albums: [],
      images: {},
      messageId: undefined,
      momentId: undefined,
      successCount: 0,
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
    clearVals() {
      this.successCount = 0
      this.images = {}
    },
    publish() {
      console.log('images', this.images)
      this.loading = true
      if (Object.keys(this.images).length > 0) {
        this.uploadimages()
      } else {
        this.updateMoment()
      }
    },
    imgAdd(pos, $file) {
      this.images[pos] = $file
    },
    imgDel(pos) {
      delete this.images[pos]
    },
    //*************************************** */
    //处理图片上传
    uploadimages() {
      console.log('开始上传图片')
      for (let key in this.images) {
        this.uploadSingleImage(this.images[key])
      }
    },
    uploadSingleImage(file) {
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = e => {
        this.upload(this.COS_IMG_BASE_PATH, file.name, e.target.result)
      }
    },
    upload(cosBasePath, name, dataUrl) {
      let path = cosBasePath + name
      let binary = this.base64ToBinary(dataUrl)
      this.cos.uploadFile(
        this.uploadSuccessCallBack,
        this.uploadErrorCallBack,
        null,
        'photohub',
        path,
        binary,
        0
      )
    },
    //上传成功后回调
    uploadSuccessCallBack(result) {
      this.successCount++
      console.log('上传成功')
      console.log(result.data.source_url)
      let slices = result.data.source_url.split('/')
      let fileName = slices[slices.length - 1]
      console.log('fileName', fileName)
      for (let key in this.images) {
        console.log('this.images[key].name', this.images[key].name)
        if (this.images[key].name === fileName) {
          this.text = this.text.replace(key, result.data.source_url)
        }
      }
      //全部上传完毕
      if (this.successCount === Object.keys(this.images).length) {
        this.updateMoment()
      }
    },
    updateMoment() {
      let body = {
        id: this.messageId,
        text: this.text,
        user_id: this._id()
      }
      this.axios
        .put(`/messages/${this.messageId}`, body)
        .then(response => {
          console.log('修改message')
          console.log(response.data)
          let body = {
            id: this.momentId,
            user_id: this._id(),
            album_id: this.albumId,
            message_id: response.data.id,
            tags: this.tags
          }
          this.axios
            .put(`/moments/${this.momentId}`, body, { headers: header })
            .then(response => {
              console.log('修改moment')
              console.log(response.data)
              this.clearVals()
              //重新渲染回去
              this.loading = false
              this.$emit('moment-edit-success', response.data)
            })
            .catch(error => {
              throw error
            })
        })
        .catch(error => {
          throw error
        })
    },
    //上传失败后回调
    uploadErrorCallBack(result) {
      console.log('发表失败')
      console.log('result:', result)
      this.$message.error('发表失败')
      this.clearVals()
    },
    //*************************************** */
    //处理标签
    handleClose(tagName) {
      console.log('关闭标签', tagName)
      let index = -1
      for (let i = 0; i < this.copiedMoment.tags.length; ++i) {
        if (this.copiedMoment.tags[i].name === tagName) {
          console.log('找到了', i)
          index = i
          break
        }
      }
      if (index !== -1) {
        this.copiedMoment.tags.splice(index, 1)
        console.log('删除后的数组', this.copiedMoment.tags)
      }
    },
    handleInputConfirm() {
      let inputValue = this.inputTag
      if (inputValue) {
        this.copiedMoment.tags.push({ name: inputValue.trim() })
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
      this.albumId = this.copiedMoment.album.id
      this.text = this.copiedMoment.message.text
      this.tags = this.copiedMoment.tags
      this.messageId = this.copiedMoment.message.id
      this.momentId = this.copiedMoment.id
    }
  },
  watch: {
    copiedMoment() {
      this.copyValue()
    }
  },
  created() {
    if (this.cos === null) {
      this.cos = this.initCos()
    }
    this.copyValue()
    this.fetchAlbums()
  },
  components: {
    mavonEditor
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
