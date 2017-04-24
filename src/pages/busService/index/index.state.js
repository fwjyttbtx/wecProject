import service from '../service';

export const state = {
  stations:[],
  recommend: {},
  recommends: [],
  directions: [],
  direction: {},
  line: {},
  runningTypes: [
    {name: "周期性车次", value: "CYCLE"},
    {name: "指定运行时间", value: "SPECIFY"}
  ],
  lineTypes: [
    {name: "工作日线路", value: "WORKDAYS"},
    {name: "双休日线路", value: "WEEKENDS"},
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
  allLineStations: [],
  busId: null
};
