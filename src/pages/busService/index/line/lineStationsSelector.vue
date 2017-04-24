<template>
  <div class="bh-col-md-12">
    <div class="bh-mv-8 bh-mb-16" id="lineStationsRadio">
      <radio :items='ps.allLineStations' :value='ps.allLineStations[0].value' dir='v' @change='radioChange'></radio>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import radio from '../../component/radio.vue'

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
      }
    },
    ready() {
      this.storeStations = this.ps.allLineStations[0].value;
    },
    components: {radio},
    computed: {
      ps() {
        return this.$store.state.index;
      }
    }
  }
</script>
<style type="text/css">
  #lineStationsRadio .bh-radio>label {
    margin-bottom: 12px;
    word-break: break-all;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  #lineStationsRadio .bh-choice-helper {
    font-size: 16px;
  }
  #lineStationsRadio .bh-radio.bh-radio-vertical .bh-choice-helper:before {
    top: 1px;
    cursor: pointer;
  }
  #lineStationsRadio .bh-radio.bh-radio-vertical .bh-choice-helper:after {
    top: 5px;
  }
</style>
