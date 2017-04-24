<template>
  <input type="text" v-model='value' :disabled='disabled'>
</template>

<script type="text/ecmascript-6">
  /**
   * 输入框
   * @module BhInput
   *
   * @example
   *     <caption>html</caption>
   *     <bh-input :value.sync='inputVal' placeholder='请输入问题'></bh-input>
   */
  export default {
    data () {
      return {
        jqxObj: null
      };
    },
    /**
     * @property {String} value 输入值
     * @property {String} [placeholder] 提示文字
     * @property {Array} [source] 自动完成的提示列表
     * @property {Boolean} [disabled=false] 是否禁用
     * @property {Boolean} [required=false] 是否必须
     * @property {Array} [rules] 校验规则
     */
    props: ['value', 'placeholder', 'source', 'disabled', 'required', 'rules'],
    ready () {
      var self = this;
      var el = $(self.$el);

      self.jqxObj = el.jqxInput({
        placeHolder: self.placeholder,
        source: self.source ? self.source : [],
        disabled: self.disabled
      });

      self.$watch('disabled', (newVal) => {
        if(newVal) {
          self.jqxObj.jqxInput({disabled: true});
        }else {
          self.jqxObj.jqxInput({disabled: false});
    }
    });
    },
    beforeDestroy () {
      var el = $(this.$el);
      el.jqxInput('destroy');
    }
  };
</script>

<style scoped>
  input {
    width: 100%;
  }
</style>
