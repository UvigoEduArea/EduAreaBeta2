class Board < Element
  
  has_many :devices, :through => :boards_elements, :foreign_key => "element_id"
  has_many :applications, :through => :boards_elements, :foreign_key => "element_id"
  has_many :contents, :through => :boards_elements, :foreign_key => "element_id"
  has_many :events, :through => :boards_elements, :foreign_key => "element_id"
  has_many :collaborators, :through => :boards_elements, :foreign_key => "element_id" 
  has_many :resources, :through => :boards_elements, :foreign_key => "element_id"    
  has_many :activities, :through => :boards_elements, :foreign_key => "element_id"
  has_many :lesson_plans, :through => :boards_elements, :foreign_key => "element_id"
  has_many :experiences, :through => :boards_elements, :foreign_key => "element_id"
  
  has_many :boards_elements, :foreign_key => "board_id"
  

  
  def clone_with_associations(current_user, params, session_id, duplicate=false)
    new_board = super
     
        
    #Al copiar un board se deben copiar también todos los elementos que tenga asociados.
    unless self.boards_elements.blank?
     self.boards_elements.each do |elements|
        new_boards_elements = new_board.boards_elements.new
        new_boards_elements.element_id = elements.element_id
        new_board.boards_elements << new_boards_elements
     end
    end
    
    return new_board
    
  end
  
end