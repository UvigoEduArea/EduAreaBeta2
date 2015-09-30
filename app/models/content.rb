class Content < Resource

  has_many :boards_elements, :foreign_key => "element_id"
  has_many :boards, :through => :boards_elements, :foreign_key => "board_id"
  
  has_many :resources_appends, :foreign_key => "resource_id"

end