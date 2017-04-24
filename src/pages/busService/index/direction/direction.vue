<template>
  <h2>线路方向管理</h2>
  <div class="bh-col-md-12 bh-pl-0 bh-mt-32" id="directionNotes">
    <div class="bh-mb-10">
      <div class="bh-border bh-center-block bh-ph-8" id="addNewDirection">
        <span v-if="!isAdd" @click="addNewDirection">添加线路方向</span>
        <div v-else>
          <bh-input :value.sync='directionName' placeholder='输入线路方向'></bh-input>
          <i class="iconfont2 icon-bus-yes" @click="addDirection"></i>
          <i class="iconfont2 icon-bus-cancel" @click="cancelAdd"></i>
        </div>
      </div>
    </div>
    <template v-for="direction in directions">
      <div class="bh-mb-10 direction-item" v-if="direction.isShow" data-id="{{direction.directionId}}">
        <div v-if="!direction.isEdit" class="bh-border bh-center-block bh-ph-8 direction-scrap">
          <label class="direction-name">{{direction.directionName}}</label>
          <i class="iconfont2 icon-bus-bin" @click="deleteDirection(direction)"></i>
          <i class="iconfont2 icon-bus-edit" @click="editMode(direction)"></i>
          <i class="iconfont2 icon-bus-drag"></i>
        </div>
        <div v-else class="bh-border bh-center-block bh-ph-8">
          <bh-input :value.sync='direction.directionNewName' placeholder='输入线路方向'></bh-input>
          <i class="iconfont2 icon-bus-yes" @click="editDirection(direction)"></i>
          <i class="iconfont2 icon-bus-cancel" @click="cancelEdit(direction)"></i>
        </div>
      </div>
    </template>
  </div>
</template>
<script type="text/ecmascript-6">
  import service from '../../service'
  import BhInput from 'bh-vue/bh-input/bhInput.vue'

  let checkDirection = directionName => {
    if(!directionName || directionName.length === 0) {
      Utils.tip("warning", "线路方向名称不能为空。");
      return false;
    } else if(directionName.length > 20) {
      Utils.tip("warning", "线路方向名称长度应该小于或等于20。");
      return false;
    }
    return true;
  }

  export default {
    data() {
      return {
        directionName: '',
        editDirectionName: '',
        isAdd: false,
        directions: []
      }
    },
    ready(){
      $('body>main>article>*').css('display', 'table-cell');
      this.$http.post(service.api.busMetaDirections).then((response) => {
        let res = response.body;
        _.each(res.datas, (direction) => {
          direction.isEdit = false;
          direction.isShow = true;
        });
        this.directions = res.datas;
        Sortable.create(document.getElementById("directionNotes"), {
          animation: 150,
          draggable: ".direction-item",
          handle: ".icon-bus-drag",
          onUpdate: (evt) => {
            let itemArr = $(evt.from).find(".direction-item");
            let directionSorts = [];
            _.forEach(itemArr, (item, idx) => {
              directionSorts.push({directionId: $(item).data("id"), directionSort: idx});
            });
            this.$http.post(service.api.updateBusDirectionSortUrl, {sortedDirections: JSON.stringify(directionSorts)}).then((response) => {
              let body = response.body;
              if(body.code !== 200) {
                Utils.tip("danger", body.msg);
              }
            });
          }
        });
      });
    },
    methods: {
      addNewDirection() {
        if(!this.isAdd) {
          this.isAdd = true;
        }
      },
      editMode(direction) {
        direction.directionNewName = direction.directionName;
        direction.isEdit = true;
      },
      cancelAdd() {
        this.isAdd = false;
      },
      addDirection() {
        if(!checkDirection(this.directionName)) {
          return;
        }
        let param = {directionName: this.directionName};
        this.$http.post(service.api.saveOrUpdateBusDirection, param).then((response) => {
          let res = response.body;
          if(res.code === 200) {
            this.directions.push({directionId: res.dataId, directionName: this.directionName, isEdit: false, isShow: true});
            this.directionName = '';
            this.isAdd = false;
          } else {
            BH_UTILS.bhDialogDanger({title: "班车方向添加失败", content: res.msg, buttons: [{text: "确定", className: 'bh-btn-danger'}]});
          }
        });
      },
      cancelEdit(direction) {
        direction.isEdit = false;
      },
      editDirection(direction) {
        if(!checkDirection(direction.directionNewName)) {
          return;
        }
        this.$http.post(service.api.saveOrUpdateBusDirection, {
          directionId: direction.directionId,
          directionName: direction.directionNewName
        }).then((response) => {
          let res = response.body;
          if(res.code === 200) {
            direction.directionName = direction.directionNewName;
            direction.isEdit = false;
          } else {
            BH_UTILS.bhDialogDanger({title: "班车方向添加失败", content: res.msg, buttons: [{text: "确定", className: 'bh-btn-danger'}]});
          }
        });
      },
      deleteDirection(direction) {
        BH_UTILS.bhDialogWarning({title: "确定删除吗", content: " ", callback: () => {
          this.$http.post(service.api.removeBusDirections, {directionId: direction.directionId}).then((response) => {
            let body = response.body;
            if(body.code === 200) {
              direction.isShow = false;
            } else {
              BH_UTILS.bhDialogDanger({title: "班车方向删除失败", content: body.msg, buttons: [{text: "确定", className: 'bh-btn-danger'}]});
            }
          });
        }});
      }
    },
    components: {BhInput}
  }
</script>
<style type="text/css" scoped>
  #directionNotes>div {
    width: 25%;
    float: left;
    height: 32px;
    line-height: 32px;
    padding-right: 16px;
  }
  .direction-scrap {
    height: 100%;
  }
  .direction-name {
    display: inline-block;
    width: calc(100% - 80px);
    overflow: hidden;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  #directionNotes>div i.iconfont2 {
    display: none;
    float: right;
    margin-left: 8px;
    cursor: pointer;
  }
  #directionNotes>div i.iconfont2.icon-bus-drag {
    cursor: move;
  }
  #directionNotes>div:hover i.iconfont2 {
    color: #7f8acd;
    display: inline;
  }
  .bh-pl-0 {
    padding-left: 0 !important;
  }
  #addNewDirection>span:hover {
    color: #7f8acd;
    cursor: pointer;
  }
  #addNewDirection input, .direction-item input.jqx-input {
    width: calc(100% - 48px);
  }
</style>
