class Resource < Element
  
  belongs_to :activity, :foreign_key => "parent_id"
  belongs_to :lesson_plan, :foreign_key => "parent_id" 
  
  acts_as_list :scope => [:parent_id.blank? ? "": :parent_id]
  
  has_many :boards_elements, :foreign_key => "element_id"
  has_many :boards, :through => :boards_elements, :foreign_key => "board_id"

  def clone_with_associations(current_user, params, session_id, duplicate=false)
    new_resource=super
    
    if new_resource.type == "Content"
      unless self.resources_appends.blank?
        self.resources_appends.each do |append|
          new_append = append.clone_resources_appends(new_resource.id)
          new_resource.resources_appends << new_append
        end
      end
    end
    

    return new_resource

  end
end