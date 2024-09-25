module HomesHelper
  def get_text(template_content)
    parsed_content = JSON.parse(template_content)
    text = parsed_content['blocks'].map { |block| block['data']['text'] if block['type'] == 'paragraph' }.compact.join(" ")
    text
  end
end
