<template>
  <div class="bh-col-md-12 line-row">
    <i class="iconfont2 icon-bus-signpost"></i>
    <div class="line-detail">
      <span class="h3">线路1</span>
      <div class="bh-text-caption bh-caption-default">站点1→站点2→站点3→站点4→站点5→站点6→站点7</div>
    </div>
    <button @click="addNewBus" class="bh-btn bh-btn-primary bus-add-btn" type="button">
      <i class="iconfont icon-add"></i>添加班车
    </button>
  </div>
  <div class="bh-col-md-12 bh-mv-8 bh-mb-16">
    <emap-datatable v-ref:dt1 :options='options' @edit='edit' @del='del' @change="busRunningStateChange"></emap-datatable>
  </div>
</template>
<script>
  import service from '../../service'
  import EmapDatatable from 'bh-vue/emap-datatable/emapDatatable.vue'
  import busInfoDialog from './busInfoDialog.vue'

  let showBusInfoDialog = (oper) => {
    Utils.paperDialog({
      title: oper + "班车",
      currentView: 'busInfoDialog'
    });
  };

  export default {
    data() {
      return {
        options: {
          pagePath: service.api.busPlanMetaModel,
          url: service.api.busPlanDatas,
          action: "busPlanList",
          method: 'get',
          readyName: 'datatableReady',
          customColumns: [
            {
              type: 'tpl',
              colField: 'runningState',
              column: {
                cellsRenderer: function(row, column, value, rowData) {
                    if(value) {
                      return  '<div class="bh-switch bus-running-state">' +
                              '   <label class="bh-switch-label bh-color-success">运行中</label>' +
                              '   <input type="checkbox" checked="" data-name="change">' +
                              '   <label class="bh-switch-helper"></label>' +
                              '</div>';
                    } else {
                      return  '<div class="bh-switch bus-running-state">' +
                              '   <label class="bh-switch-label">停运</label>' +
                              '   <input type="checkbox" data-name="change">' +
                              '   <label class="bh-switch-helper"></label>' +
                              '</div>';
                    }
                }
              }
            }
          ],
          operations: {
            title: "操作",
            width: 180,
            items: [{
              title: "编辑",
              name: "edit",
              type: "link"
            }, {
              title: "删除",
              name: "del",
              type: "link"
            }]
          }
        }
      }
    },
    components: {EmapDatatable},
    methods: {
      busRunningStateChange() {
        console.log(arguments);
      },
      edit() {
        alert("edit bus info");
      },
      del() {
        alert("delete bus info");
      },
      addNewBus() {
        this.ps.line = {lineName: "线路名称1", stations: [{stationName: "站点1"}, {stationName: "站点2"}]};
        showBusInfoDialog("添加");
      }
    },
    computed: {
      ps(){
        return this.$store.state.index
      }
    }
  }
</script>
<style scoped>
  .icon-bus-signpost {
    font-size: 32px;
    margin-top: 10px;
    margin-left: -8px;
  }
  .line-detail {
    margin-left: 12px;
  }
  .line-row>* {
    display: inline-block;
    float: left;
  }
  .bus-add-btn {
    float: right;
  }
</style>
<style type="text/css">
  .bus-running-state .bh-switch-label {
    width: 100px;
  }
</style>
