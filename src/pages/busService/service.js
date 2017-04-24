let baseTest = Vue.config.devtools ? "http://172.16.6.27/comapp/busService/api" : "";

export default {
  api: {
    busMetaDirections: baseTest + `/allBusDirections.do`,
    busMetaStations: baseTest + `/allBusStations.do`,
    busRecommendsGet: baseTest + `/allBusSearchRecommends.do`,
    busLines: baseTest + `/allSchoolBusLines.do`,
    busPlanMetaModel: `../statics/meta-info/busPlanMeta.json`,
    busPlanDatas: baseTest + `/linePlanedBusesTable.do`,
    updateBusDirectionSortUrl: baseTest + `/sortBusDirection.do`,
    saveOrUpdateBusDirection: baseTest + `/addNewOrUpdateBusDirection.do`,
    removeBusDirections: baseTest + `/deleteBusDirection.do`,
    addOrUpdateBusStation: baseTest + `/addNewOrUpdateBusStation.do`,
    removeBusStations: baseTest + `/deleteSchoolStationDic.do`,
    updateBusStationSortUrl: baseTest + `/sortBusStation.do`,
    updateBusRecommendSortUrl: baseTest + `/sortBusSearchRecommend.do`,
    saveOrUpdateBusRecommend: baseTest + `/addNewOrUpdateBusSearchRecommend.do`,
    removeSearchRecommend: baseTest + `/deleteSearchRecommend.do`,
    checkBusStationInParking: baseTest + `/checkStationIdInParking.do`,
    allCopiesLineStations: baseTest + `/allCopiesLineStations.do`,
    addOrUpdateBusLine: baseTest + `/addNewOrUpdateBusLine.do`,
    deleteBusLineUrl: baseTest + `/deleteBusLine.do`,
    addOrUpdateBusInfoUrl: baseTest + `/addOrUpdateBusInfo.do`,
    changeBusRunningStateUrl: baseTest + `/changeBusRunningState.do`,
    selectBusInfoWithIdUrl: baseTest + `/selectBusInfoWithId.do`,
    deletedBusWithBusId: baseTest + `/deletedBusWithBusId.do`
  }
};
