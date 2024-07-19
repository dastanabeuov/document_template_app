class TemplatesController < ApplicationController
  before_action :authenticate_user!, only: %i[new edit create update destroy]
  before_action :set_template, only: %i[show edit update destroy]
  before_action :set_breadcrumbs

  protect_from_forgery except: :upload_image

  rescue_from ActiveRecord::RecordNotFound, with: :template_not_found

  def index
    @templates = Template.all
  end

  def show
  end

  def new
    @template = current_user.templates.new
  end

  def edit
  end

  def create
    @template = current_user.templates.new(template_params)

    if @template.save
      flash[:notice] = 'Template was successfully created.'
      redirect_to @template
    else
      flash.now[:alert] = 'Template was not created.'
      render :new
    end
  end

  def update
    if @template.update(template_params)
      flash[:notice] = 'Template was successfully updated.'
      redirect_to @template
    else
      flash.now[:alert] = 'Template was not updated.'
      render :edit
    end
  end

  def destroy
    @template.destroy
    flash[:notice] = 'Template was successfully destroyed.'
    redirect_to templates_url
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
    def template_not_found
      flash[:alert] = 'Template not found.'
      redirect_to templates_url
    end

    def set_template
      @template ||= Template.find_by_id(params[:id])
    end

    def set_breadcrumbs
      @breadcrumbs = [
        { name: '<i class="bi bi-house"></i>'.html_safe, url: root_path },
        { name: 'Templates', current: true }
      ]
    end

    def template_params
      params.require(:template).permit(:title, :content, :image)
    end
end
