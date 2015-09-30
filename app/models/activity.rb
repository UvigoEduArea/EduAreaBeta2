class Activity < Element
  
  belongs_to :experience
  
  has_many :devices, -> { order("position ASC") }, :foreign_key => "parent_id"
  has_many :applications, -> { order("position ASC") }, :foreign_key => "parent_id"
  has_many :contents, -> { order("position ASC") }, :foreign_key => "parent_id"
  has_many :events, -> { order("position ASC") }, :foreign_key => "parent_id"
  has_many :collaborators, -> { order("position ASC") }, :foreign_key => "parent_id"
  
  alias_attribute(:template, :activity_template)
  
  belongs_to :activity_template, :foreign_key => "template_id"
  has_many :data_boxes, :foreign_key => "element_id"
  
  belongs_to :lesson_plan, :foreign_key => "parent_id"
  acts_as_list :scope => [:parent_id.blank? ? "": :parent_id, :type]
  
  has_one :technical_setting, :foreign_key => "parent_id"
  has_one :educational_setting, :foreign_key => "parent_id"
  has_many :boards_elements, :foreign_key => "element_id"
  has_many :boards, :through => :boards_elements, :foreign_key => "board_id"
  has_many :submissions, :foreign_key => "parent_id"
  
  def clone_with_associations(current_user, params, session_id, duplicate=false)
    new_activity = super
    #new_activity.update_column(:position, nil)
    
    #Al copiar una actividad se deben copiar también todas las data_boxes que tenga asociadas.
    unless self.data_boxes.blank?
      new_activity.data_boxes << clone_data_boxes(current_user, self.data_boxes, new_activity.id, session_id)
    end
    
    #Como ahora los recursos no estan en databoxes, hay que copiarlos por relación directa
    #Copiamos de uno en uno todos
    
    unless self.applications.where(:removed => 0).blank?
      self.applications.where(:removed => 0).each do |application|
        
        cloned_application = application.clone_with_associations(current_user, application, session_id)
          
        unless cloned_application.source_id.blank?
          Usage.addUsage(current_user, cloned_application.source_id, 'Include', cloned_application.id, new_activity.id, session_id, 'Adopt')
        else
          # Entrarán en algún caso aquí?
          Usage.addUsage(current_user, application.id, 'Include', cloned_application.id, new_activity.id, session_id, 'Adopt')
        end
        new_activity.applications << cloned_application
      end
      
    end
    
    unless self.devices.where(:removed => 0).blank?
      self.devices.where(:removed => 0).each do |device|
        
        cloned_device = device.clone_with_associations(current_user, device, session_id)
          
        unless cloned_device.source_id.blank?
          Usage.addUsage(current_user, cloned_device.source_id, 'Include', cloned_device.id, new_activity.id, session_id, 'Adopt')
        else
          # Entrarán en algún caso aquí?
          Usage.addUsage(current_user, device.id, 'Include', cloned_device.id, new_activity.id, session_id, 'Adopt')
        end
        new_activity.devices << cloned_device
      end
    end
    
    unless self.contents.where(:removed => 0).blank?
      self.contents.where(:removed => 0).each do |content|
        
        cloned_content = content.clone_with_associations(current_user, content, session_id)
          
        unless cloned_content.source_id.blank?
          Usage.addUsage(current_user, cloned_content.source_id, 'Include', cloned_content.id, new_activity.id, session_id, 'Adopt')
        else
          # Entrarán en algún caso aquí?
          Usage.addUsage(current_user, content.id, 'Include', cloned_content.id, new_activity.id, session_id, 'Adopt')
        end
        new_activity.contents << cloned_content
      end
    end 
    
    unless self.events.where(:removed => 0).blank?
      self.events.where(:removed => 0).each do |event|
        
        cloned_event = event.clone_with_associations(current_user, event, session_id)
          
        unless cloned_event.source_id.blank?
          Usage.addUsage(current_user, cloned_event.source_id, 'Include', cloned_event.id, new_activity.id, session_id, 'Adopt')
        else
          # Entrarán en algún caso aquí?
          Usage.addUsage(current_user, event.id, 'Include', cloned_event.id, new_activity.id, session_id, 'Adopt')
        end
        new_activity.events << cloned_event
      end
    end
     
    unless self.collaborators.where(:removed => 0).blank?
      self.collaborators.where(:removed => 0).each do |collaborator|
        
        cloned_collaborator = collaborator.clone_with_associations(current_user, collaborator, session_id)
          
        unless cloned_collaborator.source_id.blank?
          Usage.addUsage(current_user, cloned_collaborator.source_id, 'Include', cloned_collaborator.id, new_activity.id, session_id, 'Adopt')
        else
          # Entrarán en algún caso aquí?
          Usage.addUsage(current_user, collaborator.id, 'Include', cloned_collaborator.id, new_activity.id, session_id, 'Adopt')
        end
        new_activity.collaborators << cloned_collaborator
      end
    end
    
    unless self.technical_setting.blank?
      new_activity.technical_setting = self.technical_setting.clone_with_associations(current_user, nil, session_id)
      #Si no se trata de un duplicado, estamos hablando de un Include en la tabla de usages
      unless new_activity.technical_setting.source_id.blank?
        Usage.addUsage(current_user, new_activity.technical_setting.source_id, 'Include', new_activity.technical_setting.id, self.id, session_id, 'Adopt')
      else
        Usage.addUsage(current_user, self.id, 'Include', new_activity.technical_setting.id, self.id, session_id, 'Adopt')
      end
      
    end
    
    unless self.educational_setting.blank?
      new_activity.educational_setting = self.educational_setting.clone_with_associations(current_user, nil, session_id)
       #Si no se trata de un duplicado, estamos hablando de un Include en la tabla de usages
      unless new_activity.educational_setting.source_id.blank?
        Usage.addUsage(current_user, new_activity.educational_setting.source_id, 'Include', new_activity.educational_setting.id, self.id, session_id, 'Adopt')
      else
        Usage.addUsage(current_user, self.id, 'Include', new_activity.educational_setting.id, self.id, session_id, 'Adopt')
      end
      
    end
    
    return new_activity
    
  end

end