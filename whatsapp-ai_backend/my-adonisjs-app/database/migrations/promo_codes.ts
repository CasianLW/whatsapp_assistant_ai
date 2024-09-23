import { BaseSchema } from '@adonisjs/lucid/schema'

export default class PromoCodes extends BaseSchema {
  protected tableName = 'promo_codes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // The promotional code itself
      table.string('code').notNullable().unique()

      // Discount percentage (e.g., 20 means 20%)
      table.integer('discount').notNullable()

      // Maximum usage of the code (how many times it can be used)
      table.integer('max_usage').defaultTo(1)

      // Expiration date of the promo code
      table.timestamp('expires_at', { useTz: true }).nullable()

      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
