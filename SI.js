const _disableBrowsingHistory = () => {
	console.debug(chrome.i18n.getMessage("disabling_browsing_history"));

	const amazonEndpoint = "https://www.amazon.com/gp/mobile/ybh/handlers/click-stream.html";

	const postParams = new URLSearchParams();
	postParams.append("action", "disable");
	postParams.append("deviceType", "desktop");

	const params = {
		method: "POST",
		body: postParams,
		credentials: "include",
	};

	return fetch(amazonEndpoint, params).then(
		() => console.info(chrome.i18n.getMessage("disable_browsing_success")),
		() => console.error(chrome.i18n.getMessage("disable_browsing_error")),
	);
};

const _getSessionId = () => {
	return new Promise((resolve, reject) => {
		const params = {
			url: "http://www.amazon.com",
			name: "session-id"
		};

		chrome.cookies.get(params, cookie => {
			if (cookie) {
				resolve(cookie.value);
			} else {
				reject(new Error(chrome.i18n.getMessage("cookie_retrieval_error")));
			}
		});
	});
};

class ShopIncognito {
	constructor() {
		this._sessionId = null;
	}

	start() {
		console.debug(chrome.i18n.getMessage("checking_for_initial_session"));

		_getSessionId().then(
			sessionId => {
				console.debug(chrome.i18n.getMessage("existing_session_found"));
				return this._recordSessionId(sessionId);
			},
			() => {
				console.info(chrome.i18n.getMessage("no_session_found"));
			}
		).then(
			() => {
				chrome.cookies.onChanged.addListener(this._onCookieChange.bind(this));
				console.info(chrome.i18n.getMessage("cookie_monitoring_enabled"));
			}
		);
	}

	_onCookieChange(changeInfo) {
		if (!changeInfo.removed) {
			const cookie = changeInfo.cookie;
			const isAmazon = (
				cookie.domain === ".amazon.com" ||
				cookie.domain === "smile.amazon.com");
			if (isAmazon && cookie.name === "session-id") {
				this._recordSessionId(cookie.value);
			}
		}
	}

	_recordSessionId(sessionId) {
		if (sessionId !== this._sessionId) {
			if (this._sessionId) {
				console.debug(chrome.i18n.getMessage("new_session_found"));
			}

			this._sessionId = sessionId;
			return _disableBrowsingHistory();
		} else {
			return Promise.resolve();
		}
	}
};
