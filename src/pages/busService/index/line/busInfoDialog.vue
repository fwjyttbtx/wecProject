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
      <div v-show="busInfo.runningType === 'SPECIFY'" class="bus-running-date-range">
        <div class="bus-running-date">
          <datetimepicker :value.sync='busInfo.startDate' :options='{format: "yyyy-MM-dd"}'></datetimepicker>
        </div>
        <span class="date-combine">-</span>
        <div class="bus-running-date">
          <datetimepicker :value.sync='busInfo.endDate' :options='{format: "yyyy-MM-dd"}'></datetimepicker>
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
        <datetimepicker :value.sync='busInfo.startTime' :options='{format: "HH:mm"}'></datetimepicker>
      </div>
    </div>
  </div>
  <div class="bh-clearfix bh-col-md-12 bh-form-group bh-required">
    <label class="bus-form-label bh-form-label bh-ph-16">站点停靠时间</label>
    <div class="bh-col-md-6">
      <div class="scenes-cbrt-record bh-row" v-for="(index, station) in busInfo.stations">
        <div class="scenes-cbrt-left bh-clearfix">
          <div class="scenes-cbrt-no">{{index + 1}}</div>
        </div>
        <div class="scenes-cbrt-right">
          <div class="bh-col-md-12 scenes-cbrt-card-view">
            <label class="station-label" title="{{station.stationName}}">{{station.stationName}}</label>
            <div class="bus-running-date station-timepicker">
              <datetimepicker :value.sync='station.stopTime' :options='{format: "HH:mm"}'></datetimepicker>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <template v-for="(idx, driver) in busInfo.drivers">
  <div v-if="driver.isShow" class="bh-clearfix bh-col-md-12 bh-form-group {{idx === 0 ? 'bh-required' : ''}}">
    <label v-if="idx === 0" class="bus-form-label bh-form-label bh-ph-16">司机车辆信息</label>
    <label v-else class="bus-form-label bh-form-label bh-ph-16"></label>
    <div class="bh-col-md-6 driver-info-row">
      <div class="bh-col-md-4">
        <bh-input class="driver-info" :value.sync="driver.driverName" placeholder="司机姓名"></bh-input>
      </div>
      <div class="bh-col-md-4">
        <bh-input class="driver-info" :value.sync="driver.contact" placeholder="司机电话"></bh-input>
      </div>
      <div class="bh-col-md-4">
        <bh-input class="driver-info" :value.sync="driver.numberPlate" placeholder="车牌号"></bh-input>
      </div>
    </div>
    <div class="bh-col-md-2 driver-operation">
      <a href="javascript:void(0);" @click="deleteDriver(idx)" v-if="idx !== 0">删除</a>
      <template v-if="idx !== 0 && idx === (busInfo.drivers.length - 1)"> | </template>
      <a href="javascript:void(0);" @click="addDriver" v-if="idx === (busInfo.drivers.length - 1)">添加</a>
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
<script type="text/ecmascript-6">
  import service from '../../service'
  import BhInput from 'bh-vue/bh-input/bhInput.vue'
  import DropdownList from  '../../component/dropdownList.vue'
  import BhRadio from 'bh-vue/bh-radio/bhRadio.vue'
  import BhChecklist from 'bh-vue/bh-checklist/bhChecklist.vue'
  import datetimepicker from '../../component/datetimepicker.vue'

  export default {
    data() {
      return {
        busInfo: {
          busId: Number,
          lineId: Number,
          startDate: String,
          endDate: String,
          runningType: 'CYCLE',
          runningDays: Array,
          lineType: 'WORKDAYS',
          drivers: [
            {isShow: true}
          ],
          stations: []
        }
      }
    },
    ready() {
      if(this.ps.busId) {
        this.$http.post(service.api.selectBusInfoWithIdUrl, {busId: this.ps.busId}).then(response => {
          let body = response.body;
          if(body.code === 200) {
            this.busInfo = body.busInfo;
            _.forEach(this.ps.oneWeekDays, days => {
                days.checked = _.includes(body.busInfo.runningDays, days.value);
            });
          } else {
            Utils.tip("danger", body.msg);
          }
        }, ex => {
          console.error(ex);
          BH_UTILS.bhDialogDanger({
            content: "未知原因导致请求失败，请刷新重试或联系管理员。",
            buttons: [{text: "确定", className: 'bh-btn-danger'}]
          });
        });
      } else {
        this.busInfo.lineId = this.ps.line.lineId;
        this.busInfo.stations = this.ps.line.stations;
      }
    },
    methods: {
      runningTypeChange() {
        Utils.resetFooter();
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
        let daysInCheck = [], selectedDays = [];
        _.forEach(this.ps.oneWeekDays, (dayOfWeek, idx) => {
          if(dayOfWeek.checked) {
            daysInCheck.push(idx);
            selectedDays.push(dayOfWeek.value);
          }
        });
        if(_.isEqual(daysInCheck, [0, 1, 2, 3, 4])) {
          this.busInfo.lineType = 'WORKDAYS';
        } else if(_.isEqual(daysInCheck, [5, 6])) {
          this.busInfo.lineType = 'WEEKENDS';
        } else {
          this.busInfo.lineType = 'OTHERS';
        }
        this.busInfo.runningDays = selectedDays;
      },
      addDriver() {
        this.busInfo.drivers.push({isShow: true});
        Utils.resetFooter();
      },
      deleteDriver(idx) {
        this.drivers.splice(idx, 1);
        Utils.resetFooter();
      },
      closePaperDialog() {
        Utils.paperDialog('close');
      },
      addOrEditStationLine() {
        this.$http.post(service.api.addOrUpdateBusInfoUrl, this.busInfo, {
          headers: {'Content-Type': 'application/json;charset=UTF-8'},
          emulateJSON: false
        }).then((response) => {
          let body = response.body;
          if(body.code === 200) {
            Utils.paperDialog('close');
            Ubase.invoke("busDialog.reloadTable");
          } else {
            Utils.tip("danger", body.msg);
          }
        });
      },
    },
    computed: {
      ps(){
        return this.$store.state.index
      }
    },
    components: {BhInput, DropdownList, BhRadio, datetimepicker, BhChecklist}
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
  .station-label {
    display: inline-block;
    width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
    margin-top: -4px;
  }
  .station-timepicker {
    display: inline-block;
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
