<<template>
    <div class="moment">
      <h4>{{moment.user.username}}</h4>
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
}
.time {
  font-size: 13px;
  color: #999;
}
</style>
