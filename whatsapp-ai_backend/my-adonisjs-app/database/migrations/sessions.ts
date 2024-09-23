import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Sessions extends BaseSchema {
  protected tableName = 'sessions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Reference to the user
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      // WhatsApp session ID (to track the user session)
      table.string('whatsapp_session_id').notNullable()

      // Status of the WhatsApp session (e.g., connected, disconnected)
      table.string('status').defaultTo('disconnected')

      // Timestamp when the session was last active
      table.timestamp('last_active_at', { useTz: true }).nullable()

      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
