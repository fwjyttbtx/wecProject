<template>
  <h2>站-站推荐管理</h2>
  <div class="bh-col-md-12 bh-pl-0 bh-mt-32" id="stationRecommendNotes">
    <div class="bh-mb-10">
      <div class="bh-border bh-center-block bh-ph-8" id="addNewRecommend">
        <span @click="addNewRecommend">添加站-站推荐</span>
      </div>
    </div>
    <template v-for="recommend in recommends">
      <div class="bh-mb-10 recommend-item" v-if="recommend.isShow">
        <div class="bh-border bh-center-block bh-ph-8">
          {{recommend.recommendStart}}-{{recommend.recommendEnd}}
          <i class="iconfont2 icon-bus-bin" @click="deleteRecommend(recommend)"></i>
          <i class="iconfont2 icon-bus-edit" @click="editMode(recommend)"></i>
          <i class="iconfont2 icon-bus-drag"></i>
        </div>
      </div>
    </template>
  </div>
</template>
<script type="text/ecmascript-6">
  import service from '../../service'
  import station2Station from './station2Station.vue'

  let makeEleSortable = ()=> {
    Sortable.create(document.getElementById("stationRecommendNotes"), {
      animation: 150,
      draggable: ".recommend-item",
      handle: ".icon-bus-drag"
    });
  };

  let showStation2StationDialog = (oper)=> {
    Utils.dialog({
      currentView: "station2Station",
      height: 200,
      title: oper + '站-站推荐',
      okEvent: 'station2Station.saveRecommend'
    });
  }

  export default {
    data() {
      return {
        recommends: []
      }
    },
    computed: {
      ps(){
        return this.$store.state.index
      }
    },

    ready(){
      $.get(service.api.busRecommendsGet).done((res)=>{
        _.each(res.datas, (recommend) => {
            recommend.isShow = true;
        });
        this.recommends = res.datas;
      });
      $.get(service.api.busMetaStations).done((res)=>{
        this.ps.stations = res.datas;
      });
      makeEleSortable();
    },
    methods: {
      addNewRecommend() {
        this.ps.recommend = {};
        showStation2StationDialog("添加");
      },
      editMode(recommend) {
        this.ps.recommend.start = {stationId: recommend.startId};
        this.ps.recommend.end = {stationId: recommend.endId};
        showStation2StationDialog("编辑");
      },
      deleteRecommend(recommend) {
        recommend.isShow = false;
      }
    }
  }
</script>
<style type="text/css" scoped>
  #stationRecommendNotes>div {
    width: 50%;
    float: left;
    height: 32px;
    line-height: 32px;
    padding-right: 16px;
  }
  #stationRecommendNotes>div i.iconfont2 {
    display: none;
    float: right;
    margin-left: 8px;
    cursor: pointer;
  }
  #stationRecommendNotes>div i.iconfont2.icon-bus-drag {
    cursor: move;
  }
  #stationRecommendNotes>div:hover i.iconfont2 {
    color: #7f8acd;
    display: inline;
  }
  .bh-pl-0 {
    padding-left: 0 !important;
  }
  #addNewRecommend>span:hover {
    color: #7f8acd;
    cursor: pointer;
  }
</style>
