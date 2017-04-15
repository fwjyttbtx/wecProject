<template>
  <article bh-layout-role="navLeft" class="sc-navLeft-s sc-navLeft-category">
    <h2 id="indexH2">班车服务</h2>
    <nav>
      <bh-nav :source="flatMenus" @trigger="navClick" source-type="flat" v-ref:nav></bh-nav>
    </nav>
    <section>
      <router-view></router-view>
    </section>
  </article>
</template>
<script type="text/ecmascript-6">
  import service from '../service'
  import BhNav from 'bh-vue/bh-nav/bhNav.vue'
  require('statics/busIcons/iconfont.css')

  export default {
    data: () => {
      return {
        flatMenus: [
          {id: 'line', name: "线路管理", action: "link", url: "/line", active: true},
          {id: 'direction', name: "线路方向管理", action: "link", url: "/direction"},
          {id: 'station', name: "站点管理", action: "link", url: "/station"},
          {id: 'recommend', name: "推荐管理", action: "link", url: "/recommend"}
        ]
      }
    },
    ready() {
      // this.$router.replace("/line");
    },
    methods: {
      navClick: (params) => {
        console.log(params.name + "selected");
      }
    },
    components: {BhNav},
    computed: {
      ps(){
        return this.$store.state.busService
      }
    }
  }
</script>
<style type="text/css">
  article[bh-layout-role=navLeft] nav {
    padding: 0 !important;
  }
  /**
  article>* {
    display: table-cell !important;
  }
  */
  .bh-ml-0 {
    margin-left: 0 !important;
  }
</style>
