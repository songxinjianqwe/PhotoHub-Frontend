<template>
    <div v-loading="loading">
        <el-form :model="album" label-width="80px">
            <el-form-item label="相册名称">
                <el-input v-model="album.name"></el-input>
            </el-form-item>
            <el-form-item label="相册标签">
                <el-tag :key="tag.id" v-for="tag in album.tags" :closable="true" :close-transition="false" @close="handleClose(tag.name)">
                    {{tag.name}}
                </el-tag>
                <el-input style="width: 100px" class="input-new-tag" v-if="inputTagVisible" v-model="inputTag" ref="saveTagInput" size="mini" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </el-form-item>
            <el-form-item label="相册描述">
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入相册描述" v-model="album.description">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="edit">修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  props: ['albumFromParent'],
  data() {
    return {
      album: null,
      inputTag: '',
      inputTagVisible: false,
      loading: false
    }
  },
  methods: {
    //处理标签
    handleClose(tagName) {
      console.log('关闭标签', tagName)
      let index = -1
      for (let i = 0; i < this.album.tags.length; ++i) {
        if (this.album.tags[i].name === tagName) {
          console.log('找到了', i)
          index = i
          break
        }
      }
      if (index !== -1) {
        this.album.tags.splice(index, 1)
        console.log('删除后的数组', this.album.tags)
      }
    },
    handleInputConfirm() {
      let inputValue = this.inputTag
      if (inputValue) {
        this.album.tags.push({ name: inputValue.trim() })
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
    edit() {
      this.loading = true
      let body = {
        id: this.album.id,
        name: this.album.name,
        description: this.album.description,
        tags: this.album.tags,
        user_id: this.album.user.id
      }
      this.axios
        .put(`/albums/${this.album.id}`, body)
        .then(response => {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.loading = false
          this.$emit('album-edit-success', response.data)
        })
        .catch(error => {
          this.albumLoading = false
          this.$message.error('修改失败')
          throw error
        })
    },
    copyValue() {
      this.album = JSON.parse(JSON.stringify(this.albumFromParent))
    }
  },
  watch: {
    albumFromParent() {
      this.copyValue()
    }
  },
  created() {
    this.copyValue()
  }
}
</script>

<style scoped>

</style>
