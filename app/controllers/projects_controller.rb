class ProjectsController < ApplicationController
  before_action :set_company
  before_action :set_project, only: %i[sample_document show edit update destroy]

  load_and_authorize_resource

  def index
    @breadcrumbs = [
      { name: "<i class='bi bi-house'></i> #{I18n.t('.dashboard')}".html_safe, url: root_path },
      { name: "#{I18n.t('.companies')}", url: companies_path },
      { name: "#{@company.name}", url: company_path(@company) },
      { name: "#{I18n.t('.projects')}", current: true }
    ]

    @projects = @company.projects
  end

  def show
    @breadcrumbs = [
      { name: "<i class='bi bi-house'></i> #{I18n.t('.dashboard')}".html_safe, url: root_path },
      { name: "#{I18n.t('.companies')}", url: companies_path },
      { name: "#{@company.name}", url: company_path(@company) },
      { name: "#{I18n.t('.projects')}", url: company_projects_path(@company) },
      { name: "#{@project.title}", current: true }
    ]
  end

  def new
    @breadcrumbs = [
      { name: "<i class='bi bi-house'></i> #{I18n.t('.dashboard')}".html_safe, url: root_path },
      { name: "#{I18n.t('.companies')}", url: companies_path },
      { name: "#{@company.name}", url: company_path(@company) },
      { name: "#{I18n.t('.projects')}", url: company_projects_path(@company) },
      { name: "#{I18n.t('.new')}", current: true }
    ]

    @project = @company.projects.new
  end

  def create
    @project = @company.projects.new(project_params)
    if @project.save
      redirect_to [@company, @project], notice: I18n.t('.created')
    else
      render :new, alert: I18n.t('.not_created'), status: :unprocessable_entity
    end
  end

  def edit
    @breadcrumbs = [
      { name: "<i class='bi bi-house'></i> #{I18n.t('.dashboard')}".html_safe, url: root_path },
      { name: "#{I18n.t('.companies')}", url: companies_path },
      { name: "#{@company.name}", url: company_path(@company) },
      { name: "#{I18n.t('.projects')}", url: company_projects_path(@company) },
      { name: "#{@project.title}", url: company_project_path(@company, @project) },
      { name: "#{I18n.t('.edit')}", current: true }
    ]
  end

  def update
    if @project.update(project_params)
      redirect_to [@company, @project], notice: I18n.t('.updated')
    else
      render :edit, alert: I18n.t('.not_updated'), status: :unprocessable_entity
    end
  end

  def destroy
    @project.destroy
    redirect_to company_projects_path(@company), notice: I18n.t('.destroyed')
  end

  def sample_document
    @document = Document.create(
      title: "#{I18n.t('.sample_title')}-#{SecureRandom.urlsafe_base64(4)}",
      content: "#{I18n.t('.sample_content')}".html_safe,
      user_id: current_user.id,
      project_id: @project.id,
      company_id: @company.id
    )

    if @document.persisted?
      redirect_to edit_company_project_document_path(@company, @project, @document), notice: I18n.t('.created')
    else
      redirect_to company_project_path(@company, @project), alert: I18n.t('.not_created')
    end
  end

  private

    def set_company
      @company = Company.find_by_id(params[:company_id])
    end

    def set_project
      @project = @company.projects.find_by_id(params[:id])
    end

    def project_params
      params.require(:project).permit(:title, :description)
    end
end
