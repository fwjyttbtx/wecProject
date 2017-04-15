import service from '../service';

export const state = {
  stations:[],
  recommend: {},
  directions: [],
  direction: {},
  line: {},
  runningTypes: [
    {name: "周期性车次", value: "CYCLE"},
    {name: "指定运行时间", value: "SPECIFY"}
  ],
  lineTypes: [
    {name: "工作日路线", value: "WORKDAYS"},
    {name: "双休日路线", value: "WEEKENDS"},
    {name: "其他", value: "OTHERS"}
  ],
  oneWeekDays: [
    {name: "周一", value: "Mon", checked: true},
    {name: "周二", value: "Tue", checked: true},
    {name: "周三", value: "Wen", checked: true},
    {name: "周四", value: "Thr", checked: true},
    {name: "周五", value: "Fri", checked: true},
    {name: "周六", value: "Sat", checked: false},
    {name: "周日", value: "Sun", checked: false}
  ],
  allLineStations: [{
    name: "站点1->站点2->站点3->站点4->站点5",
    value: [
      {stationId: 1, stationName: "站点1", lastItem: false},
      {stationId: 2, stationName: "站点2", lastItem: false},
      {stationId: 3, stationName: "站点3", lastItem: false},
      {stationId: 4, stationName: "站点4", lastItem: false},
      {stationId: 5, stationName: "站点5", lastItem: true}
    ]
  }, {
    name: "站点2->站点3->站点4->站点5->站点6",
    value: [
      {stationId: 2, stationName: "站点2", lastItem: false},
      {stationId: 3, stationName: "站点3", lastItem: false},
      {stationId: 4, stationName: "站点4", lastItem: false},
      {stationId: 5, stationName: "站点5", lastItem: false},
      {stationId: 6, stationName: "站点6", lastItem: true}
    ]
  }]
};
