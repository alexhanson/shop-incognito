var SI = {
	disableBrowsingHistoryNow: function() {
		console.debug(chrome.i18n.getMessage("checking_for_initial_session"));
	   chrome.cookies.get({
		   url: "http://www.amazon.com",
		   name: "session-id"
	   }, function(cookie) {
		   if (cookie) {
		   		this._sessionId = cookie.value;
				console.debug(chrome.i18n.getMessage("existing_session_found"));
				this._disableBrowsingHistory();
		   } else {
				console.info(chrome.i18n.getMessage("no_session_found"));
		   }
	   }.bind(this));
	},

	disableBrowsingHistoryWhenSessionIdChanges: function() {
		console.info(chrome.i18n.getMessage("cookie_monitoring_enabled"));
		chrome.cookies.onChanged.addListener(this._disableBrowsingHistoryWhenSessionIdChanges.bind(this));
	},


	// Internal

	_sessionId: null,
	_suspendAutoDisable: false,

	_disableBrowsingHistoryWhenSessionIdChanges: function(changeInfo) {
		if (this._suspendAutoDisable) {
			return;
		}

		if (!changeInfo.removed) {
			var cookie = changeInfo.cookie;
			if (cookie.domain === ".amazon.com" && cookie.name === "session-id") {
				var newSessionId = cookie.value;
				if (this._sessionId !== newSessionId) {
					this._sessionId = newSessionId;
					console.debug(chrome.i18n.getMessage("new_session_found"));
					this._disableBrowsingHistory();
				}
			}
		}
	},

	_disableBrowsingHistory: function() {
		this._suspendAutoDisable = true;

		console.debug(chrome.i18n.getMessage("disabling_browsing_history"));

		var formData = new FormData();
		formData.append("action", "disable");

		var request = new XMLHttpRequest();

		request.onload = function(e) {
			if (e.target.status === 200) {
				console.info(chrome.i18n.getMessage("disable_browsing_success"));
			} else {
				console.error(chrome.i18n.getMessage("disable_browsing_error"));
			}

			this._suspendAutoDisable = false;
		}.bind(this);

		request.onerror = function(e) {
			console.error(chrome.i18n.getMessage("disable_browsing_error"));
			this._suspendAutoDisable = false;
		}.bind(this);

		request.open("POST", "https://www.amazon.com/gp/mobile/ybh/handlers/click-stream.html");
		request.send(formData);
	}
};
