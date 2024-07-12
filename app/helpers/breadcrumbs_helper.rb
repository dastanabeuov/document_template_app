module BreadcrumbsHelper
  def breadcrumbs(paths)
    content_tag(:nav, aria: { label: 'breadcrumb' }) do
      content_tag(:ol, class: 'breadcrumb') do
        safe_join(paths.map { |path| breadcrumb_item(path) })
      end
    end
  end

  private

  def breadcrumb_item(path)
    if path[:current]
      content_tag(:li, path[:name], class: 'breadcrumb-item active', aria: { current: 'page' })
    else
      content_tag(:li, class: 'breadcrumb-item') do
        link_to(path[:name], path[:url])
      end
    end
  end
end
