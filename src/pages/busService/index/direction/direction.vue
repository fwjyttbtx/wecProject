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
      <div class="bh-mb-10 direction-item" v-if="direction.isShow">
        <div v-if="!direction.isEdit" class="bh-border bh-center-block bh-ph-8">
          {{direction.directionName}}
          <i class="iconfont2 icon-bus-bin" @click="deleteDirection(direction)"></i>
          <i class="iconfont2 icon-bus-edit" @click="editMode(direction)"></i>
          <i class="iconfont2 icon-bus-drag"></i>
        </div>
        <div v-else class="bh-border bh-center-block bh-ph-8">
          <bh-input :value.sync='direction.directionName' placeholder='输入线路方向'></bh-input>
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

  let makeEleSortable = ()=> {
    Sortable.create(document.getElementById("directionNotes"), {
      animation: 150,
      draggable: ".direction-item",
      handle: ".icon-bus-drag"
    });
  };

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
      $.get(service.api.busMetaDirections).done((res)=>{
        _.each(res.datas, (direction) => {
          direction.isEdit = false;
          direction.isShow = true;
        });
        this.directions = res.datas;
      });
      makeEleSortable();
    },
    methods: {
      addNewDirection() {
        if(!this.isAdd) {
          this.isAdd = true;
        }
      },
      editMode(direction) {
        direction.isEdit = true;
      },
      cancelAdd() {
        this.isAdd = false;
      },
      addDirection() {
        this.directions.push({directionName: this.stationName, isEdit: false, isShow: true});
        this.directionName = '';
        //this.isAdd = false;
      },
      cancelEdit(direction) {
        direction.isEdit = false;
      },
      editDirection(direction) {
        direction.isEdit = false;
      },
      deleteStation(direction) {
        direction.isShow = false;
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
