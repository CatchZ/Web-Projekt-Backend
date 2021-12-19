import crypto from "crypto";
import { Knex } from "knex";

type Reise = {
    email: string;
    reisename: string;
    reiseziel: string;
    startdate: Date;
    enddate: Date;
};

type SavedReise = Reise & {
    id: string;
};

class ReiseService {
    journeys: SavedReise[] = [];
    private knex: Knex;

    constructor(knex: Knex) {
        this.knex = knex;
    }

    async add(reise: Reise, email: string | null): Promise<{ enddate: Date; reiseziel: string; id: string; startdate: Date; reisename: string; email: string | null }> {
        const newReise = {
            ...reise,
            email: email,
            id: crypto.randomUUID(),
        };
        await this.knex("journeys").insert(newReise);
        return newReise;
    }

    async delete(uuid: string): Promise<void> {
        await this.knex("journeys").where({ id: uuid }).delete();
    }

    async getAll(email: string | null): Promise<Reise[]> {
        return this.knex("journeys");
    }


}

export default ReiseService;