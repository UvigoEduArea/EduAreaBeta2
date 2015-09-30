class Subject < Element
  
  has_many :lesson_plans, :foreign_key => "parent_id"

 
  def clone_with_associations(current_user, params, session_id)
    new_subject = self.dup
    new_subject.creator_id = current_user
    new_subject.image = self.image
    new_subject.save
    
    
    
    #Se copian los recursos contenidos en la lesson plan pero en este caso no son clonaciones y no
    #debe incluirse ninguna entrada en la tabla de usage
    #En este caso no se le pasa un tercer parametro a clone_element para indicar que no esta en la library
    #y que no es necesaria la entrada en usage
    unless self.lesson_plans.blank?
        new_subject.lesson_plans << clone_element(self.lesson_plans, current_user)
    end
        
    return new_subject
    
  end

end