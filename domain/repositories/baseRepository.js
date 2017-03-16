"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sql = require("mssql");
const result_1 = require("../../support/result");
var ParameterType;
(function (ParameterType) {
    ParameterType[ParameterType["Int"] = 0] = "Int";
    ParameterType[ParameterType["NVarChar"] = 1] = "NVarChar";
    ParameterType[ParameterType["NVarCharMax"] = 2] = "NVarCharMax";
    ParameterType[ParameterType["Text"] = 3] = "Text";
    ParameterType[ParameterType["Decimal"] = 4] = "Decimal";
})(ParameterType = exports.ParameterType || (exports.ParameterType = {}));
class SQLParameter {
    static Int(name, value) {
        return new SQLParameter(name, ParameterType.Int, value);
    }
    static JSON(name, value) {
        return SQLParameter.NVarCharMax(name, JSON.stringify(value));
    }
    static NVarCharMax(name, value) {
        return new SQLParameter(name, ParameterType.NVarCharMax, value, undefined, undefined, undefined);
    }
    static NVarChar(name, value, length) {
        return new SQLParameter(name, ParameterType.NVarChar, value, length, undefined, undefined);
    }
    static Decimal(name, value, precision, scale) {
        return new SQLParameter(name, ParameterType.Decimal, value, undefined, precision, scale);
    }
    constructor(name, type, value, typeLength, typePrecision, typeScale) {
        this.name = name;
        this.type = type;
        this.value = value;
        this.typeLength = typeLength;
        this.typePrecision = typePrecision;
        this.typeScale = typeScale;
    }
}
exports.SQLParameter = SQLParameter;
class BaseRepository {
    constructor(dbAddress, dbName, dbUserName, dbPassword) {
        this.dbAddress = dbAddress;
        this.dbName = dbName;
        this.dbUserName = dbUserName;
        this.dbPassword = dbPassword;
    }
    static convertParameter(type, length, precision, scale) {
        switch (type) {
            case ParameterType.Int:
                return sql.Int;
            case ParameterType.Decimal:
                return sql.Decimal(precision, scale);
            case ParameterType.NVarChar:
                return sql.NVarChar(length);
            case ParameterType.NVarCharMax:
                return sql.NVarChar(sql.MAX);
            case ParameterType.Text:
                return sql.NText;
            default:
                break;
        }
    }
    executeSPNoResult(procedure, ...params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.executeSP(procedure, undefined, ...params);
        });
    }
    executeSP(procedure, recordSetToResult, ...params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var connection = new sql.Connection({
                    user: this.dbUserName,
                    password: this.dbPassword,
                    server: this.dbAddress,
                    database: this.dbName,
                    // needed to parse the procedure result, the typescript anotation, in this case, is wrong.
                    parseJSON: true,
                    options: {
                        // use this if you're on Windows Azure
                        encrypt: true,
                    }
                });
                yield connection.connect();
                let request = new sql.Request(connection);
                for (let p of params) {
                    request.input(p.name, BaseRepository.convertParameter(p.type, p.typeLength, p.typePrecision, p.typeScale), p.value);
                }
                var recordsets = yield request.execute(procedure);
                if (recordsets.length > 0 && recordSetToResult) {
                    return result_1.DataResult.Ok(recordSetToResult(recordsets[0]));
                }
                return result_1.DataResult.Ok();
            }
            catch (error) {
                return result_1.DataResult.Fail(error.message);
            }
        });
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=baseRepository.js.map