module ReloadElementFields
  
  def self.reload_updated_at(element)
    element.updated_at = Time.now
    element.save

    unless element.parent_id.blank?
      element_parent = Element.find(element.parent_id)
      element_parent.updated_at = Time.now
      element_parent.save
      unless element_parent.parent_id.blank?
        element_grandparent = Element.find(element_parent.parent_id)
        element_grandparent.updated_at = Time.now
        element_grandparent.save
        unless element_grandparent.parent_id.blank?
          element_grand = Element.find(element_grandparent.parent_id)
          element_grand.updated_at = Time.now
          element_grand.save
        end
      end
    end

    return
  end
  
end