class TemplatesController < ApplicationController
  before_action :set_template, only: %i[show edit update destroy]

  protect_from_forgery except: :upload_image

  load_and_authorize_resource

  def index
    @breadcrumbs = [
      { name: "<i class='bi bi-house'></i> #{I18n.t('.dashboard')}".html_safe, url: root_path },
      { name: "#{I18n.t('.templates')}", current: true }
    ]

    @templates = Template.all
  end

  def show
    @breadcrumbs = [
      { name: "<i class='bi bi-house'></i> #{I18n.t('.dashboard')}".html_safe, url: root_path },
      { name: "#{I18n.t('.templates')}", url: templates_path },
      { name: "#{@template.title}", current: true }
    ]
  end

  def new
    @breadcrumbs = [
      { name: "<i class='bi bi-house'></i> #{I18n.t('.dashboard')}".html_safe, url: root_path },
      { name: "#{I18n.t('.templates')}", url: templates_path },
      { name: "#{I18n.t('.new')}", current: true }
    ]

    @template = current_user.templates.new
  end

  def edit
    @breadcrumbs = [
      { name: "<i class='bi bi-house'></i> #{I18n.t('.dashboard')}".html_safe, url: root_path },
      { name: "#{I18n.t('.templates')}", url: templates_path },
      { name: "#{@template.title}", url: template_path(@template) },
      { name: "#{I18n.t('.edit')}", current: true }
    ]
  end

  def create
    @template = current_user.templates.new(template_params)

    if @template.save
      redirect_to @template, notice: I18n.t('.created')
    else
      render :new, alert: I18n.t('.not_created'), status: :unprocessable_entity
    end
  end

  def update
    if @template.update(template_params)
      redirect_to @template, notice: I18n.t('.updated')
    else
      render :edit, alert: I18n.t('.not_updated'), status: :unprocessable_entity
    end
  end

  def destroy
    @template.destroy
    redirect_to templates_url, notice: I18n.t('.destroyed')
  end

  def upload_image
    template = Template.find_by_id(params[:id])

    template_image = template.template_images.build
    template_image.image.attach(params["file-0"])

    if template_image.save
      render json: {
        success: true,
        url: url_for(template_image.image),
        message: I18n.t('.uploaded')
      }
    else
      render json: {
        success: false,
        message: I18n.t('.not_uploaded')
      }, status: :unprocessable_entity
    end
  end

  def sample_template
    @template = Template.create(
      title: "#{I18n.t('.sample_title')}-#{SecureRandom.urlsafe_base64(4)}",
      content: "#{I18n.t('.sample_content')}".html_safe,
      user_id: current_user.id
    )

    if @template.persisted?
      redirect_to edit_template_path(@template), notice: I18n.t('.created')
    else
      redirect_to templates_path, alert: I18n.t('.not_created')
    end
  end

  private
    def set_template
      @template = Template.find_by_id(params[:template_id])
    end

    def template_params
      params.require(:template).permit(:title, :content, :image)
    end
end
