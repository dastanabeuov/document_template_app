class User < ApplicationRecord
  enum role: { guest: 0, manager: 1, admin: 2 }

  has_many :templates, dependent: :destroy

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
end
