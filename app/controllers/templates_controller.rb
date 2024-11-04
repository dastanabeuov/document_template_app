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
    @template = current_user.templates.new
  end

  def edit
  end

  def create
    @template = current_user.templates.new(template_params)

    if @template.save
      redirect_to @template, notice: 'Template was successfully created.'
    else
      render :new, alert: 'Template was not created.', status: :unprocessable_entity
    end
  end

  def update
    if @template.update(template_params)
      redirect_to @template, notice: 'Template was successfully updated.'
    else
      render :edit, alert: 'Template was not updated.', status: :unprocessable_entity
    end
  end

  def destroy
    @template.destroy
    redirect_to templates_url, notice: 'Template was successfully destroyed.'
  end

  def upload_image
    image = params[:image]

    if image.nil?
      render json: { success: 0, error: "No image found in request" }
      return
    end

    uploaded_image = TemplateImage.create!(image: image)

    stored_image_url = rails_blob_url(uploaded_image.image)

    render json: { success: 1, file: { url: stored_image_url } }
  rescue StandardError => e
    render json: { success: 0, error: e.message }
  end

  private
    def set_template
      @template = Template.find_by_id(params[:template_id])
    end

    def template_params
      params.require(:template).permit(:title, :content, :image)
    end
end
