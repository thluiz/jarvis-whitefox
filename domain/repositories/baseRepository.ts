import * as sql from "mssql";
import { DataResult } from "../../support/result";

export enum ParameterType {
    Int,
    NVarChar,
    NVarCharMax,
    Text,
    Decimal
}

export class SQLParameter {
    name: string;
    type: ParameterType;
    typeLength: number;
    typePrecision: number;
    typeScale: number;
    value: any;

    static Int(name: string, value: number) {
        return new SQLParameter(name, ParameterType.Int, value);
    }

    static JSON(name: string, value: any) {
        return SQLParameter.NVarCharMax(name, JSON.stringify(value));
    }

    static NVarCharMax(name: string, value: string) {
        return new SQLParameter(name, ParameterType.NVarCharMax, value, undefined, undefined, undefined);
    }

    static NVarChar(name: string, value: string, length: number) {
        return new SQLParameter(name, ParameterType.NVarChar, value, length, undefined, undefined);
    }

    static Decimal(name: string, value: number, precision: number, scale: number): SQLParameter {
        return new SQLParameter(name, ParameterType.Decimal, value, undefined, precision, scale);
    }

    constructor(name: string, type: ParameterType, value: any, typeLength?: number, typePrecision?: number, typeScale?: number) {
        this.name = name;
        this.type = type;
        this.value = value;
        this.typeLength = typeLength;
        this.typePrecision = typePrecision;
        this.typeScale = typeScale;
    }
}

export class BaseRepository {
    private dbUserName: string;
    private dbPassword: string;
    private dbAddress: string;
    private dbName: string;

    protected constructor(dbAddress: string, dbName: string, dbUserName: string, dbPassword: string) {
        this.dbAddress = dbAddress;
        this.dbName = dbName;
        this.dbUserName = dbUserName;
        this.dbPassword = dbPassword;
    }

    private static convertParameter(type: ParameterType, length: number, precision: number, scale: number) {
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

    async executeSPNoResult(procedure: string, ...params: SQLParameter[]): Promise<DataResult<any>> {
        return this.executeSP<DataResult<any>>(procedure, undefined, ...params);
    }

    async executeSP<T>(procedure: string,
        recordSetToResult: (recordSet: any) => T,
        ...params: SQLParameter[]): Promise<DataResult<T>> {

        try {
            var connection = new sql.Connection(<any>{
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

            await connection.connect();
            let request: sql.Request = new sql.Request(connection);
            for (let p of params) {
                request.input(p.name, BaseRepository.convertParameter(p.type, p.typeLength, p.typePrecision, p.typeScale), p.value);
            }

            var recordsets = await request.execute(procedure);

            if (recordsets.length > 0 && recordSetToResult) {
                return DataResult.Ok<T>(recordSetToResult(recordsets[0]));
            }

            return DataResult.Ok<T>();
        } catch (error) {
            return DataResult.Fail<T>(error.message);
        }

    }
}