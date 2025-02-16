const moment = require('moment');
const axios = require('axios');

const ga4Enable = process.env.GA4_ENABLE && Number(process.env.GA4_ENABLE) === 1 ? true : false;
const measurementId = process.env.GA4_MEASUREMENT_ID;
const apiSecret = process.env.GA4_API_SECRET;
const defaultClientId = '1.1000000000';

async function notifyGA4(client_id, eventName, data) {
    try {
        const jsonData = {
            client_id,
            events: [
                {
                    name: eventName,
                    params: JSON.parse(JSON.stringify(data))
                }
            ]
        }
        console.log('hit ga4:');
        console.log(JSON.stringify(jsonData, null, 2));
        const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`;
        console.log(url);
        await axios.post(url, jsonData);
        console.log('GA4 Log OK');
    } catch (err) {
        console.log('GA4 Log error');
        console.error(err);
    }
}

function logReqRes(req, res, next) {
    if (!ga4Enable) return next();
    const startTimeMS = moment().valueOf();
    const oldWrite = res.write;
    const oldEnd = res.end;

    const chunks = [];

    res.write = (...restArgs) => {
        chunks.push(Buffer.from(restArgs[0]));
        oldWrite.apply(res, restArgs);
    };

    res.end = (...restArgs) => {
        if (restArgs[0]) {
            chunks.push(Buffer.from(restArgs[0]));
        }
        const body = Buffer.concat(chunks).toString('utf8');

        let clientId = defaultClientId;
        if (req.cookies && req.cookies._ga) {
            clientId = req.cookies._ga.substring(6);
        }

        const eventName = ('' + req.method + '' + req.baseUrl).replaceAll('/', '_').toLowerCase();
        const toLog = {
            // time: moment().format(),
            // fromIP: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            clientIP: req.clientIP,
            // protocol: req.protocol,
            // method: req.method,
            originalUrl: req.originalUrl,
            // url: req.url,
            hostname: req.hostname,
            // baseUrl: req.baseUrl,
            statusCode: res.statusCode,
            // query: req.query,
            // params: req.params,
            // headers: req.headers,
            // body: req.body,
            // responseData: body,
            // referer: req.headers.referer || '',
            // ua: req.headers['user-agent']
        };

        if (toLog && toLog.headers) {
            const h = toLog.headers;
            if (h.authorization) h.authorization = 'xxx';
            if (h.Authorization) h.Authorization = 'xxx';
            toLog.headers = h;
        }

        const endTimeMS = moment().valueOf();
        const diffTimeMS = endTimeMS - startTimeMS;
        // toLog.startTimeMS = startTimeMS;
        // toLog.endTimeMS = endTimeMS;
        toLog.diffTimeMS = diffTimeMS;

        console.log(toLog);
        notifyGA4(clientId, eventName, toLog);
        oldEnd.apply(res, restArgs);
    };

    next();
}

module.exports = {
    logReqRes
};
