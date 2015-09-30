class LessonPlan < Element
  
  belongs_to :experience, :foreign_key => "parent_id"
  
  has_many :devices, -> { order("position ASC") }, :foreign_key => "parent_id"
  has_many :applications, -> { order("position ASC") }, :foreign_key => "parent_id"
  has_many :contents, -> { order("position ASC") }, :foreign_key => "parent_id"
  has_many :events, -> { order("position ASC") }, :foreign_key => "parent_id"
  has_many :collaborators, -> { order("position ASC") }, :foreign_key => "parent_id"
  
  has_many :activities, -> { order("position ASC") }, :foreign_key => "parent_id"
  
  alias_attribute(:template, :lesson_plan_template)
  
  belongs_to :lesson_plan_template, :foreign_key => "template_id"
  has_many :data_boxes, :foreign_key => "element_id"
  
  has_one :technical_setting, :foreign_key => "parent_id"
  has_one :educational_setting, :foreign_key => "parent_id"
  
  has_many :boards_elements, :foreign_key => "element_id"
  has_many :boards, :through => :boards_elements, :foreign_key => "board_id"
  
  has_many :submissions, :foreign_key => "parent_id"
 
  def clone_with_associations(current_user, params, session_id, duplicate=false)
    new_lesson_plan = super
    
    #Se copian los recursos contenidos en la lesson plan pero en este caso no son clonaciones y no
    #debe incluirse ninguna entrada en la tabla de usage
    #En este caso no se le pasa un tercer parametro a clone_element para indicar que no esta en la library
    #y que no es necesaria la entrada en usage
    
    unless self.data_boxes.blank?
      new_lesson_plan.data_boxes << clone_data_boxes(current_user, self.data_boxes, new_lesson_plan.id, session_id)
    end
    
    unless self.applications.where(:removed => 0).blank?
      self.applications.where(:removed => 0).each do |application|
        
        cloned_application = application.clone_with_associations(current_user, application, session_id)
          
        unless cloned_application.source_id.blank?
          Usage.addUsage(current_user, cloned_application.source_id, 'Include', cloned_application.id, new_lesson_plan.id, session_id, 'Adopt')
        else
          # Entrarán en algún caso aquí?
          Usage.addUsage(current_user, application.id, 'Include', cloned_application.id, new_lesson_plan.id, session_id, 'Adopt')
        end
        new_lesson_plan.applications << cloned_application
      end
      
    end
    
    unless self.devices.where(:removed => 0).blank?
      self.devices.where(:removed => 0).each do |device|
        
        cloned_device = device.clone_with_associations(current_user, device, session_id)
          
        unless cloned_device.source_id.blank?
          Usage.addUsage(current_user, cloned_device.source_id, 'Include', cloned_device.id, new_lesson_plan.id, session_id, 'Adopt')
        else
          # Entrarán en algún caso aquí?
          Usage.addUsage(current_user, device.id, 'Include', cloned_device.id, new_lesson_plan.id, session_id, 'Adopt')
        end
        new_lesson_plan.devices << cloned_device
      end
    end
    
    unless self.contents.where(:removed => 0).blank?
      self.contents.where(:removed => 0).each do |content|
        
        cloned_content = content.clone_with_associations(current_user, content, session_id)
          
        unless cloned_content.source_id.blank?
          Usage.addUsage(current_user, cloned_content.source_id, 'Include', cloned_content.id, new_lesson_plan.id, session_id, 'Adopt')
        else
          # Entrarán en algún caso aquí?
          Usage.addUsage(current_user, content.id, 'Include', cloned_content.id, new_lesson_plan.id, session_id, 'Adopt')
        end
        new_lesson_plan.contents << cloned_content
      end
    end 
    
    unless self.events.where(:removed => 0).blank?
      self.events.where(:removed => 0).each do |event|
        
        cloned_event = event.clone_with_associations(current_user, event, session_id)
          
        unless cloned_event.source_id.blank?
          Usage.addUsage(current_user, cloned_event.source_id, 'Include', cloned_event.id, new_lesson_plan.id, session_id, 'Adopt')
        else
          # Entrarán en algún caso aquí?
          Usage.addUsage(current_user, event.id, 'Include', cloned_event.id, new_lesson_plan.id, session_id, 'Adopt')
        end
        new_lesson_plan.events << cloned_event
      end
    end
     
    unless self.collaborators.where(:removed => 0).blank?
      self.collaborators.where(:removed => 0).each do |collaborator|
        
        cloned_collaborator = collaborator.clone_with_associations(current_user, collaborator, session_id)
          
        unless cloned_collaborator.source_id.blank?
          Usage.addUsage(current_user, cloned_collaborator.source_id, 'Include', cloned_collaborator.id, new_lesson_plan.id, session_id, 'Adopt')
        else
          # Entrarán en algún caso aquí?
          Usage.addUsage(current_user, collaborator.id, 'Include', cloned_collaborator.id, new_lesson_plan.id, session_id, 'Adopt')
        end
        new_lesson_plan.collaborators << cloned_collaborator
      end
    end    
   
    unless self.activities.where(:removed => 0).blank?
      self.activities.where(:removed => 0).sort_by{|e| e[:position]}.each do |activity|
        new_activity = activity.clone_with_associations(current_user, activity, session_id)
        unless new_activity.source_id.blank?
          Usage.addUsage(current_user, new_activity.source_id, 'Include', new_activity.id, new_lesson_plan.id, session_id, 'Adopt')
        else
          # Entrarán en algún caso aquí?
          Usage.addUsage(current_user, activity.id, 'Include', new_activity.id, new_lesson_plan.id, session_id, 'Adopt')
        end
        new_lesson_plan.activities << new_activity
      end
    end
    
    unless self.technical_setting.blank?
      new_lesson_plan.technical_setting = self.technical_setting.clone_with_associations(current_user, nil, session_id)
      #Si no se trata de un duplicado, estamos hablando de un Include en la tabla de usages
      unless new_lesson_plan.technical_setting.source_id.blank?
        Usage.addUsage(current_user, new_lesson_plan.technical_setting.source_id, 'Include', new_lesson_plan.technical_setting.id, self.id, session_id, 'Adopt')
      else
        Usage.addUsage(current_user, self.id, 'Include', new_lesson_plan.technical_setting.id, self.id, session_id, 'Adopt')
      end
    end
    
    unless self.educational_setting.blank?
      new_lesson_plan.educational_setting = self.educational_setting.clone_with_associations(current_user, nil, session_id)
       #Si no se trata de un duplicado, estamos hablando de un Include en la tabla de usages
      unless new_lesson_plan.educational_setting.source_id.blank?
        Usage.addUsage(current_user, new_lesson_plan.educational_setting.source_id, 'Include', new_lesson_plan.educational_setting.id, self.id, session_id, 'Adopt')
      else
        Usage.addUsage(current_user, self.id, 'Include', new_lesson_plan.educational_setting.id, self.id, session_id, 'Adopt')
      end
    end
    
    unless self.submissions.where(:removed => 0).blank?
      self.submissions.where(:removed => 0).each do |submission|
        new_submission = submission.clone_with_associations(current_user, submission, session_id)
        new_lesson_plan.submissions << new_submission
      end
    end
        
    return new_lesson_plan
    
  end


end