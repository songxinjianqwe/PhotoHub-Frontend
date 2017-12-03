<template>
  <div>
    <mavon-editor style="height: 100%" v-model="text" @imgAdd="imgAdd" @imgDel="imgDel"></mavon-editor><br>
  </div>
</template>
<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
  data() {
    return {
      text: '',
      images: {},
      cos: null,
      successCount: 0,
    }
  },
  methods: {
    onPublish() {
      console.log('有',Object.keys(this.images).length,'张图片待上传')
      if (Object.keys(this.images).length > 0) {
        this.uploadimages()
      } else {
        this.newMessage()
      }
    },
    newMessage() {
      let body = { text: this.text, user_id: this._id() }
      this.axios.post('/messages', body).then(response => {
        console.log('新增message')
        console.log(response.data)
        this.clearVals()
        this.$emit('message-new-success', response.data.id)
      })
    },
    clearVals() {
      this.successCount = 0
      this.text = ''
      this.images = {}
    },
    imgAdd(pos, $file) {
      console.log($file)
      this.images[pos] = $file
    },
    imgDel(pos) {
      delete this.images[pos]
    },
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
      let fileName = decodeURIComponent(slices[slices.length - 1])
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
        Object.keys(this.images).length
      ) {
        console.log('全部上传完毕')
        this.newMessage()
      }
    },
    //上传失败后回调
    uploadErrorCallBack(result) {
      console.log('发表失败')
      console.log('result:', result)
      this.$message.error('发表失败')
      this.clearVals()
    },
  },
  created() {
    if (this.cos === null) {
      this.cos = this.initCos()
    }
    this.$nextTick(() => {
      this.$on('publish', this.onPublish)
    })
  },
  components: {
    mavonEditor
  }
}
</script>

<style scoped>
</style>
