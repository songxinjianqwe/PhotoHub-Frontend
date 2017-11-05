<template>
    <div class="moment-detail" v-loading="loading">
        <h1 v-if="moment !== null" v-text="moment.user.username"></h1>
        <moment v-if="moment !== null" class="moment" :moment="moment" from="moment-detail" ></moment>
    </div>
</template>
<script>
import Moment from '@/components/moment/Moment'
export default {
  data() {
    return {
      moment: null,
      loading: true
    }
  },
  methods: {
    fetchMoment() {
      console.log('获取moment数据')
      this.axios
        .get(`/moments/${this.$route.params.id}`)
        .then(response => {
          this.moment = response.data
          this.loading = false
        })
        .catch(error => {
          throw error
        })
    }
  },
  components: {
    Moment
  },
  //在/users/:id/index <=> 其他页面 之间跳转时被调用
  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log('beforeRouteEnter:跳转至', to.path)
      vm.fetchMoment()
    })
  }
}
</script>

<style scoped>
.moment-detail {
  text-align: center;
}
.moment {
  margin: auto;
}
</style>
