<<template>
  <div>
      <router-link :to="'/users/'+loginResult.id+'/index'">
        <h2>{{loginResult.username}}</h2>
      </router-link>
      <el-menu :default-active="$route.path" :router="true" background-color="#F3F3F3">
        <el-menu-item :index="'/users/'+loginResult.id+'/moments'">
            <i class="el-icon-document"></i>
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
  }
};
</script>

<style>

</style>
