class Element < ActiveRecord::Base
  
  has_attached_file :image, :styles => { :original => "300x300>", :medium => "200x200>", :thumb => "30x30>", :crop => "380x250#" }, :default_url => "none"
  #has_attached_file :image, :styles => { :medium => "200x200>", :thumb => "30x30>", :crop => "380x250#" }, :default_url => "none"
  validates_attachment_content_type :image, :content_type => %w(image/jpeg image/jpg image/png)
  has_many :comments 
  has_many :keywords
  
  has_many :experience_element_records, :foreign_key => "element_id"
  has_many :element_records, :through => :experience_element_records
  
  belongs_to :license, :foreign_key => "right_id"
  belongs_to :user, :foreign_key => "creator_id"
  
  has_many :matrix_creations, :foreign_key => "element_id"
  has_many :profiles, :through => :matrix_creations, :foreign_key => "user_id"
  
  has_many :matrix_views, :foreign_key => "element_id"
  has_many :profiles, :through => :matrix_views, :foreign_key => "user_id"
  
  has_many :matrix_copies, :foreign_key => "element_id"
  has_many :profiles, :through => :matrix_copies, :foreign_key => "user_id"
  
  has_many :matrix_includes, :foreign_key => "element_id"
  has_many :profiles, :through => :matrix_includes, :foreign_key => "user_id"
  
  has_many :matrix_boards, :foreign_key => "element_id"
  has_many :profiles, :through => :matrix_boards, :foreign_key => "user_id"
 
    
  ########################################################################################################
  ## CLONAR UN ELEMENTO    ##
  ########################################################################################################
  def clone_element(elements, current_user) 
    response = Array.new
    elements.each do |element|
      new_element = element.dup
      new_element.creator_id = current_user
      response << new_element
    end
    return response
  end
  
  
   def clone_data_boxes(current_user, data_boxes, element_id, session_id) 
    response = Array.new
    data_boxes.each do |data_box|
      new_data_box = data_box.dup
      new_data_box.element_id = element_id
      new_data_box.save
      response << new_data_box
    end
    return response
  end
   
   
   def clone_with_associations(current_user, params, session_id, duplicate=false)
    new_element = self.dup
    new_element.creator_id = current_user
    new_element.image = self.image
    new_element.view_count = 0
    new_element.copy_count = 0
    new_element.right_id = self.right_id
    new_element.original_license_id = self.right_id
    
    
    if ((self.updated_at.tv_sec - self.created_at.tv_sec != 0) && (self.updated_at.tv_sec - self.created_at.tv_sec != 1)) #Si las fechas son distintas el objeto que se está copiando ha sido modificado
      new_element.source_id = self.id
    else #Si las fechas son iguales el objeto no ha sido modificado: puede tratarse de un objeto nuevo o de una copia de otro
      unless self.source_id.blank? #Si tiene source_id es una copia de otro
        new_element.source_id = self.source_id
      else #si no tiene source_id, es un objeto original
        new_element.source_id = self.id
      end
    end
    
    ##############
    ##HABRÍA QUE VER COMO UTILIZAR TRADUCCIONES AQUÍ
    #########
    if duplicate 
      case self.language
      when "es", "gl" 
        unless self.title.blank?
          new_element.title = 'Copia de "' + self.title + '"'
        else
          new_element.title = 'Copia de '
        end
      else
        unless self.title.blank?
          new_element.title = 'Copy of "' + self.title + '"'
        else
          new_element.title = 'Copy of '
        end
      end
      
      new_element.save
      unless new_element.source_id.blank? #En el caso de que se trate de un duplicado, se debe añadir una entrada Copy en usages
        Usage.addUsage(current_user, new_element.source_id, 'Copy', new_element.id, session_id, 'Adopt')
      else
        Usage.addUsage(current_user, self.id, 'Copy', new_element.id, session_id, 'Adopt')
      end
    
    else
      
      new_element.save
    
    end
    
    return new_element
   end

end
