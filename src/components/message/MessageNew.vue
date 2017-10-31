<template>
    <div id="editor">
        <mavon-editor style="height: 80%"></mavon-editor><br>
        <el-upload action="" class="video-uploader" :show-file-list="false" :before-upload="beforeVideoUpload" :http-request="showPreview">
            <img v-if="video.dataUrl" :src="video.dataUrl" class="video">
            <i v-else class="el-icon-plus video-uploader-icon"></i>
        </el-upload>
        <el-progress class="progress-bar" :text-inside="true" :stroke-width="18" :percentage="video.progress"></el-progress>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancelUploadVideo">取 消</el-button>
            <el-button :disabled="video.dataUrl === ''" type="primary" @click="uploadVideo">上 传</el-button>
        </span>
    </div>
</template>

<script>
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
export default {
  props: ["loginResult"],
  data() {
    return {
      videoUploadDialogVisible: false,
      cos: null,
      appid: 1252651195,
      bucket: "photohub",
      cosBasePath: "user/video/",
      video: {
        name: "",
        dataUrl: "",
        progress: 0
      }
    };
  },
  methods: {
    submit() {},
    //检查文件类型与大小是否合适
    beforeVideoUpload(file) {
      console.log("beforeVideoUpload", file);
      const isVideo =
        file.type === "video/mp4" || file.type === "video/x-msvideo";
      const isLt20M = file.size / 1024 / 1024 <= 20;
      if (!isVideo) {
        this.$message.error("上传视频只能是 MP4/AVI 格式!");
        return false;
      }
      if (!isLt20M) {
        this.$message.error("上传视频大小不能超过 20MB!");
        return false;
      }
      return isVideo && isLt20M;
    },
    //显示本地文件的预览图
    showPreview(upload) {
      let reader = new FileReader();
      reader.readAsDataURL(upload.file);
      reader.onload = e => {
        // reader onload start
        this.video.dataUrl = e.target.result;
        this.video.name = upload.file.name;
      }; // reader onload end
    },
    //初始化cos：腾讯云存储库
    initCos(path) {
      console.log("初始化cos");
      this.cos = new CosCloud({
        appid: this.appid, // APPID 必填参数
        bucket: this.bucket, //bucketName 必填参数
        region: "sh", //地域信息 必填参数 华南地区填gz 华东填sh 华北填tj,
        getAppSign: callback => {
          console.log("getAppSign");
          console.log("尝试获取服务器token");
          let params = {
            bucket: this.bucket,
            cosPath: path
          };
          let header = { Authentication: this.loginResult.token };
          this.axios
            .get("/tokens/cos", { params: params, headers: header })
            .then(response => {
              console.log("cos获取服务器token 成功", response.data);
              callback(response.data);
            })
            .catch(error => {
              throw error;
            });
        }
      });
    },
    //上传图片
    uploadVideo() {
      let path = this.cosBasePath + this.video.name;
      let binary = this.base64ToBinary(this.video.dataUrl);
      if (this.cos === null) {
        this.initCos(path);
      }
      this.cos.uploadFile(
        this.uploadSuccessCallBack,
        this.uploadErrorCallBack,
        this.uploadProgressCallBack,
        this.bucket,
        path,
        binary,
        0
      );
    },
    //取消上传
    cancelUploadVideo() {
      this.clearVars();
      this.videoUploadDialogVisible = false;
    },
    //上传成功后回调
    uploadSuccessCallBack(result) {
      console.log("上传成功");
      this.$message({
        message: "头像上传成功",
        type: "success"
      });
      this.videoUploadDialogVisible = false;
      this.user.video = result.data.source_url;
      let header = { Authentication: this.loginResult.token };
      this.axios
        .put("/users", this.user, { headers: header })
        .then(response => {
          console.log("更新完毕");
        })
        .catch(error => {
          console.log("更新失败");
        });
      this.clearVars();
    },
    //上传失败后回调
    uploadErrorCallBack(result) {
      console.log("上传失败");
      console.log("result:", result);
      this.$message.error("头像上传失败");
      this.clearVars();
    },
    //上传时回调
    uploadProgressCallBack(curr) {
      console.log("上传中...");
      console.log("当前进度", curr);
      this.video.progress = Math.round(curr * 100);
    },
    //清除上一次上传的图片数据，避免下次上传时会显示上次图片的预览图
    clearVars() {
      this.video.dataUrl = "";
      this.video.name = "";
      this.video.progress = 0;
    }
  },
  components: {
    mavonEditor
  }
};
</script>

<style>
#editor {
  margin:0 auto;
  width: 100%;
  text-align: center;
}

.video-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.video-uploader .el-upload:hover {
  border-color: #20a0ff;
}

.video-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 140px;
  height: 140px;
  line-height: 140px;
  text-align: center;
}

.video {
  width: 140px;
  height: 140px;
  display: block;
}

.progress-bar {
    margin:0 auto;
    margin-bottom: 10px;
    width: 100px;
}

</style>
