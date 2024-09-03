class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new

    if user.admin?
      can :manage, :all
    else
      user.memberships.each do |membership|
        can [:create_document, :read], Template

        can :manage, Document, company_id: membership.company_id

        if membership.owner?
          can :manage, Membership, company_id: membership.company_id
          can :manage, Company, id: membership.company_id
        elsif membership.member?
          can :read, Company, id: membership.company_id
        end
      end

      if user.guest?
        can :read, Template
        can :read, Company
        can :read, Document
      end
    end
  end
end
