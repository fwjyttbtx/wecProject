<template>
  <div class="bh-col-md-12">
    <div class="bh-mv-8 bh-mb-16" id="lineStationsRadio">
      <bh-radio :items='ps.allLineStations' :value.sync='storeStations' dir='v' @change='radioChange'></bh-radio>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import BhRadio from 'bh-vue/bh-radio/bhRadio.vue'

  export default {
    data() {
      return {
        storeStations: {}
      }
    },
    methods: {
      copySelectLine() {
        this.ps.line.stations = this.storeStations;
        Utils.dialog("close");
      },
      radioChange(val) {
        this.storeStations = val;
        console.log(arguments)
      }
    },
    ready() {
      this.storeStations = this.ps.allLineStations[0].value;
    },
    components: {BhRadio},
    computed: {
      ps() {
        return this.$store.state.index;
      }
    }
  }
</script>
<style type="text/css">
  #lineStationsRadio .bh-radio>label {
    margin-bottom: 8px;
  }
  #lineStationsRadio .bh-choice-helper {
    font-size: 16px;
  }
</style>
