import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AppSettings extends BaseSchema {
  protected tableName = 'app_settings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // AI model key (for example, the model used for the assistant)
      table.string('ai_key').notNullable()

      // Value for the setting (could be string, number, or JSON)
      table.text('value').notNullable()

      // Description of what this setting does
      table.string('description').nullable()

      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
