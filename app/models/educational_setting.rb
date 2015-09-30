class EducationalSetting < Element
  has_many :settings, :foreign_key => "element_id"
  belongs_to :activity, :foreign_key => "parent_id"
  belongs_to :lesson_plan, :foreign_key => "parent_id"
  
  has_many :settings_vocabularies, :foreign_key => "setting_id"
  has_many :vocabularies, :through => :settings_vocabularies
  
  def clone_with_associations(current_user, params, session_id, duplicate=false)
    new_es = super #copiamos el objecto y modificamos el titulo si es necesario
    
    new_es.vocabularies << self.vocabularies
    
    Setting.cloneSettings("EducationalSettings", self.id, new_es.id)
    
    new_es.save
    return new_es
  end
  
end