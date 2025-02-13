class AddIndexToDocuments < ActiveRecord::Migration[7.1]
  disable_ddl_transaction!

  def change
    add_index :documents, :title, unique: true, algorithm: :concurrently
  end
end
