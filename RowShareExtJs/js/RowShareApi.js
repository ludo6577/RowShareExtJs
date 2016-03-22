
/*
 *  INFORMATIONS ABOUT ROWSHARE API
 *  IMPORTED FROM: https://www.rowshare.com/Scripts/RowShareApi.js
 */

/// <reference path="Utilities.ts" />
var HttpResponse = (function () {
    function HttpResponse() {
    }
    return HttpResponse;
})();
var Category;
(function (Category) {
    Category[Category["Business"] = 1] = "Business";
    Category[Category["Events"] = 2] = "Events";
    Category[Category["Entertainment"] = 3] = "Entertainment";
    Category[Category["Sport"] = 4] = "Sport";
    Category[Category["Finance"] = 5] = "Finance";
    Category[Category["Productivity"] = 6] = "Productivity";
    Category[Category["Other"] = 7] = "Other";
})(Category || (Category = {}));
var AccessMode;
(function (AccessMode) {
    AccessMode[AccessMode["None"] = 0] = "None";
    AccessMode[AccessMode["Read"] = 1] = "Read";
    AccessMode[AccessMode["Write"] = 2] = "Write";
    AccessMode[AccessMode["WriteOwnedOnly"] = 4] = "WriteOwnedOnly";
    AccessMode[AccessMode["ReadOwnedOnly"] = 8] = "ReadOwnedOnly";
    AccessMode[AccessMode["ReadWriteOwnedOnly"] = 16] = "ReadWriteOwnedOnly";
})(AccessMode || (AccessMode = {}));
var ListAccessMode;
(function (ListAccessMode) {
    ListAccessMode[ListAccessMode["Unspecified"] = 0] = "Unspecified";
    ListAccessMode[ListAccessMode["PublicRead"] = 1] = "PublicRead";
    ListAccessMode[ListAccessMode["PublicWrite"] = 2] = "PublicWrite";
    ListAccessMode[ListAccessMode["PublicWriteOwnedOnly"] = 4] = "PublicWriteOwnedOnly";
    ListAccessMode[ListAccessMode["PublicNone"] = 8] = "PublicNone";
    ListAccessMode[ListAccessMode["PublicReadOwnedOnly"] = 16] = "PublicReadOwnedOnly";
    ListAccessMode[ListAccessMode["PublicReadWriteOwnedOnly"] = 32] = "PublicReadWriteOwnedOnly";
})(ListAccessMode || (ListAccessMode = {}));
var ColumnOptions;
(function (ColumnOptions) {
    ColumnOptions[ColumnOptions["None"] = 0] = "None";
    ColumnOptions[ColumnOptions["IsMandatory"] = 1] = "IsMandatory";
    ColumnOptions[ColumnOptions["IsComputed"] = 2] = "IsComputed";
    ColumnOptions[ColumnOptions["IsHyperlink"] = 4] = "IsHyperlink";
    ColumnOptions[ColumnOptions["IsCurrency"] = 8] = "IsCurrency";
    ColumnOptions[ColumnOptions["IsRichText"] = 16] = "IsRichText";
    ColumnOptions[ColumnOptions["IsLookupMultiValued"] = 32] = "IsLookupMultiValued";
    ColumnOptions[ColumnOptions["IsUnique"] = 64] = "IsUnique";
    ColumnOptions[ColumnOptions["IsEmail"] = 128] = "IsEmail";
    ColumnOptions[ColumnOptions["IsFrequent"] = 256] = "IsFrequent";
})(ColumnOptions || (ColumnOptions = {}));
var ColumnDataType;
(function (ColumnDataType) {
    ColumnDataType[ColumnDataType["String"] = 0] = "String";
    ColumnDataType[ColumnDataType["Number"] = 1] = "Number";
    ColumnDataType[ColumnDataType["Boolean"] = 2] = "Boolean";
    ColumnDataType[ColumnDataType["DateTime"] = 3] = "DateTime";
    ColumnDataType[ColumnDataType["UniqueIdentifier"] = 4] = "UniqueIdentifier";
    ColumnDataType[ColumnDataType["Blob"] = 5] = "Blob";
    ColumnDataType[ColumnDataType["RowShareEmail"] = 6] = "RowShareEmail";
    ColumnDataType[ColumnDataType["RowShareNickName"] = 7] = "RowShareNickName";
    ColumnDataType[ColumnDataType["LastWriteDate"] = 8] = "LastWriteDate";
    ColumnDataType[ColumnDataType["CreationDate"] = 9] = "CreationDate";
    ColumnDataType[ColumnDataType["Date"] = 10] = "Date";
    ColumnDataType[ColumnDataType["Time"] = 11] = "Time";
    ColumnDataType[ColumnDataType["AutoNumber"] = 12] = "AutoNumber";
})(ColumnDataType || (ColumnDataType = {}));
var RowShareException = (function () {
    function RowShareException(code, message) {
        this.code = code;
        this._message = message;
    }
    Object.defineProperty(RowShareException.prototype, "message", {
        get: function () {
            if (this._message) {
                return this._message;
            }
            return SR.getMessage(String(this.code));
        },
        enumerable: true,
        configurable: true
    });
    RowShareException.getExceptionMessage = function (data) {
        if (data instanceof XMLHttpRequest) {
            var xhr = data;
            try {
                var exception = JSON.parse(xhr.responseText);
                return exception.Message;
            }
            catch (ex) {
                return xhr.responseText;
            }
        }
        if (data instanceof HttpResponse) {
            return this.getExceptionMessage(data.data);
        }
        if (data instanceof RowShareException) {
            return data.message;
        }
        if (typeof data === "object" && "Message" in data) {
            return data["Message"];
        }
        if (Utilities.isString(data)) {
            return data;
        }
        return SR.getMessage("UnknownError") || "An unknown error occurs. Please try later";
    };
    RowShareException.getExceptionMessageWithoutCode = function (data) {
        var message = RowShareException.getExceptionMessage(data);
        var match = (/(RS|CF)([0-9]+):\s*(.+)/).exec(message);
        if (match) {
            return match[3];
        }
        return message;
    };
    RowShareException.getExceptionCode = function (data) {
        var message = RowShareException.getExceptionMessage(data);
        var match = (/(RS|CF)([0-9]+):/).exec(message);
        if (match) {
            return parseInt(match[2], 10);
        }
        return 0;
    };
    RowShareException.isConcurrencyException = function (data) {
        return RowShareException.getExceptionCode(data) === 18 /* Concurrency */;
    };
    return RowShareException;
})();
var Api;
(function (Api) {
    var options = {
        rootUrl: "/api"
    };
    function setOptions(opt) {
        $.extend(options, opt);
    }
    Api.setOptions = setOptions;
    function fromJson(text) {
        return JSON.parse(text);
    }
    function toJson(obj) {
        // Remove keys starting by "$" as it must be properties used only the UI
        return JSON.stringify(obj, function (key, value) {
            if (key && key.indexOf("$$") == 0) {
                return undefined;
            }
            return value;
        });
    }
    function getResponseObject(xhr) {
        var response = new HttpResponse();
        response.status = xhr.status;
        response.statusText = xhr.statusText;
        try {
            response.data = fromJson(xhr.responseText);
        }
        catch (ex) {
            response.data = xhr.responseText;
        }
        return response;
    }
    function isSuccess(xhr) {
        return xhr.status >= 200 && xhr.status < 300;
    }
    function buildUri(uri) {
        if (uri.length < 4 || !Utilities.equalsIgnoreCase(uri.substring(0, 4), "http")) {
            uri = options.rootUrl + uri;
        }
        // Set lcid parameter
        var culture = Utilities.getCurrentCulture();
        if (culture) {
            uri = Utilities.setQueryStringParameter(uri, "l", culture);
        }
        return uri;
    }
    Api.buildUri = buildUri;
    function setXmlHttpRequestConfiguration(xhr) {
        try {
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        }
        catch (e) {
        }
        try {
            if (typeof xhr.withCredentials === 'boolean') {
                xhr.withCredentials = true;
            }
        }
        catch (e) {
        }
    }
    Api.setXmlHttpRequestConfiguration = setXmlHttpRequestConfiguration;
    function apiGetJson(uri) {
        uri = buildUri(uri);
        Logger.time("GET " + uri);
        return new Promise(function (resolve, reject) {
            var xhr = Utilities.getXmlHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    Logger.timeEnd("GET " + uri);
                    var response = getResponseObject(xhr);
                    if (isSuccess(xhr)) {
                        resolve(response);
                    }
                    else {
                        reject(response);
                    }
                }
            };
            xhr.open("GET", uri, true);
            setXmlHttpRequestConfiguration(xhr);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(null);
        });
    }
    Api.apiGetJson = apiGetJson;
    function apiPostJson(uri, data) {
        uri = buildUri(uri);
        Logger.time("POST " + uri);
        return new Promise(function (resolve, reject) {
            var xhr = Utilities.getXmlHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    Logger.timeEnd("POST " + uri);
                    var response = getResponseObject(xhr);
                    if (isSuccess(xhr)) {
                        resolve(response);
                    }
                    else {
                        reject(response);
                    }
                }
            };
            xhr.open("POST", uri, true);
            setXmlHttpRequestConfiguration(xhr);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            var json = toJson(data);
            xhr.send(json);
        });
    }
    Api.apiPostJson = apiPostJson;
    function apiPostFile(uri, file, onSuccess, onFailed) {
        Logger.time("POST " + uri);
        uri = buildUri(uri);
        return new Promise(function (resolve, reject) {
            var xhr = Utilities.getXmlHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    Logger.timeEnd("POST " + uri);
                    var response = getResponseObject(xhr);
                    if (isSuccess(xhr)) {
                        resolve(response);
                    }
                    else {
                        reject(response);
                    }
                }
            };
            xhr.open("POST", uri, true);
            setXmlHttpRequestConfiguration(xhr);
            var formData = new FormData();
            if (Array.isArray(file) || Object.prototype.toString.call(file) === "[object FileList]") {
                for (var _i = 0; _i < file.length; _i++) {
                    var f = file[_i];
                    formData.append("file", f);
                }
            }
            else {
                if ("name" in file) {
                    formData.append("file", file);
                }
                else {
                    formData.append("file", file, "unnamed");
                }
            }
            xhr.send(formData);
        });
    }
    Api.apiPostFile = apiPostFile;
    var UserListLink;
    (function (UserListLink) {
        function addToFavorite(listId) {
            var url = "/userlistlink/save/";
            return apiPostJson(url, { ListId: listId, Types: 1 /* Favorite */ | 4 /* EmailNotifications */ }).then(function (response) { return response.data; });
        }
        UserListLink.addToFavorite = addToFavorite;
        function removeFromFavorite(listId, onSuccess, onFailed) {
            var url = "/userlistlink/delete/";
            return apiPostJson(url, { ListId: listId, Types: 1 /* Favorite */ }).then(function (response) { return response.data; });
        }
        UserListLink.removeFromFavorite = removeFromFavorite;
    })(UserListLink = Api.UserListLink || (Api.UserListLink = {}));
    var List;
    (function (List) {
        function load(id) {
            // http://www.rowsharedev.com/SoftFluent.RowShare.Web/api/list/Load/4724a8237e6e44c497ca51ab954b712a
            var url = "/list/load/" + id;
            return apiGetJson(url).then(function (response) { return response.data; });
        }
        List.load = load;
        function save(list) {
            var url = "/list/save/";
            return apiPostJson(url, list).then(function (response) { return response.data; });
        }
        List.save = save;
        var cache;
        function loadAll() {
            var url = "/list/loadall";
            if (cache) {
                return Promise.resolve(cache);
            }
            return apiGetJson(url).then(function (response) {
                cache = response.data;
                return cache;
            });
        }
        List.loadAll = loadAll;
        function search(options) {
            var url = "/list/search/";
            return apiPostJson(url, options).then(function (response) { return response.data; });
        }
        List.search = search;
        function exportListJson(listId) {
            var url = "/list/export/" + encodeURIComponent(listId) + "?f=json";
            return apiGetJson(url).then(function (response) { return response.data; });
        }
        List.exportListJson = exportListJson;
        function choice(listId, columnName) {
            var url = "/list/choice/" + encodeURIComponent(listId) + "/" + encodeURIComponent(columnName);
            return apiGetJson(url).then(function (response) { return response.data; });
        }
        List.choice = choice;
    })(List = Api.List || (Api.List = {}));
    var Column;
    (function (Column) {
        function loadForParent(listId) {
            var url = "/column/loadForParent/" + listId;
            return apiGetJson(url).then(function (response) { return response.data; });
        }
        Column.loadForParent = loadForParent;
        function remove(column) {
            var url = "/column/delete/";
            return apiPostJson(url, column).then(function (response) { return response.data; });
        }
        Column.remove = remove;
        function save(column) {
            var url = "/column/save/";
            return apiPostJson(url, column).then(function (response) { return response.data; });
        }
        Column.save = save;
    })(Column = Api.Column || (Api.Column = {}));
    var Row;
    (function (Row) {
        function hasBlobColumn(columns) {
            for (var _i = 0; _i < columns.length; _i++) {
                var column = columns[_i];
                if (ListUtilities.isBlobColumn(column)) {
                    return true;
                }
            }
            return false;
        }
        function hasNonBlobColumn(columns) {
            for (var _i = 0; _i < columns.length; _i++) {
                var column = columns[_i];
                if (!ListUtilities.isBlobColumn(column)) {
                    return true;
                }
            }
            return false;
        }
        function hasNewIndex(row) {
            return Utilities.isNumber(row.$$NewIndex) && row.$$NewIndex >= 0;
        }
        function extractBlobValues(row, columns) {
            var blobs = [];
            for (var _i = 0; _i < columns.length; _i++) {
                var column = columns[_i];
                if (column.DataType === ColumnDataType.Blob) {
                    var value = ListUtilities.getCellValue(row, column);
                    blobs.push({ column: column, value: ListUtilities.getCellValue(row, column) });
                }
            }
            return blobs;
        }
        function loadForParent(listId) {
            var url = "/row/loadForParent/" + encodeURIComponent(listId);
            return apiGetJson(url).then(function (response) { return response.data; });
        }
        Row.loadForParent = loadForParent;
        function load(id) {
            var url = "/row/load/" + encodeURIComponent(id);
            return apiGetJson(url).then(function (response) { return response.data; });
        }
        Row.load = load;
        function saveInternal(row) {
            var url = "/row/save/";
            return apiPostJson(url, row).then(function (response) { return response.data; });
        }
        function deleteBlob(row, column) {
            var url = "/row/delete/" + encodeURIComponent(row.Id) + "/" + column.Index;
            return apiPostJson(url, null).then(function (response) { return response.data; });
        }
        function saveBlob(value, row, column) {
            if (Utilities.isFile(value) || value instanceof Blob) {
                var file = value;
                var url = "/row/save/" + row.Id + "/" + column.Index;
                return apiPostFile(url, file).then(function (response) { return response.data; });
            }
            else {
                // TODO move to apiPostFile
                return new Promise(function (resolve, reject) {
                    var id = 'f' + Utilities.newGuid();
                    var form = value;
                    var action = Api.buildUri('/row/save/' + row.Id + '/' + column.Index);
                    var iframe = $('<iframe name="' + id + '" id="' + id + ' " style="display: none" />');
                    $("body").append(iframe);
                    form.attr("action", action);
                    form.attr("method", "post");
                    form.attr("encoding", "multipart/form-data");
                    form.attr("enctype", "multipart/form-data");
                    form.attr("target", id);
                    form.submit();
                    iframe.load(function () {
                        var iframeContents = this.contentWindow.document.body.textContent;
                        resolve(fromJson(iframeContents));
                    });
                });
            }
        }
        function saveBlobs(row, blobs) {
            if (Utilities.isNullOrUndefined(row)) {
                // API returns nothing with status 200
                throw new RowShareException(10000 /* Unknown */);
            }
            // save blobs
            if (blobs.length > 0) {
                var promises = [];
                var newRow = row;
                for (var _i = 0; _i < blobs.length; _i++) {
                    var blobAndColumn = blobs[_i];
                    var blob = blobAndColumn.value;
                    var column = blobAndColumn.column;
                    if (Utilities.isNullOrUndefined(blob)) {
                        continue;
                    }
                    if (blob instanceof CellData) {
                        promises.push(saveBlob(blob.editRenderer.getNewValue(), row, column).then(function (data) { return newRow = data; }));
                    }
                    else if (blob instanceof EditRendererClass) {
                        promises.push(saveBlob(blob.getNewValue(), row, column).then(function (data) { return newRow = data; }));
                    }
                    else if (Utilities.isFile(blob)) {
                        promises.push(saveBlob(blob, row, column).then(function (data) { return newRow = data; }));
                    }
                    else if (blob.ImageUrl) {
                        if (blob.ImageUrl.startsWith("data:")) {
                            promises.push(saveBlob(Utilities.dataURItoBlob(blob.ImageUrl), row, column).then(function (data) { return newRow = data; }));
                        }
                    }
                    else {
                        Logger.error("Wrong blob value");
                    }
                }
                return Promise.all(promises).then(function (data) { return newRow; });
            }
            return Promise.resolve(row);
        }
        function saveRowWithoutBlobs(row, columns) {
            var mustSaveRow = row.$$ForceSave === true || hasNonBlobColumn(columns) || hasNewIndex(row);
            if (!mustSaveRow) {
                return Promise.resolve(row);
            }
            var dup = Utilities.clone(row);
            normalizeRow(dup, columns);
            // remove Index property as we do not want to change the Index
            delete dup.Index;
            if (hasNewIndex(dup)) {
                dup.Index = dup.$$NewIndex;
            }
            // Preserve only used columns
            // Remove Blob column
            // Change datetime to handle timezone correctly
            if (dup && dup.Values) {
                var values = dup.Values;
                dup.Values = {};
                for (var _i = 0; _i < columns.length; _i++) {
                    var column = columns[_i];
                    var value = ListUtilities.getCellValue(row, column);
                    dup.Values[column.DisplayName] = values[column.DisplayName];
                    if (ListUtilities.isBlobColumn(column)) {
                        delete dup.Values[column.DisplayName];
                    }
                    else if (ListUtilities.isDateColumn(column)) {
                        var dateValue = Utilities.parseDateTime(value, true);
                        if (dateValue instanceof Date) {
                            // Save date without timezone info => 2015-01-01T00:00:00.000
                            dateValue = new Date(dateValue.getTime() - (dateValue.getTimezoneOffset() * 60 * 1000));
                            var dateValueString = dateValue.toISOString();
                            //dateValueString = dateValueString.substring(0, dateValueString.length - 1)
                            ListUtilities.setCellValue(dup, column, dateValueString);
                        }
                    }
                }
            }
            return saveInternal(dup);
        }
        function remove(row) {
            var url = "/row/delete/";
            return apiPostJson(url, row).then(function (response) { return response.data; });
        }
        Row.remove = remove;
        function save(row, columns) {
            var blobs = extractBlobValues(row, columns);
            return saveRowWithoutBlobs(row, columns).then(function (row) { return saveBlobs(row, blobs); });
        }
        Row.save = save;
        function deleteCellValue(row, columnToDelete, columns) {
            var dup = JSON.parse(JSON.stringify(row));
            if (ListUtilities.isBlobColumn(columnToDelete)) {
                return deleteBlob(row, columnToDelete);
            }
            else {
                // Remove Blob column
                if (dup && dup.Values) {
                    for (var index = 0; index < columns.length; index++) {
                        var column = columns[index];
                        delete dup.Values[column.DisplayName];
                    }
                }
                return saveInternal(dup);
            }
        }
        Row.deleteCellValue = deleteCellValue;
        function clone(row) {
            var url = "/row/clone/";
            return apiPostJson(url, row).then(function (response) { return response.data; });
        }
        Row.clone = clone;
        function normalizeRow(row, columns) {
            for (var _i = 0; _i < columns.length; _i++) {
                var column = columns[_i];
                var value = ListUtilities.getCellValue(row, column);
                if (Utilities.isUndefined(value)) {
                    continue;
                }
                if (ListUtilities.isDateColumn(column)) {
                    value = Utilities.parseDateTime(value, true);
                }
                ListUtilities.setCellValue(row, column, value);
            }
        }
    })(Row = Api.Row || (Api.Row = {}));
    var Job;
    (function (Job) {
        function load(id) {
            var url = "/job/load/" + id;
            return apiGetJson(url).then(function (response) { return response.data; });
        }
        Job.load = load;
    })(Job = Api.Job || (Api.Job = {}));
    var Report;
    (function (Report) {
        function loadForParent(listId) {
            return apiGetJson('/report/loadforparent/' + encodeURIComponent(listId)).then(function (response) { return response.data; });
        }
        Report.loadForParent = loadForParent;
        function save(report) {
            return apiPostJson('/report/save/' + report.Id, report).then(function (response) { return response.data; });
        }
        Report.save = save;
        function saveBlob(report, file) {
            return apiPostFile("/report/save/" + report.Id + "/file", file).then(function (response) { return response.data; });
        }
        Report.saveBlob = saveBlob;
        function remove(report) {
            return apiPostJson('/report/delete/', report).then(function (response) { return response.data; });
        }
        Report.remove = remove;
        function exportReport(report, format) {
            var uri = '/report/export/' + encodeURIComponent(report.Id) + '/';
            if (typeof format === 'string') {
                uri += format;
            }
            return apiPostJson(uri, null).then(function (response) { return response.data; });
        }
        Report.exportReport = exportReport;
    })(Report = Api.Report || (Api.Report = {}));
    var Group;
    (function (Group) {
        function load() {
            return apiGetJson('/group/').then(function (response) { return response.data; });
        }
        Group.load = load;
        function loadForParent(organizationId) {
            return apiGetJson('/group/loadforparent/' + encodeURIComponent(organizationId)).then(function (response) { return response.data; });
        }
        Group.loadForParent = loadForParent;
        function save(group) {
            return apiPostJson('/group/save', group).then(function (response) { return response.data; });
        }
        Group.save = save;
        function remove(group) {
            return apiPostJson('/group/delete', group).then(function (response) { return response.data; });
        }
        Group.remove = remove;
    })(Group = Api.Group || (Api.Group = {}));
    var Member;
    (function (Member) {
        function loadForParent(groupId, memberOptions) {
            var uri = '/member/loadforparent/' + encodeURIComponent(groupId);
            if (memberOptions) {
                uri += '/' + memberOptions;
            }
            return apiGetJson(uri).then(function (response) { return response.data; });
        }
        Member.loadForParent = loadForParent;
        function save(member) {
            return apiPostJson('/member/save/', member).then(function (response) { return response.data; });
        }
        Member.save = save;
        function remove(member) {
            return apiPostJson('/member/delete/', member).then(function (response) { return response.data; });
        }
        Member.remove = remove;
    })(Member = Api.Member || (Api.Member = {}));
})(Api || (Api = {}));