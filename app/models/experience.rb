class Experience < Element
  
  has_one :lesson_plan, :foreign_key => "parent_id"
  has_one :activity
  
  has_many :boards_elements, :foreign_key => "element_id"
  has_many :boards, :through => :boards_elements, :foreign_key => "board_id"
  
  has_many :shared_experiences
  has_many :users, :through => :shared_experiences
  
  def clone_with_associations(current_user, params, session_id, duplicate=false)
    new_experience = super
    
    unless self.lesson_plan.blank?
      new_experience.lesson_plan = self.lesson_plan.clone_with_associations(current_user,params,session_id)
      Usage.addUsage(current_user, new_experience.lesson_plan.source_id, 'Include', new_experience.lesson_plan.id, new_experience.id, session_id, 'Adopt')
    end
    
    return new_experience
  end
  
end