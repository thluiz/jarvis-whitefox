import * as sql from "mssql";
import { Result } from "../../support/result";
import { ParameterType } from "../parameterType";
import { SQLParameter } from "../sqlParameter";

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

    public async executeSPNoResult(procedure: string, ...params: SQLParameter[]): Promise<Result<any>> {
        return this.executeSP<Result<any>>(procedure, undefined, ...params);
    }

    public async executeSP<T>(procedure: string,
                              recordSetToResult: (recordSet: any) => T,
                              ...params: SQLParameter[]): Promise<Result<T>> {

        try {
            const connection = new sql.Connection(<any> {
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

            await connection.connect();
            let request: sql.Request = new sql.Request(connection);
            for (let p of params) {
                request.input(p.name,
                this.convertParameter(p.type, p.typeLength, p.typePrecision, p.typeScale), p.value);
            }

            const recordsets = await request.execute(procedure);

            if (recordsets.length > 0 && recordSetToResult) {
                return Result.Ok<T>(recordSetToResult(recordsets[0]));
            }

            return Result.Ok<T>();
        } catch (error) {
            return Result.Fail<T>(error.message);
        }

    }

    private convertParameter(type: ParameterType, length: number, precision: number, scale: number) {
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
}
