<template>
    <div>
        <router-link :to="`/activities/${activity.id}`">
            <span class="title">{{activity.title}}</span>
        </router-link>
        <div>
            <time class="time">{{ activity.create_time }}</time>
        </div>
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
</style>
