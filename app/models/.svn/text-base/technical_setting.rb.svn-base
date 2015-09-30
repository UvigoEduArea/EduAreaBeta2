class TechnicalSetting < Element
  has_many :settings, :foreign_key => "element_id"
  belongs_to :activity, :foreign_key => "parent_id"
  belongs_to :lesson_plan, :foreign_key => "parent_id"
  
  has_many :devices, :foreign_key => "parent_id"
  has_many :applications, :foreign_key => "parent_id"
  
  has_many :settings_vocabularies, :foreign_key => "setting_id"
  has_many :vocabularies, :through => :settings_vocabularies
  
  def clone_with_associations(current_user, params, session_id, duplicate=false)
    new_ts = super #copiamos el objecto y modificamos el titulo si es necesario
    
    new_ts.applications << self.clone_element(self.applications, current_user)
    new_ts.devices << self.clone_element(self.devices, current_user)
    
    new_ts.vocabularies << self.vocabularies
    
    Setting.cloneSettings("TechnicalSettings", self.id, new_ts.id)
    
    new_ts.save
    return new_ts
  end
  
end