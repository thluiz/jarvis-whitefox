class Result  {  
    success :boolean;
    message :string;
    data: any;

    private constructor(success, message, data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    static Data(data?:string) :Result {
        return new Result(true, undefined, data);
    }

    static Ok(message?:string, data?) :Result {
        return new Result(true, message, data);
    }

    static Fail(message:string, data?) :Result {
        return new Result(false, message, data);
    }
}  

export { Result };