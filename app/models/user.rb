class User < ApplicationRecord
  attr_accessor :company_name

  has_many :memberships, dependent: :destroy
  has_many :companies, through: :memberships
  has_many :templates, dependent: :destroy

  belongs_to :company, optional: true

  enum role: { guest: 0, manager: 1, admin: 2 }

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
end
