import index from './index/index.vue'
import line from './index/line/line.vue'
import direction from './index/direction/direction.vue'
import station from './index/station/station.vue'
import recommend from './index/recommend/recommend.vue'

export default {
  '/': {
    component: index,
    subRoutes: {
      '/line': {
        component: line
      },
      '/direction': {
        component: direction
      },
      '/station': {
        component: station
      },
      '/recommend': {
        component:  recommend
      }
    }
  }
}
