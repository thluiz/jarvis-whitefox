"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FeatureArea {
    static serialize(recordSet) {
        return FeatureArea.create(recordSet.id, recordSet.name);
    }
    static serializeAll(recordSet) {
        return recordSet.map(this.serialize);
    }
    static create(id, name) {
        return new FeatureArea(id, name);
    }
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
exports.FeatureArea = FeatureArea;
//# sourceMappingURL=featureArea.js.map