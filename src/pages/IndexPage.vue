<template>
  <div>
    <!-- 主要内容 -->
    <div class="index-wrap">
      <!-- 左侧 -->
      <div class="index-left">
        <!-- 发表 -->
        <div class="post-block">
          <ul class="post-nav">
            <li class="el-icon-plus" @click="momentNewDialogVisible = true">发表动态</li>
            <li class="el-icon-picture" @click="albumNewDialogVisible = true">创建相册</li>
          </ul>
        </div>
        <!-- 动态 -->
        <div class="feed-block">
          <moment v-for="item in feed.items" :key="item.id" :moment="item"></moment>
        </div>
      </div>

      <!-- 右侧 -->
      <div class="index-right">
        <div class="user-block">
          <user-menu v-if="isLogin === true" :loginResult="loginResult"></user-menu>
          <login-form v-else></login-form>
        </div>
        <div class="top-moments">
        </div>
      </div>
    </div>

    <!-- 新增动态Dialog -->
    <el-dialog title="新增动态" :visible.sync="momentNewDialogVisible" width="30%" :before-close="handleDialogClose">
      <message-new></message-new>
    </el-dialog>

    <!-- 新增AlbumDialog -->
    <el-dialog title="新增相册" :visible.sync="albumNewDialogVisible" width="30%" :before-close="handleDialogClose">
      <album-new></album-new>
    </el-dialog>
  </div>
</template>

<script>
import MessageNew from "@/components/message/MessageNew";
import AlbumNew from "@/components/album/AlbumNew";
import Moment from "@/components/moment/Moment";
import LoginForm from "@/components/user/LoginForm";
import UserMenu from "@/components/user/UserMenu";

export default {
  props: ["loginResult", "isLogin"],
  data() {
    return {
      momentNewDialogVisible: false,
      albumNewDialogVisible: false,
      feed: [],
      feedPage: 1
    };
  },
  methods: {
    handleDialogClose() {
      this.momentNewDialogVisible = false;
      this.albumNewDialogVisible = false;
    },
    fetchFeed() {
      if (this.isLogin) {
        let params = { page: this.feedPage, per_page: this.DEFAULE_PER_PAGE };
        let headers = { Authentication: this.loginResult.token };
        this.axios
          .get(`/users/${this.loginResult.id}/feed`, {
            params: params,
            headers: headers
          })
          .then(response => {
            this.feed = response.data;
            console.log("获取用户feed成功");
            console.log(this.feed);
          })
          .catch(error => {
            throw error;
          });
      } else {
        let params = { page: this.feedPage, per_page: this.DEFAULE_PER_PAGE };
        this.axios
          .get("/moments/hot", { params: params })
          .then(response => {
            this.feed = response.data;
            console.log("热门动态获取成功");
            console.log(this.feed);
          })
          .catch(error => {
            throw error;
          });
      }
    }
  },
  created() {
    this.fetchFeed();
  },
  components: {
    MessageNew,
    AlbumNew,
    Moment,
    LoginForm,
    UserMenu
  }
};
</script>
<style scoped>
.index-wrap {
  width: 1200px;
  margin: 0 auto;
  overflow: hidden;
}

.index-left {
  float: left;
  width: 800px;
  text-align: left;
}

.index-right {
  float: left;
}
.post-nav {
  position: relative;
  z-index: 9;
  margin: 0 0 18px;
  padding: 1px 2px 3px;
  background-position: 0 0;
}
.post-nav li {
  cursor: pointer;
  margin-right: 20px;
}
</style>