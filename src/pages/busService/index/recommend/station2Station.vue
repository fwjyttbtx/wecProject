<template>
  <div class='content'>
    <dropdown-list :source='ps.stations' :current.sync="recommend.start" :filterable='true' display-member='stationName' value-member='stationId' placeholder="请选择上车站..." class="bh-mb-8"></dropdown-list>
    <dropdown-list :source='ps.stations' :current.sync="recommend.end" :filterable='true' display-member='stationName' value-member='stationId' placeholder="请选择下车站..."></dropdown-list>
  </div>
</template>
<script type="text/ecmascript-6">
  import service from '../../service'
  import DropdownList from '../../component/dropdownList.vue'

  export default {
    data() {
      return {
        recommend: {
          recommendId: '',
          start: {stationId: ''},
          end: {stationId: ''}
        }
      }
    },
    methods: {
      saveRecommend() {
        let recommend = {};
        recommend.recommendId = this.recommend.recommendId || '';
        recommend.startStation = this.recommend.start.value;
        recommend.endStation = this.recommend.end.value;
        if(!recommend.startStation || !recommend.endStation) {
          Utils.tip("warning", "站-站推荐的起始或结束站点不能为空。");
          return;
        }
        this.$http.post(service.api.saveOrUpdateBusRecommend, recommend).then((response) => {
          let body = response.body;
          if(body.code !== 200) {
            Utils.tip("danger", body.msg);
            return false;
          }
          if(!this.recommend.recommendId) {
            this.ps.recommends.push({
              recommendId: body.dataId,
              startId: this.recommend.start.value,
              startStationName: this.recommend.start.label,
              endId: this.recommend.end.value,
              endStationName: this.recommend.end.label,
              isShow: true
            });
          } else {
            _.forEach(this.ps.recommends, (recommend) => {
              if(recommend.recommendId === this.recommend.recommendId) {
                recommend.startId = this.recommend.start.value;
                recommend.startStationName = this.recommend.start.label;
                recommend.endId = this.recommend.end.value;
                recommend.endStationName = this.recommend.end.label;
              }
            })
          }
          Utils.dialog("close");
        })
      }
    },
    ready() {
      this.recommend.recommendId = this.ps.recommend.recommendId;
      this.recommend.start = this.ps.recommend.start;
      this.recommend.end = this.ps.recommend.end;
    },
    computed: {
      ps(){
        return this.$store.state.index
      }
    },
    components: {DropdownList}
  }
</script>
