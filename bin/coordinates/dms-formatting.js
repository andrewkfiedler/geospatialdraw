"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SECONDS_PRECISION = 1;
exports.SECONDS_PRECISION = SECONDS_PRECISION;
var dmsToString = function (dms, negativeHeading, positiveHeading, precision) {
    var _a = dmsSetSign(dms, 1), degree = _a.degree, minute = _a.minute, second = _a.second;
    var heading = dmsSign(dms) < 0 ? negativeHeading : positiveHeading;
    return degree.toFixed(0) + "\u00B0 " + minute.toFixed(0) + "' " + second.toFixed(precision) + "\" " + heading;
};
var dmsToLatString = function (dms, precision) {
    if (precision === void 0) { precision = SECONDS_PRECISION; }
    return dmsToString(dms, 'S', 'N', precision);
};
exports.dmsToLatString = dmsToLatString;
var dmsToLonString = function (dms, precision) {
    if (precision === void 0) { precision = SECONDS_PRECISION; }
    return dmsToString(dms, 'W', 'E', precision);
};
exports.dmsToLonString = dmsToLonString;
var dmsCoordinateToString = function (lat, lon) {
    return dmsToLatString(lat) + " " + dmsToLonString(lon);
};
exports.dmsCoordinateToString = dmsCoordinateToString;
var dmsToDecimal = function (_a) {
    var degree = _a.degree, minute = _a.minute, second = _a.second;
    return (Math.abs(degree) + Math.abs(minute) / 60.0 + Math.abs(second) / 3600.0) *
        dmsSign({ degree: degree, minute: minute, second: second });
};
exports.dmsToDecimal = dmsToDecimal;
var decimalToDMS = function (decimal) {
    var absoluteValue = Math.abs(decimal);
    var degree = Math.floor(absoluteValue);
    var minute = Math.floor((absoluteValue - degree) * 60);
    var second = (absoluteValue - degree - minute / 60) * 3600;
    var sign = decimal < 0 ? -1 : 1;
    return {
        degree: degree * sign,
        minute: minute,
        second: second,
    };
};
exports.decimalToDMS = decimalToDMS;
var dmsSign = function (_a) {
    var degree = _a.degree, minute = _a.minute, second = _a.second;
    return degree < 0 || minute < 0 || second < 0 ? -1 : 1;
};
exports.dmsSign = dmsSign;
var dmsSetSign = function (_a, sign) {
    var degree = _a.degree, minute = _a.minute, second = _a.second;
    return ({
        degree: Math.abs(degree) * sign,
        minute: Math.abs(minute) * sign,
        second: Math.abs(second) * sign,
    });
};
exports.dmsSetSign = dmsSetSign;
//# sourceMappingURL=dms-formatting.js.map