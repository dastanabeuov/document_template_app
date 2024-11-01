module ApplicationHelper
  def nav_link_to(name, path)
    class_name = current_page?(path) ? 'nav-link active' : 'nav-link'
    link_to name, path, class: class_name, 'aria-current': ('page' if current_page?(path))
  end

  def flash_key(key)
    case key.to_sym
    when :notice, :success
      'alert-success'
    when :info
      'alert-info'
    when :warning
      'alert-warning'
    when :error, :alert, :danger
      'alert-danger'
    else
      'alert-primary'
    end
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
