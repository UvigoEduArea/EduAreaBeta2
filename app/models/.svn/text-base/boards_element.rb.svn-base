class BoardsElement < ActiveRecord::Base
  
  belongs_to :device, :foreign_key => "element_id"
  belongs_to :application, :foreign_key => "element_id"
  belongs_to :content, :foreign_key => "element_id"
  belongs_to :event, :foreign_key => "element_id"
  belongs_to :collaborator, :foreign_key => "element_id"
  belongs_to :resource, :foreign_key => "element_id"     
  belongs_to :activity, :foreign_key => "element_id"
  belongs_to :lesson_plan, :foreign_key => "element_id"
  belongs_to :experience, :foreign_key => "element_id"
  
  belongs_to :board, :foreign_key => "board_id"
  
end