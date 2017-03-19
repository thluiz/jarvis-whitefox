export class Result<T> {
    public static Ok<T>(data?: T): Result<T> {
        return new Result<T>(true, data);
    }

    public static Fail<T>(message?: string): Result<T> {
        return new Result<T>(false, undefined, message);
    }

    public success: boolean;
    public message: string;
    public data: T;

    private constructor(success: boolean, data: T, message?: string) {
        this.success = success;
        this.data = data;
        this.message = message;
    }
}
