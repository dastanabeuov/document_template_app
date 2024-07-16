class AddForeignKeyToTemplates < ActiveRecord::Migration[7.1]
  def change
    add_foreign_key :templates, :users, validate: false
  end
end
