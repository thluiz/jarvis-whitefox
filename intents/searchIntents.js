"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const intentBase_1 = require("./intentBase");
class SearchIntents extends intentBase_1.IntentBase {
    setup(dialog) {
        dialog.matches("search", [
            (session, args, next) => {
                session.endDialog("eu deveria procurar alguma coisa, mas ainda não me programaram... sorry!");
            },
        ]);
    }
}
exports.SearchIntents = SearchIntents;
//# sourceMappingURL=searchIntents.js.map