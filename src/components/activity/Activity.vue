<template>
    <div>
        <router-link :to="`/activities/${activity.id}`">
            <span class="title">{{activity.title}}</span>
        </router-link>
        <div>
            <time class="time">{{ activity.create_time }}</time>
        </div>
        <table>
            <tr v-for="row in 2" :key="row">
                <td v-for="col in 3" :key="col">
                    <img class="thumbnail" :src="activity.thumbnails[( row - 1 )*2 + col -1 ]"></img>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
  props: ['activity']
}
</script>

<style>
.time {
  font-size: 13px;
  color: #999;
}
.title {
  font-weight: bold;
  font-size: 24px;
}
.thumbnail {
  width: 125px;
  height: 125px;
}
</style>
