<template>
  <div class="bh-clearfix bh-col-md-12 bh-form-group bh-required">
    <label class="bus-form-label bh-form-label bh-ph-16">线路名称</label>
    <div class="bh-col-md-6">
      <bh-input :value.sync='ps.line.lineName' placeholder='请输入20字以内的线路名称'></bh-input>
    </div>
  </div>
  <div class="bh-clearfix bh-col-md-12 bh-form-group bh-required">
    <label class="bus-form-label bh-form-label bh-ph-16">线路选择</label>
    <div class="bh-col-md-6">
      <dropdown-list id="directionSelect" :source='ps.directions' :current.sync="ps.line" :filterable='true' display-member='directionName' value-member='directionId' placeholder="请选择线路方向..."></dropdown-list>
    </div>
  </div>
  <div class="bh-clearfix bh-col-md-12 bh-form-group bh-required">
    <label class="bus-form-label bh-form-label bh-ph-16">停靠站点</label>
    <div class="bh-col-md-6">
      <button type="button" class="bh-btn bh-btn-default bh-ml-0" @click="copyLineStations">复制已有站点</button>
    </div>
  </div>
  <div class="bh-clearfix bh-col-md-12 bh-form-group">
    <label class="bus-form-label bh-form-label bh-ph-16"></label>
    <div class="bh-col-md-6">
      <div v-for="(index, station) in ps.line.stations" class="scenes-cbrt-record bh-row">
        <div class="scenes-cbrt-left bh-clearfix">
          <div class="scenes-cbrt-no">{{index + 1}}</div>
        </div>
        <div class="scenes-cbrt-right">
          <div class="bh-col-md-12 scenes-cbrt-card-view">
            <dropdown-list class="station-select" :current.sync="station" :source='ps.stations' :filterable='true' display-member='stationName' value-member='stationId' placeholder="请选择停靠站点..."></dropdown-list>
            <button v-if="station.lastItem" @click="addStation" type="button" class="add-station bh-btn bh-btn-primary bh-ml-0">添加站点</button>
            <!--
            <a @click="deleteStation(index)" v-if="index !== 0" href="javascript:void(0);">删除</a>
            -->
            <i @click="deleteStation(index)" class="iconfont2 icon-bus-bin bh-color-primary line-station-del" v-if="index !== 0"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="bh-clearfix bh-col-md-12 bh-form-group">
    <label class="bus-form-label bh-form-label bh-ph-16"></label>
    <div class="bh-col-md-6">
      <div class="bh-btn-group">
        <button @click="addOrEditStationLine" type="button" class="bh-btn bh-btn-primary bh-ml-0">确定</button>
        <button @click="closePaperDialog" type="button" class="bh-btn bh-btn-default">取消</button>
      </div>
    </div>
  </div>
</template>
<script>
  import BhInput from 'bh-vue/bh-input/bhInput.vue'
  import DropdownList from  '../../component/dropdownList.vue'
  import lineStationsSelector from './lineStationsSelector.vue'

  let closePaperDialog = ()=>{
    Utils.paperDialog('close');
  };

  export default {
    methods: {
      addStation() {
        _.forEach(this.ps.line.stations, (station) => {
            station.lastItem = false;
        });
        this.ps.line.stations.push({lastItem: true});
      },
      closePaperDialog() {
        closePaperDialog();
      },
      addOrEditStationLine() {
        closePaperDialog();
      },
      deleteStation(idx) {
        this.ps.line.stations.splice(idx, 1);
        this.ps.line.stations[this.ps.line.stations.length - 1]['lastItem'] = true;
        console.log(this.ps.line.stations);
      },
      copyLineStations() {
        Utils.dialog({
          currentView: "lineStationsSelector",
          title: '复制已有的线路',
          okEvent: 'lineStationsSelector.copySelectLine'
        });
      }
    },
    computed: {
      ps(){
        return this.$store.state.index
      }
    },
    components: {BhInput, DropdownList}
  }
</script>
<style scoped>
  .bus-form-label {
    float: left;
    width: 114px;
  }
  #directionSelect {
    width: calc(100% - 24px) !important;
  }
  .scenes-cbrt-record:first-child:before {
    width: 0;
  }
  .scenes-cbrt-right {
    height: 72px;
    vertical-align: middle;
  }
  .station-select {
    width: 220px !important;
    height: 32px !important;
    line-height: 26px;
    margin-right: 12px;
    float: left;
  }
  .scenes-cbrt-card-view {
    padding-top: 20px;
  }
  .line-station-del {
    cursor: pointer;
    line-height: 30px;
  }
</style>
