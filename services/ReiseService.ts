import crypto from "crypto";
import { Knex } from "knex";

type Reise = { //todo
    date: Date;
    name: string;
    value: number;
};

type SavedReise = Reise & {
    id: string;
};

class ReiseService {
    expenses: SavedReise[] = [];
    private knex: Knex;

    constructor(knex: Knex) {
        this.knex = knex;
    }

    async add(reise: Reise): Promise<SavedReise> {
        const newReise = {
            ...reise,
            id: crypto.randomUUID(),
        };
        await this.knex("reisen").insert(newReise);
        return newReise;
    }

    async delete(uuid: string): Promise<void> {
        await this.knex("reisen").where({ id: uuid }).delete();
    }

    async getAll(): Promise<Reise[]> {
        return this.knex("reisen");
    }

    async getTotal(): Promise<number> {
        const response = await this.knex<SavedReise>("reisen")
            .sum("value")
            .first();
        return response?.sum || 0;
    }
}

export default ReiseService;