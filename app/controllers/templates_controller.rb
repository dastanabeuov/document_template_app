class TemplatesController < ApplicationController
  before_action :authenticate_user!, only: %i[new edit create update destroy]
  before_action :set_template, only: %i[show edit update destroy]
  before_action :set_breadcrumbs

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

  private

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
    params.require(:template).permit(:title, :content)
  end
end
