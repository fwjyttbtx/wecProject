<template>
  <h2>站点管理</h2>
  <div class="bh-col-md-12 bh-pl-0 bh-mt-32" id="stationNotes">
    <div class="bh-mb-10">
      <div class="bh-border bh-center-block bh-ph-8" id="addNewStation">
        <span v-if="!isAdd" @click="addNewStation">添加站点</span>
        <div v-else>
          <bh-input :value.sync='stationName' placeholder='输入站点名称'></bh-input>
          <i class="iconfont2 icon-bus-yes" @click="addStation"></i>
          <i class="iconfont2 icon-bus-cancel" @click="cancelAdd"></i>
        </div>
      </div>
    </div>
    <template v-for="station in stations">
      <div class="bh-mb-10 station-item" v-if="station.isShow" data-id="{{station.stationId}}">
        <div v-if="!station.isEdit" class="bh-border bh-center-block bh-ph-8 station-scrap">
          <label title="{{station.stationName}}" class="station-name">{{station.stationName}}</label>
          <i class="iconfont2 icon-bus-bin" @click="deleteStation(station)"></i>
          <i class="iconfont2 icon-bus-edit" @click="editMode(station)"></i>
          <i class="iconfont2 icon-bus-drag"></i>
        </div>
        <div v-else class="bh-border bh-center-block bh-ph-8">
          <bh-input :value.sync='station.stationNewName' placeholder='输入站点名称'></bh-input>
          <i class="iconfont2 icon-bus-yes" @click="editStation(station)"></i>
          <i class="iconfont2 icon-bus-cancel" @click="cancelEdit(station)"></i>
        </div>
      </div>
    </template>
  </div>
</template>
<script type="text/ecmascript-6">
  import service from '../../service'
  import BhInput from 'bh-vue/bh-input/bhInput.vue'

  let checkStationName = (stationName) => {
    if(!stationName || stationName.length == 0) {
      Utils.tip("warning", "站点名称不能为空。");
      return false;
    } else if(stationName.length > 20) {
      Utils.tip("warning", "站点名称长度应该小于等于20。");
      return false;
    }
    return true;
  }

  export default {
    data() {
        return {
          stationName: '',
          editStationName: '',
          isAdd: false,
          stations: []
        }
    },
    ready(){
      $('body>main>article>*').css('display', 'table-cell');
      this.$http.post(service.api.busMetaStations).then((response) => {
        let body = response.body;
        _.each(body.datas, (station) => {
            station.isEdit = false;
            station.isShow = true;
        });
        this.stations = body.datas;
        Sortable.create(document.getElementById("stationNotes"), {
          animation: 150,
          draggable: ".station-item",
          handle: ".icon-bus-drag",
          onUpdate: (evt) => {
            let itemArr = $(evt.from).find(".station-item");
            let stationSorts = [];
            _.forEach(itemArr, (item, idx) => {
              stationSorts.push({stationId: $(item).data("id"), stationSort: idx});
            });
            this.$http.post(service.api.updateBusStationSortUrl, {sortedStations: JSON.stringify(stationSorts)}).then((response) => {
              let body = response.body;
              if(body.code !== 200) {
                Utils.tip("danger", body.body);
              }
            });
          }
        });
      });
    },
    methods: {
      addNewStation() {
        if(!this.isAdd) {
          this.isAdd = true;
        }
      },
      editMode(station) {
        station.stationNewName = station.stationName;
        station.isEdit = true;
      },
      cancelAdd() {
        this.isAdd = false;
      },
      addStation() {
        if(!checkStationName(this.stationName)) return;
        this.$http.post(service.api.addOrUpdateBusStation, {stationName: this.stationName}).then((response) => {
          let body = response.body;
          if(body.code === 200) {
            this.stations.push({stationId: body.dataId, stationName: this.stationName, isEdit: false, isShow: true});
            this.stationName = '';
            this.isAdd = false;
          } else {
            BH_UTILS.bhDialogDanger({title: "班车站点添加失败", content: body.msg, buttons: [{text: "确定", className: 'bh-btn-danger'}]});
          }
        });
      },
      cancelEdit(station) {
        station.isEdit = false;
      },
      editStation(station) {
        if(!checkStationName(station.stationNewName)) return;
        this.$http.post(service.api.addOrUpdateBusStation, {
          stationId: station.stationId,
          stationName: station.stationNewName
        }).then((response) => {
          let body = response.body;
          if(body.code === 200) {
            station.stationName = station.stationNewName;
            station.isEdit = false;
          } else {
            BH_UTILS.bhDialogDanger({title: "班车站点编辑失败", content: body.msg, buttons: [{text: "确定", className: 'bh-btn-danger'}]});
          }
        });
      },
      deleteStation(station) {
        BH_UTILS.bhDialogWarning({title: "确定删除吗", content: " ", callback: () => {
          this.$http.post(service.api.removeBusStations, {stationId: station.stationId}).then((response) => {
            let body = response.body;
            if(body.code === 200) {
              station.isShow = false;
            } else {
              BH_UTILS.bhDialogDanger({title: "班车站点删除失败", content: body.msg, buttons: [{text: "确定", className: 'bh-btn-danger'}]});
            }
          });
        }});
      }
    },
    components: {BhInput}
  }
</script>
<style type="text/css" scoped>
  #stationNotes>div {
    width: 25%;
    float: left;
    height: 32px;
    line-height: 32px;
    padding-right: 16px;
  }
  .station-scrap {
    height: 100%;
  }
  .station-name {
    display: inline-block;
    width: calc(100% - 80px);
    overflow: hidden;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  #stationNotes>div i.iconfont2 {
    display: none;
    float: right;
    margin-left: 8px;
    cursor: pointer;
  }
  #stationNotes>div i.iconfont2.icon-bus-drag {
    cursor: move;
  }
  #stationNotes>div:hover i.iconfont2 {
    color: #7f8acd;
    display: inline;
  }
  .bh-pl-0 {
    padding-left: 0 !important;
  }
  #addNewStation>span:hover {
    color: #7f8acd;
    cursor: pointer;
  }
  #addNewStation input, .station-item input.jqx-input {
    width: calc(100% - 48px);
  }
</style>
