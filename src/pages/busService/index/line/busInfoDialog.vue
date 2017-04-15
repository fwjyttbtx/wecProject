<template>
  <div class="bh-clearfix bh-col-md-12 bh-form-group bh-required">
    <label class="bus-form-label bh-form-label bh-ph-16">班车线路</label>
    <div class="bh-col-md-6">
      {{ps.line.lineName}}
    </div>
  </div>
  <div class="bh-clearfix bh-col-md-12 bh-form-group bh-required">
    <label class="bus-form-label bh-form-label bh-ph-16">确定运行时间</label>
    <div class="bh-col-md-6">
      <div class="bus-info-radio">
        <bh-radio :items='ps.runningTypes' :value.sync='busInfo.runningType' @change='runningTypeChange'></bh-radio>
      </div>
      <div v-if="isSpecify" class="bus-running-date-range">
        <div class="bus-running-date">
          <bh-datetimepicker :value.sync='busInfo.startDate' :options='{format: "yyyy-MM-dd"}'></bh-datetimepicker>
        </div>
        <span class="date-combine">-</span>
        <div class="bus-running-date">
          <bh-datetimepicker :value.sync='busInfo.endDate' :options='{format: "yyyy-MM-dd"}'></bh-datetimepicker>
        </div>
      </div>
    </div>
  </div>
  <div class="bh-clearfix bh-col-md-12 bh-form-group bh-required">
    <label class="bus-form-label bh-form-label bh-ph-16">选择线路类型</label>
    <div class="bh-col-md-6">
      <div class="bus-info-radio">
        <bh-radio :items='ps.lineTypes' :value.sync='busInfo.lineType' @change='lineTypeChange'></bh-radio>
      </div>
      <bh-checklist :source='ps.oneWeekDays' dir='h' @change="daySelectChange"></bh-checklist>
    </div>
  </div>
  <div class="bh-clearfix bh-col-md-12 bh-form-group bh-required">
    <label class="bus-form-label bh-form-label bh-ph-16">指定发车时间</label>
    <div class="bh-col-md-6">
      <div class="bus-running-date">
        <bh-datetimepicker :value.sync='busInfo.startTime' :options='{format: "HH:mm"}'></bh-datetimepicker>
      </div>
    </div>
  </div>
  <div class="bh-clearfix bh-col-md-12 bh-form-group bh-required">
    <label class="bus-form-label bh-form-label bh-ph-16">站点停靠时间</label>
    <div class="bh-col-md-6">
      <div v-for="(index, station) in ps.line.stations" class="scenes-cbrt-record bh-row">
        <div class="scenes-cbrt-left bh-clearfix">
          <div class="scenes-cbrt-no">{{index + 1}}</div>
        </div>
        <div class="scenes-cbrt-right">
          <div class="bh-col-md-12 scenes-cbrt-card-view">
            <label>{{station.stationName}}</label>
            <div class="bus-running-date station-timepicker">
              <bh-datetimepicker :value.sync='station.stopTime' :options='{format: "HH:mm"}'></bh-datetimepicker>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <template v-for="(idx, driver) in drivers">
  <div v-if="driver.isShow" class="bh-clearfix bh-col-md-12 bh-form-group {{idx === 0 ? 'bh-required' : ''}}">
    <label v-if="idx === 0" class="bus-form-label bh-form-label bh-ph-16">司机车辆信息</label>
    <label v-else class="bus-form-label bh-form-label bh-ph-16"></label>
    <div class="bh-col-md-6 driver-info-row">
      <div class="bh-col-md-4">
        <bh-input class="driver-info" :value.sync="driverName" placeholder="司机姓名"></bh-input>
      </div>
      <div class="bh-col-md-4">
        <bh-input class="driver-info" :value.sync="contact" placeholder="司机电话"></bh-input>
      </div>
      <div class="bh-col-md-4">
        <bh-input class="driver-info" :value.sync="numberPlate" placeholder="车牌号"></bh-input>
      </div>
    </div>
    <div class="bh-col-md-2 driver-operation">
      <a href="javascript:void(0);" @click="deleteDriver(idx)" v-if="idx !== 0">删除</a>
      <template v-if="idx !== 0 && driver.operation"> | </template>
      <a href="javascript:void(0);" @click="addDriver" v-if="driver.operation">添加</a>
    </div>
  </div>
  </template>
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
  import BhRadio from 'bh-vue/bh-radio/bhRadio.vue'
  import BhDatetimepicker from 'bh-vue/bh-datetimepicker/bhDatetimepicker.vue'
  import BhChecklist from 'bh-vue/bh-checklist/bhChecklist.vue'

  let closePaperDialog = ()=>{
    Utils.paperDialog('close');
  };

  export default {
    data() {
      return {
        isSpecify: false,
        busInfo: {
          startDate: '',
          endDate: '',
          runningType: 'CYCLE',
          lineType: 'WORKDAYS'
        },
        drivers: [
          {operation: true, isShow: true}
        ]
      }
    },
    methods: {
      addStation() {
        _.each(this.ps.line.stations, (station)=>{
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
      runningTypeChange(value) {
        this.isSpecify = value === 'SPECIFY';
      },
      lineTypeChange(value) {
        _.forEach(this.ps.oneWeekDays, (dayOfWeek, idx) => {
          switch (value) {
            case 'WORKDAYS': dayOfWeek.checked = idx < 5; break;
            case 'WEEKENDS': dayOfWeek.checked = idx > 4; break;
            default: dayOfWeek.checked = false; break;
          }
        });
      },
      daySelectChange() {
        let daysInCheck = [];
        _.forEach(this.ps.oneWeekDays, (dayOfWeek, idx) => {
          if(dayOfWeek.checked) {
            daysInCheck.push(idx);
          }
        });
        if(_.isEqual(daysInCheck, [0, 1, 2, 3, 4])) {
          this.busInfo.lineType = 'WORKDAYS';
        } else if(_.isEqual(daysInCheck, [5, 6])) {
          this.busInfo.lineType = 'WEEKENDS';
        } else {
          this.busInfo.lineType = 'OTHERS';
        }
      },
      addDriver() {
        _.forEach(this.drivers, (driver) => {
          driver.operation = false;
        });
        this.drivers.push({operation: true, isShow: true});
      },
      deleteDriver(idx) {
        this.drivers.splice(idx, 1);
        this.drivers[this.drivers.length - 1]['operation'] = true;
      }
    },
    computed: {
      ps(){
        return this.$store.state.index
      }
    },
    components: {BhInput, DropdownList, BhRadio, BhDatetimepicker, BhChecklist}
  }
</script>
<style scoped>
  .bus-form-label {
    float: left;
    width: 114px;
  }
  .scenes-cbrt-record:first-child:before {
    width: 0;
  }
  .scenes-cbrt-right {
    height: 72px;
    vertical-align: middle;
  }
  .scenes-cbrt-card-view {
    padding-top: 20px;
  }
  .bus-running-date-range>* {
    display: inline-block;
  }
  .bus-running-date-range>span{
    position: absolute;
    line-height: 28px;
  }
  .bus-running-date {
    width: 180px;
    margin-right: 8px;
  }
  .date-combine {
    margin-left: -8px;
  }
  .station-timepicker {
    display: inline-block;
    margin-left: 200px;
  }
  .driver-operation {
    line-height: 28px;
  }
  .driver-info {
    width: 100% !important;
  }
  .driver-info-row>div.bh-col-md-4 {
    padding-left: 0;
  }
  .bus-info-radio {
    margin-left: -4px;
  }
</style>
