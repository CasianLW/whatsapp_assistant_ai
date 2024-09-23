import { BaseSchema } from '@adonisjs/lucid/schema'

export default class SpecialCodes extends BaseSchema {
  protected tableName = 'special_codes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // The code itself
      table.string('code').notNullable().unique()

      // Number of credits that the code provides
      table.integer('credits').notNullable()

      // Boolean to check if the code has been used
      table.boolean('is_used').defaultTo(false)

      // Reference to the user who redeemed the code
      table.integer('user_id').unsigned().nullable().references('id').inTable('users')

      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
