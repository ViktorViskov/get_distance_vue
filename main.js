let app = new Vue({
  el: '#root',
  data: {
    city_start: "",
    city_stop: "",
    distance: "",
  },
  methods: {
    search: async function () {
      this.distance = "Loading..."
      // load coordinates
      let start = await this.LoadCoordinates(this.city_start)
      let stop = await this.LoadCoordinates(this.city_stop)

      // check for coordinates
      if (start.length > 0 && stop.length > 0) {
        // load route
        let route = await this.LoadTripInfo(start, stop)
        this.distance = `distance > ${(route['routes'][0]['distance'] / 1000).toFixed(1)} km | duration > ${(route['routes'][0]['duration'] / 60).toFixed(0)} min`
      }
    },
    LoadCoordinates: function (city_name) {

      return new Promise( function (resolve) {
        let xhr = new XMLHttpRequest()
        xhr.open("GET", `https://nominatim.openstreetmap.org/search?q=${city_name.replaceAll(" ", "+")}&format=json`)
        xhr.send()
        xhr.onload = () => {
          resolve([JSON.parse(xhr.response)[0]['lon'], JSON.parse(xhr.response)[0]['lat']])
        }
      });
    },
    LoadTripInfo: function (start, stop) {
      return new Promise(function (resolve) {
        let xhr = new XMLHttpRequest()
        xhr.open("GET", `https://routing.openstreetmap.de/routed-car/route/v1/driving/${start[0]},${start[1]};${stop[0]},${stop[1]}?overview=false`)
        xhr.send()
        xhr.onload = () => {
          resolve(JSON.parse(xhr.response))
        }
      });
    }
  }
})
