class Event < Resource

  has_many :boards_elements, :foreign_key => "element_id"
  has_many :boards, :through => :boards_elements, :foreign_key => "board_id"

end