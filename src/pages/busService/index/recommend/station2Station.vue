<template>
  <div class='content'>
    <dropdown-list :source='ps.stations' :current="ps.recommend.start" :filterable='true' display-member='stationName' value-member='stationId' placeholder="请选择上车站..." class="bh-mb-8"></dropdown-list>
    <dropdown-list :source='ps.stations' :current="ps.recommend.end" :filterable='true' display-member='stationName' value-member='stationId' placeholder="请选择下车站..."></dropdown-list>
  </div>
</template>
<script>
  import DropdownList from '../../component/dropdownList.vue'

  export default {
    data() {
      return {
      }
    },
    methods: {
      saveRecommend() {
        Utils.dialog("close");
      }
    },
    computed: {
      ps(){
        return this.$store.state.index
      }
    },
    components: {DropdownList}
  }
</script>
