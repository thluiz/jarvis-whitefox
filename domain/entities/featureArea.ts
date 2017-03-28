export class FeatureArea {
    public static serialize(recordSet: any): FeatureArea {
        return FeatureArea.create(recordSet.id, recordSet.name);
    }

    public static serializeAll(recordSet: any): FeatureArea[] {
        return recordSet.map(this.serialize);
    }

    public static create(id: number, name: string) {
        return new FeatureArea(id, name);
    }

    public id: number;
    public name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}
