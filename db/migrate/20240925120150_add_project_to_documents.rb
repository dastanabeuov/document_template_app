class AddProjectToDocuments < ActiveRecord::Migration[7.1]
  disable_ddl_transaction!

  def change
    add_reference :documents, :project, index: {algorithm: :concurrently}
  end
end
