class ValidateAddForeignKeyToTemplates < ActiveRecord::Migration[7.1]
  def change
    validate_foreign_key :templates, :users
  end
end
