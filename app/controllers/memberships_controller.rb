class MembershipsController < ApplicationController
  before_action :set_company, only: [:create, :destroy, :add_owner]
  before_action :set_membership, only: [:destroy]
  before_action :check_owner, only: [:create, :destroy, :add_owner]

  load_and_authorize_resource

  def create
    user = User.find(params[:user_id])
    @membership = @company.memberships.new(user: user, role: :member)

    if @membership.save
      redirect_to @company, notice: 'User was successfully added to the company.'
    else
      redirect_to @company, alert: @membership.errors.full_messages.join(', ')
    end
  end

  def destroy
    @membership.destroy
    redirect_to @company, notice: 'User was successfully removed from the company.'
  end

  def add_owner
    user = User.find(params[:user_id])
    user.company_id = @company.id
    membership = @company.memberships.new(user: user, role: :owner)
    if membership.save && user.save
      redirect_to @company, notice: 'User was successfully updated as owner.'
    else
      redirect_to @company, alert: 'User is not a member of this company.'
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
      redirect_to @company, alert: 'Access denied.' unless current_user.admin? || current_user.memberships.find_by(company: @company)&.role == 'owner'
    end
end
