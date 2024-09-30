class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new

    if user.admin?
      can :manage, :all
    else
      user.memberships.each do |membership|
        # Права на создание и чтение шаблонов
        can [:create_document, :read], Template

        # Управление документами компании, где пользователь является участником
        can :manage, Document, company_id: membership.company_id

        # Управление проектами компании, где пользователь является участником
        can :manage, Project, company_id: membership.company_id

        if membership.owner?
          # Управление членством и компанией для владельцев
          can :manage, Membership, company_id: membership.company_id
          can :manage, Company, id: membership.company_id
        elsif membership.member?
          # Права только на чтение для участников
          can :read, Company, id: membership.company_id
          can :read, Project, company_id: membership.company_id
        end
      end

      if user.guest?
        # Гости могут только читать шаблоны, компании и документы
        can :read, Template
        can :read, Company
        can :read, Document
        can :read, Project
      end
    end
  end
end
