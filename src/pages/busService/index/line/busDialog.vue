<template>
  <div class="bh-col-md-12 line-row">
    <i class="iconfont2 icon-bus-signpost"></i>
    <div class="line-detail">
      <span class="h3">{{line.lineName}}</span>
      <div class="bh-text-caption bh-caption-default">{{line.lineCombine}}</div>
    </div>
    <button @click="addNewBus" class="bh-btn bh-btn-primary bus-add-btn" type="button">
      <i class="iconfont icon-add"></i>添加班车
    </button>
  </div>
  <div class="bh-col-md-12 bh-mv-8 bh-mb-16">
    <emap-datatable v-ref:dt1 :options='options' @edit='edit' @del='del' @change="busRunningStateChange"></emap-datatable>
  </div>
</template>
<script type="text/ecmascript-6">
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
        line: {},
        options: {
          pagePath: service.api.busPlanMetaModel,
          url: service.api.busPlanDatas,
          lazyInit: true,
          params: {lineId: Number},
          action: "busPlanList",
          readyName: 'datatableReady',
          customColumns: [
            {
              type: 'tpl',
              colField: 'isRunning',
              column: {
                cellsRenderer: (row, column, value, rowData) => {
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
    ready() {
      this.line = this.ps.line;
      this.options.params.lineId = this.ps.line.lineId;
      this.$refs.dt1.init();
    },
    components: {EmapDatatable},
    methods: {
      busRunningStateChange() {
        let busId = args.row.busId;
        let $target = $(args.originalEvent.target);
        let checked = $target.prop("checked");
        this.$http.post(service.api.changeBusRunningStateUrl, {
          busId: busId,
          isRunning: checked
        }).then(response => {
          let body = response.body;
          if(body.code === 200) {
            if(checked) {
              $target.prev("label").addClass("bh-color-success").text("运行中");
            } else {
              $target.prev("label").removeClass("bh-color-success").text("停运");
            }
          } else {
            Utils.tip("danger", body.msg);
          }
        });
      },
      reloadTable() {
        this.$refs.dt1.reloadFirstPage();
      },
      edit() {
        this.ps.busId = args.row.busId;
        showBusInfoDialog("编辑");
      },
      del() {
        BH_UTILS.bhDialogWarning({title: "确定删除吗", content: " ", callback: () => {
            this.$http.post(service.api.deletedBusWithBusId, {busId: args.row.busId}).then(response => {
              if (response.body.code === 200) {
                this.reloadTable();
              } else {
                Utils.tips("danger", response.body.msg);
              }
            });
          }
        });
      },
      addNewBus() {
        this.ps.busId = null;
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
