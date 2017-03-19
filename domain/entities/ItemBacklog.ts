
export class ItemBacklog {
    public static serialize(recordSet: any): ItemBacklog {
        return ItemBacklog.create(recordSet.id, recordSet.name);
    }

    public static serializeAll(recordSet: any): ItemBacklog[] {
        return recordSet.map(this.serialize);
    }

    public static create(id: number, name: string) {
        return new ItemBacklog(id, name);
    }

    public id: number;
    public name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}
