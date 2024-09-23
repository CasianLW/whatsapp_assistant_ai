import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable() // Primary key
      table.string('full_name').nullable() // User's full name
      table.string('email', 254).notNullable().unique() // Email, must be unique
      table.string('password').notNullable() // Hashed password
      table.string('role').defaultTo('user') // Role: 'user' or 'admin', default to 'user'
      table.integer('credits').defaultTo(5) // Default number of credits for new users
      table.timestamps(true, true) // Automatically managed timestamps
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
