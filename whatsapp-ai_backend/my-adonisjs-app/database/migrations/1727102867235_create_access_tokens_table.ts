import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'auth_access_tokens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Foreign key to users table
      table
        .integer('tokenable_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      // Type of token (e.g., API, session)
      table.string('type').notNullable()

      // Name for the token (optional, could be used to identify which client/app issued it)
      table.string('name').nullable()

      // The actual hashed token
      table.string('hash').notNullable()

      // The abilities the token has (e.g., read, write), this is serialized as a JSON string
      table.text('abilities').notNullable()

      // Timestamps for creation, update, and when the token was last used
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('last_used_at', { useTz: true }).nullable()

      // Expiry time for the token, if applicable
      table.timestamp('expires_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
