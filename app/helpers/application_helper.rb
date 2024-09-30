module ApplicationHelper
  def nav_link_to(name, path)
    class_name = current_page?(path) ? 'nav-link active' : 'nav-link'
    link_to name, path, class: class_name, 'aria-current': ('page' if current_page?(path))
  end

  FLASH_KEY = {
    notice: 'alert-success',
    alert: 'alert-warning',
    error: 'alert-danger'
  }.freeze

  def flash_key(key)
    FLASH_KEY[key.to_sym] || key.to_s
  end

  def current_year
    Time.now.year
  end

  def project_documents_active?(company, project, document = nil)
    current_page?(company_project_documents_path(company, project)) ||
    current_page?(new_company_project_document_path(company, project)) ||
    (document.present? && (
      current_page?(edit_company_project_document_path(company, project, document)) ||
      current_page?(company_project_document_path(company, project, document))
    ))
  end
end
