
declare module "await-to-js" {
    export default function awaitTo<T>(promise: Promise<T>): [ Error, T ];
    /**
     * 
     * @param promise 
     * @param errExt - Additional Information you can pass to the err object
     */
    export default function awaitTo<T,Q>(promise: Promise<T>, errorExt: Object): [ Error, T];
}