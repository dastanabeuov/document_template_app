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
end
