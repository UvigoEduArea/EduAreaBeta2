class Vocabulary < Element
  
  belongs_to :box
  has_many :vocabulary_terms, :foreign_key => :element_id
  has_many :settings_vocabularies
  has_many :technical_settings, :through => :setting_vocabularies
  has_many :educational_settings, :through => :setting_vocabularies
end