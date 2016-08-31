var SI = {
	// Public methods

	start: function() {
		console.debug(chrome.i18n.getMessage("checking_for_initial_session"));

		getSessionId().then(
			function(sessionId) {
				console.debug(chrome.i18n.getMessage("existing_session_found"));
				return this._recordSessionId(sessionId);
			}.bind(this), 
			function() {
				console.info(chrome.i18n.getMessage("no_session_found"));
			}.bind(this)
		).then(
			function() {
				chrome.cookies.onChanged.addListener(this._onCookieChange.bind(this));
				console.info(chrome.i18n.getMessage("cookie_monitoring_enabled"));
			}.bind(this)
		);
	},


	// State

	_sessionId: null,


	// Private methods

	_onCookieChange: function(changeInfo) {
		if (!changeInfo.removed) {
			var cookie = changeInfo.cookie;
			if (cookie.domain === ".amazon.com" && cookie.name === "session-id") {
				this._recordSessionId(cookie.value);
			}
		}
	},

	_recordSessionId(sessionId) {
		if (sessionId !== this._sessionId) {
			if (this._sessionId) {
				console.debug(chrome.i18n.getMessage("new_session_found"));
			}

			this._sessionId = sessionId;
			return disableBrowsingHistory();
		} else {
			return Promise.resolve();
		}
	}
};


function postForm(url, formData) {
	return new Promise(function(resolve, reject) {
		var request = new XMLHttpRequest();

		request.onreadystatechange = function() {
			if (request.readyState === XMLHttpRequest.DONE) {
				if (request.status === 200) {
					resolve();
				} else {
					reject();
				}
			}
		};

		request.open("POST", url);
		request.send(formData);
	});
}

function disableBrowsingHistory() {
	console.debug(chrome.i18n.getMessage("disabling_browsing_history"));

	var amazonEndpoint = "https://www.amazon.com/gp/mobile/ybh/handlers/click-stream.html";

	var formData = new FormData();
	formData.append("action", "disable");

	return postForm(amazonEndpoint, formData).then(
		function() {
			console.info(chrome.i18n.getMessage("disable_browsing_success"));
		}.bind(this),
		function() {
			console.error(chrome.i18n.getMessage("disable_browsing_error"));
		}.bind(this)
	);
}

function getSessionId() {
	return new Promise(function(resolve, reject) {
		chrome.cookies.get({
			url: "http://www.amazon.com",
			name: "session-id"
		}, function(cookie) {
			if (cookie) {
				resolve(cookie.value);
			} else {
				reject(new Error("Could not retrieve current Amazon session ID."));
			}
		});
	});
}
