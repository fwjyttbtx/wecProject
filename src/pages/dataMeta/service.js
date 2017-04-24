export default {
  api: {
    dbMetadata: `dbTablesDesc.do`
  },

  getTableGroup() {
    return Utils.post(this.api.dbMetadata).then(function(res) {
      return res;
    });
  }

};
