class MembershipsController < ApplicationController
  before_action :set_company, only: [:create, :destroy, :add_owner]
  before_action :set_membership, only: [:destroy]
  before_action :check_owner, only: [:create, :destroy, :add_owner]

  load_and_authorize_resource

  def create
    user = User.find(params[:user_id])
    @membership = @company.memberships.new(user: user, role: :member)

    if @membership.save
      redirect_to @company, notice: I18n.t('.user_added_company')
    else
      redirect_to @company, alert: @membership.errors.full_messages.join(', ')
    end
  end

  def destroy
    @membership.destroy
    redirect_to @company, notice: I18n.t('.user_removed_company')
  end

  def add_owner
    user = User.find(params[:user_id])
    user.company_id = @company.id
    membership = @company.memberships.new(user: user, role: :owner)
    if membership.save && user.save
      redirect_to @company, notice: I18n.t('.user_added_owner_company')
    else
      redirect_to @company, alert: I18n.t('.not_added_owner_company')
    end
  end

  private

    def set_company
      @company ||= Company.find_by_id(params[:company_id])
    end

    def set_membership
      @membership = @company.memberships.find_by_id(params[:id])
    end

    def check_owner
      redirect_to @company, alert: I18n.t('.access_denied') unless current_user.admin? || current_user.memberships.find_by(company: @company)&.role == 'owner'
    end
end
