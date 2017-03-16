"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DataResult {
    constructor(success, data, message) {
        this.success = success;
        this.data = data;
    }
    static Ok(data) {
        return new DataResult(true, data);
    }
    static Fail(message) {
        return new DataResult(false, undefined, message);
    }
}
exports.DataResult = DataResult;
//# sourceMappingURL=result.js.map