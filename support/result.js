"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Result {
    constructor(success, data, message) {
        this.success = success;
        this.data = data;
        this.message = message;
    }
    static Ok(data) {
        return new Result(true, data);
    }
    static Fail(message) {
        return new Result(false, undefined, message);
    }
}
exports.Result = Result;
//# sourceMappingURL=result.js.map