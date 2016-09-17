Shop Incognito
==============
A Chrome extension that turns off Amazon browsing history &mdash; and keeps it off.

Amazon lets you disable your browsing history, but they store the setting in a cookie, even if you're signed in. So whenever your Amazon session expires (e.g., you clear your cookies), your preference is lost. This extension watches for new Amazon sessions and disables browsing history on your behalf.

# Using this extension in developer mode
1. Clone this repository.
2. Navigate to your list of installed Chrome extensions, and make sure that "Developer mode" is enabled.
3. Click "Load unpacked extension&hellip;" and select the cloned directory.
4. Optional: Check "Allow in incognito" for this extension.

# Publishing this extension to the Chrome Web Store
I haven't uploaded this extension publicly to the Chrome Web Store, but I _have_ uploaded it as an "unlisted" extension for my own use. This lets me avoid the warning about developer-mode extensions when Chrome starts up. If you want to do the same...

1. Clone this repository.
2. Run `publish.sh` to generate `shop-incognito.zip`.
3. Upload `shop-incognito.zip` to the [Chrome Web Store](https://chrome.google.com/webstore/developer/dashboard) and publish the extension at whatever visibility you'd like.
4. After the extension has published, install it from the Chrome Web Store.
