/*
 * @Author: wxq
 * @Date:   2017-05-22 13:37:27
 * @Last Modified by:   wxq
 * @Last Modified time: 2017-07-17 13:56:42
 * @Email: 304861063@qq.com
 * @File Path: F:\work\hyMap\src\components\layer\trackLayer.js
 * @File Name: trackLayer.js
 * @Descript: 
 */
'use strict';
import baseLayer from './baselayer';

import hyFeature from '../feature/hyFeature';

const ol = require('ol');

export default class trackLayer extends baseLayer {
    /**
     * 初始化
     * @param  {Object}   options 参数
     */
    constructor(options) {

        super(options);
        this.map = options.map;
        this.animating = false;
        this.carImg = 'data:image/png;base64,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';
        this.localImg = 'data:image/png;base64,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0p8zAAA7yGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMTQgNzkuMTUxNDgxLCAyMDEzLzAzLzEzLTEyOjA5OjE1ICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgICAgICAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgIDx4bXA6Q3JlYXRlRGF0ZT4yMDE2LTAxLTEyVDE3OjM0OjU0KzA4OjAwPC94bXA6Q3JlYXRlRGF0ZT4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAxNi0wMS0xMlQxODowMjoxNyswODowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMTYtMDEtMTJUMTg6MDI6MTcrMDg6MDA8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wTU06SW5zdGFuY2VJRD54bXAuaWlkOjY5OWY2ZDU4LTFlNDEtZTc0MS1iMDJiLTE4NTFiMjg0MmY0ZTwveG1wTU06SW5zdGFuY2VJRD4KICAgICAgICAgPHhtcE1NOkRvY3VtZW50SUQ+eG1wLmRpZDozOTExMjQwOC01N2E4LWY3NGQtOGVhOS1iYjhjMjQ4MTcyOWY8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDozOTExMjQwOC01N2E4LWY3NGQtOGVhOS1iYjhjMjQ4MTcyOWY8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOkhpc3Rvcnk+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jcmVhdGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6MzkxMTI0MDgtNTdhOC1mNzRkLThlYTktYmI4YzI0ODE3MjlmPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE2LTAxLTEyVDE3OjM0OjU0KzA4OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDplYTI2MjkyZC1kNDM4LTkzNGUtYmQ5ZC1lYmE2MTUzYzIwZjQ8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTYtMDEtMTJUMTc6MzQ6NTQrMDg6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjY5OWY2ZDU4LTFlNDEtZTc0MS1iMDJiLTE4NTFiMjg0MmY0ZTwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNi0wMS0xMlQxODowMjoxNyswODowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOlNlcT4KICAgICAgICAgPC94bXBNTTpIaXN0b3J5PgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8cGhvdG9zaG9wOklDQ1Byb2ZpbGU+c1JHQiBJRUM2MTk2Ni0yLjE8L3Bob3Rvc2hvcDpJQ0NQcm9maWxlPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4yOTwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj40NDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+vCXxIQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAADNklEQVR42tyYTUhUURSAv8m/tGJS1Jj+8YcghiTBJLeFNhYEbqJV0CLqUeBOCdxJtbJNDNhGXLSIDPrZRGqLsAYzMvMRVKL5hzWa9nIwHR2nhXfoqe+9e2caCzpwmblv7jnfe2fOPfec54pGo/xt2cQ/kFSVRV4/GcAx4DRQAewB3IABjAIvgYdAp66xILPncnKv108acAWoA/IV7m8SuAHc0jXCcUO9foqBu8DhBDzYC5zVNT4oQ71+yoAnQM4f/HXTwAldo0cK9fopBAJAXhJiZhKo0DUGbKFeP6lAN1CaxGB9A5TrGkt2W+ZSkoEIe5ctn9TrJx34DHg2YGtOAPtjEW1+Up8KMCUFSj1QVQwH85WhHqDaKjmclGkW5MDNSig0xXT3ONS1w9ScFFwNPFj7pGVOGlvSofnUaiBA+S5oqlrxgESOWAXSPicNXxF4ttpEigdK5K7eawXNdtIokqSJA7lSaLYVNOSk8SPsbHFmXgqds4IGnTTaB8DuaJgNQ2BEKTutg7510vg0DU2B9eDFCDR0giE90NCtoC9kWi29cP4RvBf3/HwYzrRBx5DSXn1mBb0Hv/OjnfSMwWNxYN3ph4/flIBLwv5qqK4xCrSpWBiZFZ+GckZqE/YtE34DII3DUQOWIjARUgLOA1dtCzNx7tXKrIwbK8CliBK0VtcYcqwGdY1moNXJykJkJecqSIuwp1SCXjBHm5V0DStF68V4CzM38NScqM2yPQu+258sr4BKXcNIpATNEzVtURwH9oCoiyYTqvCFos+cwhRSnc8JqNRWiIiuARYlSxeBmrWVX8K9jK7RBTRKljWKdUltoK6Zk7ZFMr+e9K5N1K31Nj/X65rU/WrRaxPRfcAh06V3ukbJRventyXzDYHeB5bF96iYbyxU1/gC9MemYp4cqMvlsh3Aa7GsT7Iu8fZfrMsCNgNpgwbBAjcMG0yJVwGLQFhUfPMqxmSe2AFsM1/8ORP8ijuf0ExwGMgUIyZhUVnOxb1lhHtyLbtx9+4UznUcpfV4AGMsYlMTDdralkDTgJ1ARhxxsiwSv5EoNCaZ5v8USBGujwIRMebFCMW2VNzQ/+6N2a8BAPqkG/wbH915AAAAAElFTkSuQmCC';
        this.width = 3;
        this.arrow = false;
        this.speed = 1;

        this.trackStyles = {
            'route': new ol.style.Style({
                stroke: new ol.style.Stroke({
                    width: this.width,
                    color: [237, 212, 0, 0.8]
                })
            }),
            'icon': new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    src: this.localImg
                })
            }),
            'geoMarker': new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 0.5],
                    src: this.carImg,
                    rotation: Math.PI / 180 * 90
                })
            })
        };

        this.trackLayer = new ol.layer.Vector({
            source: new ol.source.Vector({}),
            style: (feature) => {

                return this.styleFun(feature);

            }
        });
        this.map.addLayer(this.trackLayer);

    }
    styleFun(feature) {

        if (feature.get('type') == 'route') {

            var geometry = feature.getGeometry();
            var styles = [
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: this.width
                    })
                })
            ];
            if (this.arrow) {

                geometry.forEachSegment(function(start, end) {

                    var dx = end[0] - start[0];
                    var dy = end[1] - start[1];
                    var rotation = Math.atan2(dy, dx);
                    // arrows
                    styles.push(new ol.style.Style({
                        geometry: new ol.geom.Point(end),
                        image: new ol.style.Icon({
                            src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAATCAMAAACTKxybAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAHJQTFRF//////8A//8A/6pV/79A/8wz/9Ur/9Eu/8Q7/8wz/9It/8k2/9Eu/8o1/9Av/8o1/84x/8wz/8wz/8wz/8wz/8wz/8s0/8wz/8s0/8wz/8wz/8wz/8wz/8s0/8wz/8wz/8wz/8wz/8wz/8wz/8wz/8wzo2lg3QAAACV0Uk5TAAECAwQFBgsNDxETFhgbHUNGm6Ckqa2usrW+w8fLztLV1tnc9jtYQ+sAAABdSURBVAjXZc9HDsAwCARAp/fee+X/X8wesIQVbiMELEqVU6B0VS8tocZARGvE8Edoi1leD+0Jy+2gI2U5LXRmLLuB7pxl1dBT6N4Fzf+OnJHb5B2ZwMhmpDb+kZ9+tBQLxwwvvoMAAAAASUVORK5CYII=',
                            anchor: [0.75, 0.5],
                            rotateWithView: true,
                            rotation: -rotation
                        })
                    }));

                });

            }
            return styles;

        } else {

            return this.trackStyles[feature.get('type')];
        }

    }

    clearTrack() {

        var source = this.trackLayer.getSource();
        source.clear();

    }

    initTrackData({
        data = '',
        width = 3,
        arrow = false,
        speed = 1,
        wrap = true,
        trackModel = '1'
    } = {}) {

        if (data == '') {

            return;

        }
        this.width = width;
        this.arrow = arrow;
        this.speed = speed;
        this.wrap = wrap;
        this.trackModel = trackModel;
        this.clearTrack();
        var source = this.trackLayer.getSource();
        // var route = new ol.format.Polyline({
        // factor: 1e6
        // }).readGeometry(polyline, {
        // dataProjection: 'EPSG:4326',
        // featureProjection: this.map.getView().getProjection().getCode()
        // });
        this.route = hyFeature.createLine(data);
        this.routeCoords = this.route.getCoordinates();
        this.routeLength = this.routeCoords.length;
        var start = this.routeCoords[0];

        this.routeFeature = new ol.Feature({
            type: 'route',
            geometry: this.route
        });
        this.geoMarker = new ol.Feature({
            type: 'geoMarker',
            geometry: new ol.geom.Point(this.routeCoords[0])
        });
        this.startMarker = new ol.Feature({
            type: 'icon',
            geometry: new ol.geom.Point(this.routeCoords[0])
        });
        this.endMarker = new ol.Feature({
            type: 'icon',
            geometry: new ol.geom.Point(this.routeCoords[this.routeLength - 1])
        });
        source.addFeatures([this.routeFeature, this.startMarker, this.endMarker, this.geoMarker]);

        var end = this.routeCoords[1];
        var dx = end[0] - start[0];
        var dy = end[1] - start[1];
        var rotation = Math.atan2(dy, dx);
        this.angel = -rotation;
        this.trackStyles.geoMarker.getImage().setRotation(this.angel);
    }

    moveFeature(event) {

        var frameState = event.frameState;
        if (this.animating) {

            var elapsedTime = frameState.time - this.geoMarker.tmpDate;
            //增加延迟处理，当前事件达到speed*1000后执行下1个轨迹点移动

            if (this.geoMarker.now == 0 && elapsedTime < 10) {
                this.dispatchEvent({
                    evt: event,
                    type: 'trackPlayPoint',
                    feature: this.route,
                    data: {
                        index: 0,
                        coord: this.routeCoords[0]
                    }

                });
            }

            if (this.geoMarker.now >= this.routeLength - 1) {

                this.geoMarker.now = 0;
                if (!this.wrap) {

                    this.execute('stop');
                    return;

                }

            }

            var start = this.routeCoords[this.geoMarker.now];

            var end = this.routeCoords[this.geoMarker.now + 1];

            //获取前后两点之间的线，进行线性绘制点。保证播放的平滑。
            var frofun = ol.easing.linear(elapsedTime / 1000 * this.geoMarker.speed);

            var lineString = new ol.geom.LineString([start, end]);
            var poi = lineString.getCoordinateAt(frofun);
            var dx = end[0] - start[0];
            var dy = end[1] - start[1];
            var rotation = Math.atan2(dy, dx);
            this.trackStyles.geoMarker.getImage().setRotation(-rotation);
            //设置当前gps点位置
            var currentPoint = new ol.geom.Point(poi);
            this.geoMarker.setGeometry(currentPoint);

            this.dispatchEvent({
                evt: event,
                type: 'trackPlayIng',
                data: {
                    coord: this.routeCoords[this.geoMarker.now],
                    index: this.geoMarker.now,
                    currentCoord: poi
                },
                feature: this.route
            });

            if ((elapsedTime > 1000 / this.geoMarker.speed)) {

                this.geoMarker.tmpDate = new Date().getTime();
                this.geoMarker.now++;
                this.dispatchEvent({
                    evt: event,
                    type: 'trackPlayPoint',
                    data: {
                        index: this.geoMarker.now,
                        coord: this.routeCoords[this.geoMarker.now]
                    },
                    feature: this.route
                });
            }


        }
        this.map.render();

    }

    setSpeed(speed) {

        this.geoMarker.speed = Number(speed) || 1;

    }

    execute(flag = 'start') {

        if (this.trackLayer.getSource().getFeatures() == 0) {

            return;

        }
        if (flag == 'stop') {

            this.animating = false;
            this.geoMarker.now = 0;
            this.trackStyles.geoMarker.getImage().setRotation(this.angel);
            this.geoMarker.getGeometry().setCoordinates(this.routeCoords[0]);

            this.map.un('postcompose', this.moveFeature, this);

            this.dispatchEvent({
                evt: event,
                type: 'trackPlayEnd',
                // data: properties,
                feature: this.route
                    // select: e.target
            });

        } else if (flag == 'pause') {

            this.map.un('postcompose', this.moveFeature, this);


        } else if (flag == 'containue') {

            // this.animating = true;
            this.geoMarker.tmpDate = new Date().getTime();
            this.map.on('postcompose', this.moveFeature, this);
            this.map.render();

        } else {

            this.dispatchEvent({
                type: 'trackPlayStart',
                feature: this.route,
                data: {
                    coords: this.routeCoords,
                    length: this.routeLength
                }

            });

            if (this.animating) {

                return;

            } else {

                this.animating = true;
                this.geoMarker.now = 0;
                this.geoMarker.tmpDate = new Date().getTime();
                this.geoMarker.speed = this.speed;
                this.map.on('postcompose', this.moveFeature, this);
                this.map.render();

            }

        }

    }
    dispose() {

        this.map.removeLayer(this.trackLayer);
        this.map = null;

    }
}