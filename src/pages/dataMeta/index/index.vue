<template>
  <article bh-layout-role="single-no-title">
    <section class="bh-mh-8 bh-mv-8">
      <header>
        <h2>数据库表定义</h2>
      </header>
      <div class="bh-mv-8 bh-mb-16">
        <div class="bh-mv-8" v-for="item in tableGroups">
          <bh-panel :title='item.tableGroup' :caption='item.tableGroupDesc' :tag='item.tableTag'>
            <template v-for="table in item.tables">
              <div>{{table.tableName}} <span class="bh-text-caption bh-caption-default">{{table.tableDesc}}</span></div>
              <div class="bh-col-md-12 bh-mv-8 bh-mb-16">
                <bh-datatable :show-header='true' :options='options' :pageable='false' :localdata='table.tableMeta' :callbacks='callbacks'></bh-datatable>
              </div>
            </template>
          </bh-panel>
        </div>
      </div>
    </section>
  </article>
</template>

<script>
  import service from '../service'
  import BhDatatable from 'bh-vue/bh-datatable/bhDatatable'
  import BhPanel from 'bh-vue/bh-panel/bhPanel.vue'

  export default {
    data () {
      return {
        tableGroups: [],
        options: {
          columns: [
            {text: '字段名', dataField: 'fieldName', width: 100},
            {text: '字段类型', dataField: 'fieldType', width: 100},
            {text: '是否主键', dataField: 'isPrimary', width: 80},
            {text: '是否必填', dataField: 'isNotNull', width: 80},
            {text: '默认值', dataField: 'defaultVal', width: 80},
            {text: '说明', dataField: 'description'}
          ]
        }
      };
    },

    ready(){
        $.get(service.api.dbMetadata).done((res)=>{
          this.tableGroups = res.datas;
        });
    },
    methods: {},
    components: {BhDatatable, BhPanel}
  };
</script>
