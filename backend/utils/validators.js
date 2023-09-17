exports.isEmpty = value => value === undefined || value === null || typeof value === 'object' && Object.keys(value).length === 0 || typeof value === 'string' && value.trim().length === 0;

// TODO: Update this function to support nested objects
exports.trimReqBody = reqBody => {
    if (typeof reqBody === 'object' && !Array.isArray(reqBody)) {
        for (let key in reqBody) {
            if (typeof reqBody[key] === 'string') {
                reqBody[key] = reqBody[key].trim();
            }
        }
    }

    return reqBody;
};

exports.isValidUrl = function (url, protocols) {
    if (protocols) {
        protocols = Array.isArray(protocols) ? protocols : [protocols];
        protocols = protocols.map((protocol) => protocol.toLowerCase() + ':');
    }

    try {
        const urlObj = new URL(url);
        if (protocols?.length && !protocols.includes(urlObj.protocol)) {
            throw new Error(`Invalid URL protocol: ${urlObj.protocol}`);
        }

        return true;
    } catch (error) {
        return false;
    }
};

exports.isValidHttpUrl = (url) => this.isValidUrl.bind(null, url, ['https', 'http'])();

exports.capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
exports.namitize = (str) => str.toLowerCase().replace(/_/g, ' ').split(' ').map(this.capitalize).join(' ');