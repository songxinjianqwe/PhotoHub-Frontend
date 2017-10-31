<<template>
  <div>
      <router-link :to="'/users/'+loginResult.id+'/index'">
        <h2>{{loginResult.username}}</h2>
      </router-link>
      <el-menu @open="handleOpen" background-color="#545c64">
        <el-menu-item :index="'/users/'+loginResult.id+'/moments'">
            <i class="el-icon-location"></i>
            <span slot="title">动态</span>
        </el-menu-item>
        <el-menu-item :index="'/users/'+loginResult.id+'/albums'">
            <i class="el-icon-menu"></i>
            <span slot="title">相册</span>
        </el-menu-item>
        <el-menu-item :index="'/users/'+loginResult.id+'/follows'">
            <i class="el-icon-setting"></i>
            <span slot="title">关注</span>
        </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  props: ["loginResult"],
  data() {
    return {};
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log("key", key);
      console.log("keypath", keyPath);
    }
  }
};
</script>

<style>

</style>
