"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Result {
    constructor(success, message, data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
    static Data(data) {
        return new Result(true, undefined, data);
    }
    static Ok(message, data) {
        return new Result(true, message, data);
    }
    static Fail(message, data) {
        return new Result(false, message, data);
    }
}
exports.Result = Result;
//# sourceMappingURL=result.js.map