'use strict';

Module.register("MMM-JsonTable", {

	jsonData: null,

	// Default module config.
	defaults: {
		text: "Hello World!",
		url: "",
		updateInterval: 15000
	},

	start: function () {
		this.getJson();
		this.scheduleUpdate();
	},

	scheduleUpdate: function () {
		var self = this;
		setInterval(function () {
			self.getJson();
		}, this.config.updateInterval);
	},

	// Request node_helper to get json from url
	getJson: function () {
		this.sendSocketNotification('GET_JSON', this.config.url);
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "JSON_RESULT") {
			this.jsonData = payload;
			this.updateDom(500);
		}
	},

	// Override dom generator.
	getDom: function () {
		var wrapper = document.createElement("div");
		wrapper.className = "small";

		if (!this.jsonData) {
			wrapper.innerHTML = "Awaiting json data...";
			return wrapper;
		}
		
		var table = document.createElement("table");
		var tbody = document.createElement("tbody");
		
		this.jsonData.currentUsages.forEach(element => {
			var row = this.getTableRow(element);
			tbody.appendChild(row);
		});

		table.appendChild(tbody);
		wrapper.appendChild(table);
		return wrapper;
	},

	getTableRow: function (jsonObject) {
		var row = document.createElement("tr");
		for (var key in jsonObject) {
			var cell = document.createElement("td");
			var cellText = document.createTextNode(jsonObject[key]);
			cell.appendChild(cellText)
			row.appendChild(cell);
		}
		return row;
	}

});