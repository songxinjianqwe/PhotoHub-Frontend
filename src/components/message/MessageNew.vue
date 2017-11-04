<template>
  <div id="editor"  v-loading="loading">
    <mavon-editor style="height: 100%" v-model="text" @imgAdd="imgAdd" @imgDel="imgDel"></mavon-editor><br>
    <el-select v-model="albumId" placeholder="请选择所在相册">
      <el-option v-for="album in albums" :key="album.id" :label="album.name" :value="album.id">
      </el-option>
    </el-select>
    <div class="tag">
      <el-tag :key="tag" v-for="tag in tags" :closable="true" :disable-transitions="false" @close="handleClose(tag)">
        {{tag}}
      </el-tag>
      <el-input style="width: 100px" class="input-new-tag" v-if="inputTagVisible" v-model="inputTag" ref="saveTagInput" size="mini" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
    </div>
    <el-button @click="publish" type="primary" :disabled="text === '' || albumId === undefined">发 表</el-button>
  </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
  data() {
    return {
      text: '',
      albumId: undefined,
      images: {},
      tags: [],
      cos: null,
      successCount: 0,
      albums: [],
      inputTag: '',
      inputTagVisible: false,
      loading: false
    }
  },
  methods: {
    fetchAlbums() {
      let param = {
        page: 1,
        'per-page': 0,
        fields: 'id,name'
      }
      this.axios
        .get(`/users/${this._id()}/albums`, { params: param })
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
      this.text = ''
      this.images = {}
      this.albumId = undefined
      this.tags = []
    },
    publish() {
      console.log('text', this.text)
      console.log('images', this.images)
      console.log('tags', this.tags)
      this.loading = true
      if (Object.keys(this.images).length > 0) {
        this.uploadimages()
      } else {
        this.newMoment()
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
      if (
        this.successCount ===
        Object.getOwnPropertyNames(this.images).length - 1
      ) {
        this.newMoment()
      }
    },
    newMoment() {
      let body = { text: this.text, user_id: this._id() }
      let header = { Authentication: this._token() }
      this.axios
        .post('/messages', body, { headers: header })
        .then(response => {
          console.log('新增message')
          console.log(response.data)
          let body = {
            user_id: this._id(),
            album_id: this.albumId,
            message_id: response.data.id,
            tags: this.tags
          }
          this.axios
            .post('/moments', body, { headers: header })
            .then(response => {
              console.log('新增moment')
              console.log(response.data)
              this.clearVals()
              this.loading = false
              this.$emit('moment-new-success',response.data)
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
  created() {
    if (this.cos === null) {
      this.cos = this.initCos(this._token())
    }
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
.tag{
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
