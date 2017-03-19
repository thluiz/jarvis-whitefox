"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parameterType_1 = require("./parameterType");
class SQLParameter {
    static Int(name, value) {
        return new SQLParameter(name, parameterType_1.ParameterType.Int, value);
    }
    static Boolean(name, value) {
        return new SQLParameter(name, parameterType_1.ParameterType.Boolean, value ? 1 : 0);
    }
    static JSON(name, value) {
        return SQLParameter.NVarCharMax(name, JSON.stringify(value));
    }
    static NVarCharMax(name, value) {
        return new SQLParameter(name, parameterType_1.ParameterType.NVarCharMax, value, undefined, undefined, undefined);
    }
    static NVarChar(name, value, length) {
        return new SQLParameter(name, parameterType_1.ParameterType.NVarChar, value, length, undefined, undefined);
    }
    static Decimal(name, value, precision, scale) {
        return new SQLParameter(name, parameterType_1.ParameterType.Decimal, value, undefined, precision, scale);
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
//# sourceMappingURL=sqlParameter.js.map