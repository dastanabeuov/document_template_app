ThinkingSphinx::Index.define :template, with: :active_record do
  indexes title, sortable: true

  has created_at, updated_at
end
