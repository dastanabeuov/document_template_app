class AddIndexToCompanies < ActiveRecord::Migration[7.1]
  disable_ddl_transaction!

  def change
    add_index :companies, :name, unique: true, algorithm: :concurrently
  end
end
