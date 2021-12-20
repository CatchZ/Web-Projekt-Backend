import { Knex } from "knex";
export async function up(knex: Knex): Promise<void> {
    return knex.schema

        .createTable('journeys', function (table) {
            table.uuid('id').primary();
            //fremdschluessel username table.string('owner') //todo
            table.string('reisename', 255).notNullable();
            table.string('reiseziel', 255).notNullable();
            table.date('startdate').notNullable();
            table.date('enddate').notNullable();
        })
}
export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .dropTableIfExists('journeys');
}