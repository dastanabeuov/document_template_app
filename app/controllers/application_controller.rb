require "application_responder"

class ApplicationController < ActionController::Base
  self.responder = ApplicationResponder
  respond_to :html

  before_action :set_breadcrumbs

  def set_breadcrumbs
    @breadcrumbs = [
      { name: '<i class="bi bi-house"></i>'.html_safe, current: true }
    ]
  end

  rescue_from CanCan::AccessDenied do |exception|
    redirect_to root_path, alert: exception.message
  end
end
