<template>
    <div class="follow" v-loading="loading">
        <h1>我的关注</h1>
        <follow-group @follow-group-edit-success="onFollowGroupEditSuccess" @follow-group-remove-success="onFollowGroupRemoveSuccess" v-for="group in groups" :key="group.id" :group="group"></follow-group>
        <el-button @click="newFollowGroup">添加分组</el-button>
    </div>
</template>

<script>
import FollowGroup from '@/components/follow/FollowGroup'
export default {
  data() {
    return {
      groups: [],
      loading: true
    }
  },
  methods: {
    onFollowGroupEditSuccess(newGroup) {
      for (let group of this.groups) {
        if (group.id === newGroup.id) {
          group.group_name = newGroup.group_name
          break
        }
      }
    },
    onFollowGroupRemoveSuccess(groupId) {
      for (let i = 0; i < this.groups.length; ++i) {
        if (this.groups[i].id == groupId) {
          this.groups.splice(i, 1)
        }
      }
    },
    fetchFollowGroup() {
      this.axios
        .get(`/users/${this._id()}/follow_groups`)
        .then(response => {
          this.groups = response.data.items
          console.log('this.groups', this.groups)
          this.loading = false
        })
        .catch(error => {
          throw error
        })
    },
    newFollowGroup() {
      this.$prompt('请输入分组名', '添加分组', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.loading = true
        let body = {
          user_id: this._id(),
          group_name: value
        }
        this.axios
          .post(`/users/${this._id()}/follow_groups`, body)
          .then(response => {
            this.groups.push(response.data)
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.loading = false
          })
      })
    }
  },
  components: {
    FollowGroup
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      console.log('beforeRouteEnter:跳转至', to.path)
      vm.fetchFollowGroup()
    })
  }
}
</script>

<style>

</style>
