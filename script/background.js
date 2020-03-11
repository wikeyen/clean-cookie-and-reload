chrome.browserAction.onClicked.addListener(function (tab) {
    clearCurrentActiveTabCookie(tab.url);
    clearTabDomainCookie(tab.url);
    // reloadCurrentTab();
});

function clearCurrentActiveTabCookie(url) {
    chrome.cookies.getAll({url: url}, function (cookies) {
        console.log('Clearing cookies for active url', url, cookies);
        clearCookies(cookies);
    });
}

function retrieveActiveTabDomain(url) {
    let matches = url.match(/^http?:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    let domain = matches && matches[1].replace('www.', '');
    domain = '.' + domain;
    return domain;
}

function clearDomainCookies(domain) {
    chrome.cookies.getAll({domain: domain}, function (cookies) {
        console.log('Clearing cookies for domain', domain, cookies);
        clearCookies(cookies);
    });
}

function clearTabDomainCookie(url) {
    let domain = retrieveActiveTabDomain(url);
    clearDomainCookies(domain);
}

function reloadCurrentTab() {
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
        var code = 'window.location.reload();';
        chrome.tabs.executeScript(arrayOfTabs[0].id, {code: code});
    });
}

function deleteCookies(url, cname) {
    chrome.cookies.remove({
        url: url,
        name: cname
    });
}

function clearCookies(cookies) {
    for (let i = 0; i < cookies.length; i++) {
        let url = "http" + (cookies[i].secure ? "s" : "") + "://" + cookies[i].domain + cookies[i].path;
        let cname = cookies[i].name;

        deleteCookies(url, cname);
    }
}