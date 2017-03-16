export class DataResult<T> {
    success: boolean;
    message: string;
    data: T;

    private constructor(success: boolean, data: T, message?: string) {
        this.success = success;
        this.data = data;
    }

    static Ok<T>(data?: T): DataResult<T> {
        return new DataResult<T>(true, data);
    }

    static Fail<T>(message?: string): DataResult<T> {
        return new DataResult<T>(false, undefined, message);
    }
}