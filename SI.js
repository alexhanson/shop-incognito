var SI = {
	_sessionId: null,
	_suspendAutoDisable: false,

	disableBrowsingHistoryNow: function() {
		console.debug(chrome.i18n.getMessage("checking_for_initial_session"));
		chrome.cookies.get({
			url: "http://www.amazon.com",
			name: "session-id"
		}, function(cookie) {
			if (cookie) {
				console.debug(chrome.i18n.getMessage("session_found"));
				this._disableBrowsingHistoryWithSessionId(cookie.value);
			} else {
				console.info(chrome.i18n.getMessage("no_session_found"));
			}
		}.bind(this));
	},

	disableBrowsingHistoryLater: function() {
		console.info(chrome.i18n.getMessage("cookie_monitoring_enabled"));
		chrome.cookies.onChanged.addListener(this._disableBrowsingHistoryWhenSessionIdChanges.bind(this));
	},

	_disableBrowsingHistoryWhenSessionIdChanges: function(changeInfo) {
		if (this._suspendAutoDisable) {
			return;
		}

		if (!changeInfo.removed && changeInfo.cause === "explicit") {
			var cookie = changeInfo.cookie;
			if (cookie.domain === ".amazon.com" && cookie.name === "session-id") {
				console.debug(chrome.i18n.getMessage("session_found"));
				this._disableBrowsingHistoryWithSessionId(cookie.value);
			}
		}
	},

	_disableBrowsingHistoryWithSessionId: function(sessionId) {
		if (this._sessionId === sessionId) {
			console.debug(chrome.i18n.getMessage("skipping_disable"));
			return;
		}

		this._suspendAutoDisable = true;

		console.debug(chrome.i18n.getMessage("disabling_browsing_history"));

		var formData = new FormData();
		formData.append("setCS", "off");

		var request = new XMLHttpRequest();

		request.onload = function(e) {
			if (e.target.status === 200) {
				console.info(chrome.i18n.getMessage("disable_browsing_success"));
				this._sessionId = sessionId;
			} else {
				console.error(chrome.i18n.getMessage("disable_browsing_error"));
			}

			this._suspendAutoDisable = false;
		}.bind(this);

		request.onerror = function(e) {
			console.error(chrome.i18n.getMessage("disable_browsing_error"));
			this._suspendAutoDisable = false;
		}.bind(this);

		request.open("POST", "https://www.amazon.com/gp/history/cc?ie=UTF8&parentSession=" + sessionId);
		request.send(formData);
	}
};
