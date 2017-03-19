import { ParameterType } from "./parameterType";


export class SQLParameter {
    public static Int(name: string, value: number) {
        return new SQLParameter(name, ParameterType.Int, value);
    }

    public static Boolean(name: string, value: boolean) {
        return new SQLParameter(name, ParameterType.Boolean, value ? 1 : 0);
    }

    public static JSON(name: string, value: any) {
        return SQLParameter.NVarCharMax(name, JSON.stringify(value));
    }

    public static NVarCharMax(name: string, value: string) {
        return new SQLParameter(name, ParameterType.NVarCharMax, value, undefined, undefined, undefined);
    }

    public static NVarChar(name: string, value: string, length: number) {
        return new SQLParameter(name, ParameterType.NVarChar, value, length, undefined, undefined);
    }

    public static Decimal(name: string, value: number, precision: number, scale: number): SQLParameter {
        return new SQLParameter(name, ParameterType.Decimal, value, undefined, precision, scale);
    }

    public name: string;
    public type: ParameterType;
    public typeLength: number;
    public typePrecision: number;
    public typeScale: number;
    public value: any;

    constructor(name: string, type: ParameterType, value: any,
                typeLength?: number, typePrecision?: number, typeScale?: number) {
        this.name = name;
        this.type = type;
        this.value = value;
        this.typeLength = typeLength;
        this.typePrecision = typePrecision;
        this.typeScale = typeScale;
    }
}
