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
const result_1 = require("../../domain/result");
const parameterType_1 = require("../parameterType");
class BaseRepository {
    constructor(dbAddress, dbName, dbUserName, dbPassword) {
        this.dbAddress = dbAddress;
        this.dbName = dbName;
        this.dbUserName = dbUserName;
        this.dbPassword = dbPassword;
    }
    executeSPNoResult(procedure, ...params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.executeSP(procedure, undefined, ...params);
        });
    }
    executeSP(procedure, recordSetToResult, ...params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = new sql.Connection({
                    database: this.dbName,
                    options: {
                        // use this if you're on Windows Azure
                        encrypt: true,
                    },
                    // needed to parse the procedure result, the typescript anotation, in this case, is wrong.
                    parseJSON: true,
                    password: this.dbPassword,
                    server: this.dbAddress,
                    user: this.dbUserName,
                });
                yield connection.connect();
                let request = new sql.Request(connection);
                for (let p of params) {
                    request.input(p.name, this.convertParameter(p.type, p.typeLength, p.typePrecision, p.typeScale), p.value);
                }
                const recordsets = yield request.execute(procedure);
                if (recordsets.length > 0) {
                    const principal = recordsets[0];
                    if (principal[0]
                        && principal[0][0]) { // WTF!
                        if (principal[0][0].success !== undefined
                            && !principal[0][0].success) {
                            return result_1.Result.Fail(principal[0][0].message || "Ocorreu um erro não definido");
                        }
                        if (recordSetToResult) {
                            return result_1.Result.Ok(recordSetToResult(principal[0][0]));
                        }
                    }
                    if (recordSetToResult) {
                        return result_1.Result.Ok(recordSetToResult(principal));
                    }
                }
                return result_1.Result.Ok();
            }
            catch (error) {
                return result_1.Result.Fail(error.message);
            }
        });
    }
    convertParameter(type, length, precision, scale) {
        switch (type) {
            case parameterType_1.ParameterType.Int:
                return sql.Int;
            case parameterType_1.ParameterType.Boolean:
                return sql.Bit;
            case parameterType_1.ParameterType.Decimal:
                return sql.Decimal(precision, scale);
            case parameterType_1.ParameterType.NVarChar:
                return sql.NVarChar(length);
            case parameterType_1.ParameterType.NVarCharMax:
                return sql.NVarChar(sql.MAX);
            case parameterType_1.ParameterType.Text:
                return sql.NText;
            default:
                break;
        }
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=baseRepository.js.map