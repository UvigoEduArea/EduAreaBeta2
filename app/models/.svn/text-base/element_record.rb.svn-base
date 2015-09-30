class ElementRecord < ActiveRecord::Base
  
  has_attached_file :original_image, :styles => { :medium => "500x500>", :thumb => "30x30>" }, :default_url => "/images/defaults/no_image.jpg"
  validates_attachment_content_type :original_image, :content_type => %w(image/jpeg image/jpg image/png)
  
  has_attached_file :blurred_image, :styles => { :medium => "500x500>", :thumb => "30x30>" }, :default_url => "/images/defaults/no_image.jpg"
  validates_attachment_content_type :blurred_image, :content_type => %w(image/jpeg image/jpg image/png)
  
  has_attached_file :video, :default_url => "/images/defaults/no_image.jpg"
  validates_attachment_content_type :video, :content_type => %w(video/mp4 video/ogg video/webm)
  
  has_attached_file :document, :default_url => "/images/defaults/no_image.jpg"
  validates_attachment_content_type :document, :content_type => %w(application/pdf)
  
  belongs_to :experience_element_record
end