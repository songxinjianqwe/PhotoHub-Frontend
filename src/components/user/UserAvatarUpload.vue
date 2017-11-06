<<template>
    <div class="avatar">
        <!-- 上传头像 -->
        <el-popover ref="uploadAvatar" placement="bottom" width="100" trigger="hover">
            <el-button type="primary" @click="avatarUploadDialogVisible = true">更换头像
                <i class="el-icon-upload el-icon--right"></i>
            </el-button>
        </el-popover>
        <img :src="avatar" v-popover:uploadAvatar></img>

        <!-- 上传头像Dialog -->
        <el-dialog class="avatar-dialog" title="上传头像" :visible.sync="avatarUploadDialogVisible" width="50%">
        
        <!-- http-request就当做一个选择图片后的钩子函数就好，真正上传是要等确认时才进行的 -->
        <!-- action属性无任何作用，但不可不设置，会报错 -->
        <el-upload action="" class="avatar-uploader" :show-file-list="false" :before-upload="beforeAvatarUpload" :http-request="showPreview">
            <!-- 预览 -->
            <img v-if="image.dataUrl" :src="image.dataUrl" class="avatar-preview">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        
        <el-progress class="progress-bar" :text-inside="true" :stroke-width="18" :percentage="image.progress"></el-progress>
        
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancelUploadAvatar">取 消</el-button>
            <el-button :disabled="image.dataUrl === ''" type="primary" @click="uploadAvatar">上 传</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  props: ['avatar'],
  data() {
    return {
      avatarUploadDialogVisible: false,
      image: {
        name: '',
        dataUrl: '',
        progress: 0
      },
      cos: null
    }
  },
  methods: {
    //检查文件类型与大小是否合适
    beforeAvatarUpload(file) {
      console.log('beforeAvatarUpload', file)
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 <= 5
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
      return isJPG && isLt2M
    },
    //显示本地文件的预览图
    showPreview(upload) {
      let reader = new FileReader()
      reader.readAsDataURL(upload.file)
      reader.onload = e => {
        this.image.dataUrl = e.target.result
        this.image.name = upload.file.name
      }
    },
    //上传图片
    uploadAvatar() {
      let path = this.COS_IMG_BASE_PATH + this.image.name
      let binary = this.base64ToBinary(this.image.dataUrl)
      this.cos.uploadFile(
        this.uploadSuccessCallBack,
        this.uploadErrorCallBack,
        this.uploadProgressCallBack,
        'photohub',
        path,
        binary,
        0
      )
    },
    //取消上传
    cancelUploadAvatar() {
      this.clearVars()
      this.avatarUploadDialogVisible = false
    },
    //上传成功后回调
    uploadSuccessCallBack(result) {
      console.log('上传成功')
      this.$message({
        message: '头像上传成功',
        type: 'success'
      })
      this.avatarUploadDialogVisible = false
      this.$emit('avatar-upload-success', result.data.source_url)
      this.clearVars()
    },
    //上传失败后回调
    uploadErrorCallBack(result) {
      console.log('上传失败')
      console.log('result:', result)
      this.$message.error('头像上传失败')
      this.clearVars()
    },
    //上传时回调
    uploadProgressCallBack(curr) {
      console.log('上传中...')
      console.log('当前进度', curr)
      this.image.progress = Math.round(curr * 100)
    },
    //清除上一次上传的图片数据，避免下次上传时会显示上次图片的预览图
    clearVars() {
      this.image.dataUrl = ''
      this.image.name = ''
      this.image.progress = 0
    }
  },
  created() {
    if (this.cos === null) {
      this.cos = this.initCos()
    }
  }
}
</script>

<style scoped>
.avatar img {
  width: 100px;
  height: 100px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 140px;
  height: 140px;
  line-height: 140px;
  text-align: center;
}
.avatar-preview {
  width: 140px;
  height: 140px;
  display: block;
}
.progress-bar {
  margin-top: 20px;
  width: 150px;
  margin-left: auto;
  margin-right: auto;
}

.avatar-dialog {
  text-align: center;
  margin-left: 280px;
  width: 800px;
}
</style>
