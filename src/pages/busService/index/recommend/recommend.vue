<template>
  <h2>站-站推荐管理</h2>
  <div class="bh-col-md-12 bh-pl-0 bh-mt-32" id="stationRecommendNotes">
    <div class="bh-mb-10">
      <div class="bh-border bh-center-block bh-ph-8" id="addNewRecommend">
        <span @click="addNewRecommend">添加站-站推荐</span>
      </div>
    </div>
    <template v-for="recommend in ps.recommends">
      <div class="bh-mb-10 recommend-item" v-if="recommend.isShow" data-id="{{recommend.recommendId}}">
        <div class="bh-border bh-center-block bh-ph-8">
          {{recommend.startStationName}}-{{recommend.endStationName}}
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
      $('body>main>article>*').css('display', 'table-cell');
      this.$http.post(service.api.busRecommendsGet).then((response) => {
        let body = response.body;
        _.each(body.datas, (recommend) => {
            recommend.isShow = true;
        });
        this.ps.recommends = body.datas;
        Sortable.create(document.getElementById("stationRecommendNotes"), {
          animation: 150,
          draggable: ".recommend-item",
          handle: ".icon-bus-drag",
          onUpdate: (evt) => {
            let itemArr = $(evt.from).find(".recommend-item");
            let recommendSorts = [];
            _.forEach(itemArr, (item, idx) => {
              recommendSorts.push({recommendId: $(item).data("id"), recommendSort: idx});
            });
            this.$http.post(service.api.updateBusRecommendSortUrl, {sortedRecommends: JSON.stringify(recommendSorts)}).then((response) => {
              let body = response.body;
              if(body.code !== 200) {
                Utils.tip("danger", body.body);
              }
            });
          }
        });
      });
      this.$http.post(service.api.busMetaStations).then((response)=>{
        this.ps.stations = response.body.datas;
      });
    },
    methods: {
      addNewRecommend() {
        this.ps.recommend = {start: {stationId: ""}, end: {stationId: ""}};
        showStation2StationDialog("添加");
      },
      editMode(recommend) {
        this.ps.recommend.recommendId = recommend.recommendId;
        this.ps.recommend.start = {stationId: recommend.startId};
        this.ps.recommend.end = {stationId: recommend.endId};
        showStation2StationDialog("编辑");
      },
      deleteRecommend(recommend) {
        BH_UTILS.bhDialogWarning({
          title: "确定删除吗", content: " ", callback: () => {
            this.$http.post(service.api.removeSearchRecommend, {recommendId: recommend.recommendId}).then((response) => {
              let body = response.body;
              if (body.code === 200) {
                recommend.isShow = false;
              } else {
                BH_UTILS.bhDialogDanger({
                  title: "搜索推荐删除失败",
                  content: body.msg,
                  buttons: [{text: "确定", className: 'bh-btn-danger'}]
                });
              }
            });
          }
        });
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
