class RemoveRedundantMembershipIndex < ActiveRecord::Migration[7.1]
  def change
    remove_index :memberships, name: "index_memberships_on_user_id"
  end
end
