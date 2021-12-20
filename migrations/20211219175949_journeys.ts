import { Knex } from "knex";
export async function up(knex: Knex): Promise<void> {
    return knex.schema
        /*
        .createTable('users', function (table) {
            table.uuid('id').primary();
            table.string('name', 255).notNullable();
            table.string('password', 255).notNullable();
        })
         */
        .createTable('journeys', function (table) {
            table.uuid('id').primary();
            //fremdschluessel username table.string('owner')
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