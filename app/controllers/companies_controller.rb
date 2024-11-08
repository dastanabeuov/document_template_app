class CompaniesController < ApplicationController
  before_action :set_company, only: [:show, :edit, :update, :destroy]
  before_action :check_admin, only: [:new, :create]

  load_and_authorize_resource

  def index
    @breadcrumbs = [
      { name: "<i class='bi bi-house'></i> #{I18n.t('.dashboard')}".html_safe, url: root_path },
      { name: "#{I18n.t('.companies')}", current: true }
    ]

    @user_companies = current_user&.companies
    @companies = Company.all
  end

  def show
    @breadcrumbs = [
      { name: "<i class='bi bi-house'></i> #{I18n.t('.dashboard')}".html_safe, url: root_path },
      { name: "#{I18n.t('.companies')}", url: companies_path },
      { name: "#{@company.name}", current: true }
    ]
  end

  def new
    @breadcrumbs = [
      { name: "<i class='bi bi-house'></i> #{I18n.t('.dashboard')}".html_safe, url: root_path },
      { name: "#{I18n.t('.companies')}", url: companies_path },
      { name: "#{I18n.t('.new')}", current: true }
    ]

    @company = Company.new
  end

  def create
    @company = Company.new(company_params)

    if @company.save
      redirect_to @company, notice: I18n.t('.created')
    else
      render :new, alert: I18n.t('.not_created'), status: :unprocessable_entity
    end
  end

  def edit
    @breadcrumbs = [
      { name: "<i class='bi bi-house'></i> #{I18n.t('.dashboard')}".html_safe, url: root_path },
      { name: "#{I18n.t('.companies')}", url: companies_path },
      { name: "#{@company.name}", url: company_path(@company) },
      { name: "#{I18n.t('.edit')}", current: true }
    ]
  end

  def update
    if @company.update(company_params)
      redirect_to @company, notice: I18n.t('.updated')
    else
      render :edit, alert: I18n.t('.not_updated'), status: :unprocessable_entity
    end
  end

  def destroy
    @company.destroy
    redirect_to companies_path, notice: I18n.t('.destroyed')
  end

  private

    def check_admin
      redirect_to companies_path, alert: I18n.t('.access_denied') unless current_user.admin?
    end

    def set_company
      @company ||= Company.find_by_id(params[:id])
    end

    def company_params
      params.require(:company).permit(:name)
    end
end
