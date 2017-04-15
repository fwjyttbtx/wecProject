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
      <div class="bh-mb-10 station-item" v-if="station.isShow">
        <div v-if="!station.isEdit" class="bh-border bh-center-block bh-ph-8">
          {{station.stationName}}
          <i class="iconfont2 icon-bus-bin" @click="deleteStation(station)"></i>
          <i class="iconfont2 icon-bus-edit" @click="editMode(station)"></i>
          <i class="iconfont2 icon-bus-drag"></i>
        </div>
        <div v-else class="bh-border bh-center-block bh-ph-8">
          <bh-input :value.sync='station.stationName' placeholder='输入站点名称'></bh-input>
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

  let makeEleSortable = ()=> {
    Sortable.create(document.getElementById("stationNotes"), {
      animation: 150,
      draggable: ".station-item",
      handle: ".icon-bus-drag"
    });
  };

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
      $.get(service.api.busMetaStations).done((res)=>{
          _.each(res.datas, (station) => {
              station.isEdit = false;
              station.isShow = true;
          });
          this.stations = res.datas;
      });
      makeEleSortable();
    },
    methods: {
      addNewStation() {
        if(!this.isAdd) {
          this.isAdd = true;
        }
      },
      editMode(station) {
        station.isEdit = true;
      },
      cancelAdd() {
        this.isAdd = false;
      },
      addStation() {
        this.stations.push({stationName: this.stationName, isEdit: false, isShow: true});
        this.stationName = '';
        //this.isAdd = false;
      },
      cancelEdit(station) {
        station.isEdit = false;
      },
      editStation(station) {
        console.log(station);
        station.isEdit = false;
      },
      deleteStation(station) {
        station.isShow = false;
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
