class ResourcesAppend < ActiveRecord::Base
  
  has_attached_file :document, :default_url => "/images/defaults/no_image.jpg"
  validates_attachment_content_type :document, :content_type => %w(image/svg+xml image/png image/gif image/jpeg application/pdf application/x-tar application/zip 
  application/pptx application/vnd.openxmlformats-officedocument.presentationml.presentation application/msword 
  application/vnd.openxmlformats-officedocument.wordprocessingml.document application/vnd.ms-office application/vnd.ms-excel 
  application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
  text/plain
  text/html text/css text/xml
  application/x-vrml model/vrml x-world/x-vrml)
  
  def clone_resources_appends(resource_id) 
    
    new_append = ResourcesAppend.new
    new_append.resource_id = resource_id
    new_append.snippet_url = self.snippet_url
    new_append.document = self.document
    new_append.type_append = self.type_append
    new_append.save
    
    return new_append
  end
  
end