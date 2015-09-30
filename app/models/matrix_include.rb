class MatrixInclude < ActiveRecord::Base
  
  belongs_to :element, :foreign_key => "element_id"
  
  belongs_to :profile, :foreign_key => "user_id"
  
end