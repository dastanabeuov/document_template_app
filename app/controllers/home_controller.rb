class HomeController < ApplicationController
  before_action :set_breadcrumbs

  def index
  end

  private

  def set_breadcrumbs
    @breadcrumbs = [
      { name: '<i class="bi bi-house"></i>'.html_safe, url: root_path },
      { name: 'Library', url: root_path },
      { name: 'Data', current: true }
    ]
  end
end
