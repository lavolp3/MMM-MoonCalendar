/* Magic Mirror
 * Module: MMM-MoonCalendar
 */

/* jshint esversion: 6 */

Module.register("MMM-MoonCalendar", {

  defaults: {
    updateInterval: 1 * 60 * 1000,     //5 minutes
    aspect: "landscape",		//"landscape" or "vertical"
    weeks: 4,
    debug: true
  },

  loading: true,
  mooncal: {},

  start: function() {
    console.log("Starting module: " + this.name);
    //this.sendSocketNotification("CONFIG", this.config);
    self = this;
    moment.locale(config.language);
    this.loadFile(function(response) {
      self.mooncal = JSON.parse(response);
      self.log(self.mooncal[moment().format("DD.MM.YYYY")]);
    });
    self.updateDom();
    setInterval(() => {
      self.updateDom();
    }, this.config.updateInterval);
  },

  getStyles: function() {
      return ["MMM-MoonCalendar.css"];
  },


  getTemplate: function() {
    return "mmm-mooncal.njk";
  },


  getTemplateData: function() {
    this.log("Updating template data");
    return {
      config: this.config,
      loading: this.loading,
      dates: this.mooncal ? this.getDates() : "",
      weekDays: moment.weekdaysMin(true),
    };
  },

  socketNotificationReceived: function(notification, payload) {
  },


  getDates: function() {
    var dates = [];
    var day, date;
    for (var d = 0; d < (this.config.weeks * 7); d++) {
      day = moment().subtract(1, "weeks").startOf("week").add(d, "days");
      date = day.format("DD.MM.YYYY");
      this.log(this.mooncal[date]);
      dates.push({
        day: day.format("DD"),
        dayLabel: day.format("dd"),
        symbol1: this.getSymbol(this.mooncal[date]["1"]) || "",
        symbol2: this.getSymbol(this.mooncal[date]["2"]) || "",
        moon: this.getSymbol(this.mooncal[date].Mond)
      });
      //console.log(dates);
    }
    console.log(dates);
    return dates;
  },

  getSymbol: function(input) {
    switch (input) {
      case "f":
        return "fa fas fa-apple-alt";
      case "l":
        return "fa fas fa-apple-alt";
      case "w":
        return "fa fas fa-carrot";
      case "b":
        return "fa fas fa-leaf";
      case "ev":
        return "wi wi-moon-alt-first-quarter";
      case "vm":
        return "wi wi-moon-alt-full";
      case "lv":
        return "wi wi-moon-alt-third-quarter";
      case "nm":
        return "wi wi-moon-alt-waxing-crescent-1";
      default:
        return "";
    }
  },


  log: function(msg) {
      if (this.config && this.config.debug) {
          Log.info(`${this.name}: ` + JSON.stringify(msg));
      }
  },

  loadFile: function(callback) {
    var xobj = new XMLHttpRequest();
    var path = this.file('mooncal.json');
    xobj.overrideMimeType("application/json");
    xobj.open("GET", path, true);
    xobj.onreadystatechange = function() {
      if (xobj.readyState === XMLHttpRequest.DONE && xobj.status === 200) {
        callback(xobj.responseText);
      } /*else {
        console.log("Something went wrong while calling mooncal file: "+xobj.status);
      }*/
    };
    xobj.send(null);
  },
});
