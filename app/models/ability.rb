# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new
    if user.admin?
      can :manage, Template
      can :manage, Document
      can :manage, Company
    else
      can :read, Template
      can :read, Document
      can :read, Company
    end
  end
end
