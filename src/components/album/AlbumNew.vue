<template>
    <div v-loading="loading">
        <el-form ref="albumForm" :model="albumForm" label-width="80px">
            <el-form-item label="相册名称">
                <el-input v-model="albumForm.name"></el-input>
            </el-form-item>
            <el-form-item label="相册标签">
                <el-tag :key="tag" v-for="tag in albumForm.tags" :closable="true" :close-transition="false" @close="handleClose(tag)">
                    {{tag}}
                </el-tag>
                <el-input style="width: 100px" class="input-new-tag" v-if="inputTagVisible" v-model="inputTag" ref="saveTagInput" size="mini" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </el-form-item>
            <el-form-item label="相册描述">
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入相册描述" v-model="albumForm.description">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  data() {
    return {
      albumForm: {
        name: '',
        description: '',
        tags: []
      },
      inputTag: '',
      inputTagVisible: false,
      loading: false
    }
  },
  methods: {
    //处理标签
    handleClose(tag) {
      this.albumForm.tags.splice(this.albumForm.tags.indexOf(tag), 1)
    },
    handleInputConfirm() {
      let inputValue = this.inputTag
      if (inputValue) {
        this.albumForm.tags.push(inputValue.trim())
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
    onSubmit(){
        this.loading = true
        this.albumForm.user_id = this._id()
        console.log('form',this.albumForm)
        let header  = {Authentication : this._token()}
        this.axios.post(`/albums`,this.albumForm,{headers:header})
        .then(response => {
            this.loading = false
            this.$emit('album-new-success',response.data.id);
        }).catch(error =>{
            throw error
        })
    }
  }
}
</script>

<style scoped>

</style>
