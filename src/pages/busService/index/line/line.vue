<template>
  <h2>线路管理</h2>
  <div class="bh-col-md-4 bh-mt-16 bh-pl-0">
    <bh-search @search='search' :value.sync='searchLineName' placeholder='请输入线路名称'></bh-search>
  </div>
  <div class="bh-mt-32 bh-col-md-12 bh-pl-0">
    <button type="button" class="bh-btn bh-btn-primary add-line-btn" @click="addNewLine">
      <i class="iconfont icon-add"></i>添加线路
    </button>
  </div>
  <div class="bh-mt-16 bh-col-md-12 bh-pl-0">
    <template v-for="line in lineData.datas">
    <div class="bh-row line-box-row" v-if="!line.isDeleted">
      <div class="bh-pull-left bus-signpost">
        <i class="iconfont2 icon-bus-signpost"></i>
      </div>
      <div class="bh-border bh-bColor-grey-5 bh-col-md-10 line-box">
        <span class="h3">{{line.lineName}}</span>
        <span class="bh-text-caption bh-caption-default bh-ph-8">创建时间：{{line.createTime}}</span>
        <div class="bh-text-caption bh-caption-default">{{line.lineCombine}}</div>
        <div class="line-operator">
          <!--
          <i class="iconfont icon-arrowupward"></i>
          <i class="iconfont icon-arrowdownward"></i>
          -->
          <i class="iconfont2 icon-bus-edit" @click="editLine(line)"></i>
          <i class="iconfont2 icon-bus-bin" @click="deleteLine"></i>
          <a href="javascript:void(0);" @click="busPlan">班车安排</a>
        </div>
      </div>
    </div>
    </template>
    <bh-pagination :pagenum.sync='lineData.pageNumber' :pagesize='lineData.pageSize' :total-size='lineData.total' @page-change='gotoPage'></bh-pagination>
  </div>
</template>
<script type="text/ecmascript-6">
  import service from '../../service'
  import BhInput from 'bh-vue/bh-input/bhInput.vue'
  import BhSearch from  'bh-vue/bh-search/bhSearch.vue'
  import BhPagination from 'bh-vue/bh-pagination/bhPagination.vue'
  import lineDialog from './lineDialog.vue'
  import busDialog from './busDialog.vue'

  let showLineDialog = () => {
    Utils.paperDialog({
      title: "添加线路",
      currentView: 'lineDialog'
    });
  };

  let showBusDialog = () => {
    Utils.paperDialog({
      title: "班车安排",
      currentView: 'busDialog'
    });
  };

  export default {
    data() {
      return {
        searchLineName: '',
        lineData: {}
      }
    },
    methods: {
      search() {
        this.lineDatasFill();
      },
      addNewLine() {
        this.ps.line = {
          lineName: '',
          directionId: '',
          stations: [
            {stationsId: '', lastItem: true}
          ]
        };
        showLineDialog();
      },
      deleteLine(line) {
        this.lineDatasFill();
      },
      gotoPage() {
        this.lineDatasFill();
      },
      lineDatasFill() {
        let param = {};
        param.searchName = this.searchLineName;
        param.pageSize = this.lineData.pageSize || 10;
        param.pageNumber = this.lineData.pageNumber + 1 || 0;
        $.get(service.api.busLines, param).done((res)=>{
          this.lineData = res;
        });
      },
      editLine(line) {
        this.ps.line = line;
        showLineDialog();
      },
      busPlan(line) {
        showBusDialog();
      }
    },
    ready() {
      $.get(service.api.busMetaDirections).done((res)=>{
        this.ps.directions = res.datas;
      });
      $.get(service.api.busMetaStations).done((res)=>{
        this.ps.stations = res.datas;
      });
      this.lineDatasFill();
    },
    components: {BhInput, BhSearch, BhPagination},
    computed: {
      ps(){
        return this.$store.state.index
      }
    }
  }
</script>
<style scoped>
  .bh-pl-0 {
    padding-left: 0 !important;
  }
  .add-line-btn {
    margin-left: 0;
  }
  .line-box {
    margin-left: 12px;
    height: 68px;
    padding: 14px 12px;
  }
  .line-box-row {
    margin-bottom: 8px;
  }
  .line-box-row .bus-signpost {
    padding-top: 24px;
  }
  .line-box-row i.icon-bus-signpost {
    margin-left: 12px;
    font-size: 32px;
  }
  .line-box-row>img{
    margin-top: 16px;
    margin-left: 10px;
  }
  .line-operator {
    margin-top: -30px;
    float: right;
  }
  .line-operator>i {
    display: none;
  }
  .line-box:hover {
    background: #f0f1f9;
  }
  .line-box:hover .line-operator>i {
    display: inline-block;
    cursor: pointer;
  }
  .line-operator>* {
    margin-left: 16px;
  }
</style>
