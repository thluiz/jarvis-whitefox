import { IntentDialog, Session } from "botbuilder";

export interface IIntentBase {
    setup(dialog: IntentDialog): void;
}

export interface IUserError {
    error: string;
    date: Date;
}

export class IntentBase implements IIntentBase {
    public setup(dialog: IntentDialog) {
        throw "Not implemented!";
    }

    protected checkUserLogedIn(session: Session, message: string): boolean {
        if (!session.userData.user
            || !session.userData.user.id
            || session.userData.user.id <= 0) {
            // tslint:disable-next-line:max-line-length
            session.send(message);
            session.replaceDialog("/profile");
            return false;
        }

        return true;
    }

    protected saveUserError(session: Session, error: IUserError) {
        let errors = this.expirateOldErrors(session.userData.errors || []);
        errors.push(error);

        session.userData.errors = this.keepLastUserErrors(errors);
    }

    // user data is limited so keep just the last ones
    private keepLastUserErrors(errors: IUserError[]): IUserError[] {
        if (errors.length > 3) {
            errors.shift();
        }
        return errors;
    }

    private expirateOldErrors(errors: IUserError[]): IUserError[] {
        const expiration = new Date(new Date().getTime() - (1000 * 60 * 15)); // 15 minutes
        return errors.filter((e) => {
            return new Date(e.date).getTime() >= expiration.getTime();
        });
    }
}
