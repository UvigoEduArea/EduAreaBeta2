class VocabularyTerm < ActiveRecord::Base
  
  belongs_to :vocabulary, :foreign_key => "element_id"
  has_many :settings, :foreign_key => "field_value"
end