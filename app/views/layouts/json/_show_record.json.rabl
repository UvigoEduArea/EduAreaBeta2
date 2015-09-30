attribute :id, :record_type, :title, :description, :created_at, :updated_at
attribute :text_content => :text, :if => lambda{|this| this.record_type != "Video" && this.record_type != "Image" && this.record_type != "Document"}
attribute :original_image, :if => lambda{|this| this.record_type == "Image"}
attribute :blurred_image, :if => lambda{|this| this.record_type == "Image"}
attribute :faces_array, :if => lambda{|this| this.record_type == "Image"}
attribute :video, :if => lambda{|this| this.record_type == "Video"}
attribute :video_frame_path => :video_frame, :if => lambda{|this| this.record_type == "Video"}
attribute :document, :if => lambda{|this| this.record_type == "Document"}

node(:first_name){
	|record| record.experience_element_record.user.profile.first_name 
}

node(:last_name){
	|record| record.experience_element_record.user.profile.last_name 
}