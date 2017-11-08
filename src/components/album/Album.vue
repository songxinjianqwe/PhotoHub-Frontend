<template>
    <div>
        <div>
            <router-link :to="`/albums/${album.id}`">
                <span class="album-name">{{album.name}}</span>
            </router-link>
        </div>
        <div>
            <time class="time">{{ album.create_time }}</time>
        </div>
        <el-tag v-for="tag in album.tags" :key="tag.id">
            <router-link :to="`/tags/${tag.id}`">
                {{tag.name}}
            </router-link>
        </el-tag>
        <!-- 显示6张图片 -->
        <table>
            <tr v-for="row in 2" :key="row">
                <td v-for="col in 3" :key="col">
                    <img class="thumbnail" :src="album.thumbnails[( row - 1 )*2 + col -1 ]"></img>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    props:['album']
}
</script>

<style scoped>
.time {
  font-size: 13px;
  color: #999;
}
.album-name {
  font-size: 18px;
  font-weight: bold;
}
.thumbnail {
  width: 125px;
  height: 125px;
}
</style>
