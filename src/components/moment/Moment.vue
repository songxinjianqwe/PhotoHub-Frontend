<<template>
    <div class="moment">
      <!-- 如果是在首页显示的，那么moment有一个type属性；如果是在用户主页显示的，那么moment没有type属性 -->
      <div v-if="'type' in moment">
        <h4>{{moment.user.username}}</h4>
        <span v-if="moment.type === 'user'">关注动态</span>  
        <span v-else>热门动态</span>
      </div>
      <time class="time">{{ moment.message.create_time }}</time>
      <div class="article" v-html="compiledMarkdown"></div>
    </div>
</template>
<script>
import Marked from 'marked'
export default {
  props: ['moment'],
  data() {
    return {}
  },
  computed: {
    compiledMarkdown() {
      return Marked(this.moment.message.text, { sanitize: true })
    }
  },
  components: {
    Marked
  }
}
</script>

<style>
.moment {
  display: block;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  width: 600px;
  overflow: hidden;
}
.time {
  font-size: 13px;
  color: #999;
}
</style>
