import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("reisen").del();

    // Inserts seed entries
    await knex("reisen").insert([
        {
            id: "1eaae687-ad09-4824-b53d-0d7563d92951",
            reisename: "TestreiseDE",
            reiseziel: "DE",
            startdate: "2021-01-01",
            enddate: "2021-01-04",
        },
        {
            id: "1eaae687-ad09-4824-b53d-0d7563d92951",
            reisename: "TestreiseGB",
            reiseziel: "GB",
            startdate: "2021-02-01",
            enddate: "2021-02-02",
        },
    ]);
}