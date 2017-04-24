<template>
  <div class="bh-clearfix bh-col-md-12 bh-form-group bh-required">
    <label class="bus-form-label bh-form-label bh-ph-16">线路名称</label>
    <div class="bh-col-md-6">
      <bh-input :value.sync='line.lineName' placeholder='请输入20字以内的线路名称'></bh-input>
    </div>
  </div>
  <div class="bh-clearfix bh-col-md-12 bh-form-group bh-required">
    <label class="bus-form-label bh-form-label bh-ph-16">线路选择</label>
    <div class="bh-col-md-6">
      <dropdown-list id="directionSelect" :source='ps.directions' :current="{directionId: line.directionId}" @change="directionChange" :filterable='true' display-member='directionName' value-member='directionId' placeholder="请选择线路方向..."></dropdown-list>
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
      <div v-for="(index, station) in line.stations" class="scenes-cbrt-record bh-row">
        <div class="scenes-cbrt-left bh-clearfix">
          <div class="scenes-cbrt-no">{{index + 1}}</div>
        </div>
        <div class="scenes-cbrt-right">
          <div class="bh-col-md-12 scenes-cbrt-card-view">
            <dropdown-list class="station-select" :current="{stationId: station.stationDicId}" @change='stationSelect(station)' :source='ps.stations' :filterable='true' display-member='stationName' value-member='stationId' placeholder="请选择停靠站点..."></dropdown-list>
            <button v-if="index === (line.stations.length - 1)" @click="addStation" type="button" class="add-station bh-btn bh-btn-primary bh-ml-0">添加站点</button>
            <!--
            <a @click="deleteStation(index)" v-if="index !== 0" href="javascript:void(0);">删除</a>
            -->
            <i @click="deleteStation(index, station.stationId)" class="iconfont2 icon-bus-bin bh-color-primary line-station-del" v-if="index !== 0"></i>
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
<script type="text/ecmascript-6">
  import service from '../../service'
  import BhInput from 'bh-vue/bh-input/bhInput.vue'
  import DropdownList from  '../../component/dropdownList.vue'
  import lineStationsSelector from './lineStationsSelector.vue'

  let closePaperDialog = ()=> {
    Utils.paperDialog('close');
  };

  export default {
    data() {
      return {
        line: {}
      }
    },
    methods: {
      addStation() {
        this.line.stations.push({});
        Utils.resetFooter();
      },
      closePaperDialog() {
        closePaperDialog();
      },
      addOrEditStationLine() {
        this.$http.post(service.api.addOrUpdateBusLine, this.line, {
          headers: {'Content-Type': 'application/json;charset=UTF-8'},
          emulateJSON: false
        }).then((response) => {
          let body = response.body;
          if(body.code === 200) {
            // 刷新line列表
            Ubase.invoke("line.reloadLines");
            closePaperDialog();
          } else {
            Utils.tip("danger", body.msg);
          }
        });
      },
      deleteStation(idx, stationId) {
        if(!stationId) {
          this.line.stations.splice(idx, 1);
          Utils.resetFooter();
        } else {
          this.$http.post(service.api.checkBusStationInParking, {stationId: stationId}).then((response) => {
            if(response.body.code !== 200) {
              Utils.tip("danger", "当前站点存在班车停靠信息，无法删除。");
            } else {
              this.line.stations.splice(idx, 1);
              Utils.resetFooter();
            }
          });
        }
      },
      copyLineStations() {
        Utils.dialog({
          currentView: "lineStationsSelector",
          title: '复制已有的线路',
          okEvent: 'lineStationsSelector.copySelectLine'
        });
      },
      stationSelect(station) {
        station.stationDicId = args.item.value;
      },
      directionChange(item) {
        this.line.directionId = item.value;
      }
    },
    ready() {
      this.$http.post(service.api.allCopiesLineStations).then((response) => {
        let body = response.body;
        if(body.code === 200) {
          this.ps.allLineStations = body.datas;
        }
      });
      this.line = this.ps.line;
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
