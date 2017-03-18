
export class ItemBacklog {
    public static serialize(recordSet: any): ItemBacklog {
        const data: any = recordSet[0][0];

        return new ItemBacklog(data.Id, data.Name);
    }

    public static serializeAll(recordSet: any): ItemBacklog[] {
        let items: any[] = [];
        recordSet[0][0].forEach(p => {
            items.push(ItemBacklog.create(p.id, p.name));
        });

        return items;
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
