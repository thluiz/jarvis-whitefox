"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IntentBase {
    setup(dialog) {
        throw "Not implemented!";
    }
    saveUserError(session, error) {
        let errors = this.expirateOldErrors(session.userData.errors || []);
        errors.push(error);
        session.userData.errors = this.keepLastUserErrors(errors);
    }
    // user data is limited so keep just the last ones
    keepLastUserErrors(errors) {
        if (errors.length > 3) {
            errors.shift();
        }
        return errors;
    }
    expirateOldErrors(errors) {
        const expiration = new Date(new Date().getTime() - (1000 * 60 * 15)); // 15 minutes
        return errors.filter((e) => {
            return new Date(e.date).getTime() >= expiration.getTime();
        });
    }
}
exports.IntentBase = IntentBase;
//# sourceMappingURL=intentBase.js.map