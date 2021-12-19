"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    return knex.schema
        .createTable('users', function (table) {
        table.uuid('id').primary();
        table.string('name', 255).notNullable();
        table.string('password', 255).notNullable();
    })
        .createTable('journeys', function (table) {
        table.uuid('id').primary();
        table.string('reisename', 255).notNullable();
        table.string('reiseziel', 255).notNullable();
        table.date('startdate').notNullable();
        table.date('enddate').notNullable();
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema
        .dropTableIfExists('journeys');
}
exports.down = down;

