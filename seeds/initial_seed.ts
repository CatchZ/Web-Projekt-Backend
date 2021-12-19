import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("reisen").del();

    // Inserts seed entries
    await knex("reisen").insert([
        {
            id: "1eaae687-ad09-4824-b53d-0d7563d92951",
            date: "2021-01-01",
            name: "Brötchen",
            value: 140,
        },
        {
            id: "24ce658d-9a12-4783-96ad-924464e6ecf0",
            date: "2021-02-06",
            name: "Tax",
            value: 1400,
        },
    ]);
}