
exports.up = function(knex) {
  return knex.schema
    .createTable('users', tbl => {
        tbl.increments();
        tbl.string('userName', 255);
        tbl.string('emailAddress', 255)
            .notNullable()
            .unique();
    })
    .createTable('events', tbl => {
        tbl.increments();
        tbl.string('name', 255)
            .notNullable();
        tbl.string('inviteUrl', 255)
            .notNullable();
        tbl.string('date', 255);
        tbl.string('time', 255)
    })
    .createTable('event_users', tbl => {
        tbl.increments();
        tbl.integer('eventId')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('events')
            .onDelete('RESTRICT')
            .onUpdate('CASCADE');
        tbl.integer('userId')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('RESTRICT')
            .onUpdate('CASCADE');
        tbl.bool('isAdmin')
            .defaultTo(false)
            .notNullable();
    })
    .createTable('event_availabilities', tbl => {
        tbl.increments();
        tbl.integer('eventId')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('events')
            .onDelete('RESTRICT')
            .onUpdate('CASCADE');
        tbl.integer('userId')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('RESTRICT')
            .onUpdate('CASCADE');
        tbl.string('availabilityStart', 255)
            .notNullable();
        tbl.integer('durationMinutes')
            .notNullable()
    })
    .createTable('user_friends', tbl => {
        tbl.increments();
        tbl.integer('userId')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('RESTRICT')
            .onUpdate('CASCADE');
        tbl.integer('friendId')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('RESTRICT')
            .onUpdate('CASCADE');
    })
}; 

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('user_friends')
    .dropTableIfExists('event_availabilities')
    .dropTableIfExists('event_users')
    .dropTableIfExists('events')
    .dropTableIfExists('users')
};
