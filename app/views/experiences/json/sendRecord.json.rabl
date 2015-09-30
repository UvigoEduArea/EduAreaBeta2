object @record

attribute :title, :if => params[:type] == "title"
attribute :description, :if => params[:type] == "description"
attribute :text_content, :if => (params[:type] == "snippet" || params[:type] == "idea" || params[:type] =="positive_comment" || params[:type] == "negative_comment" || params[:type] == "free_text")
attribute :original_image, :if => params[:type] == "original_image"
attribute :blurred_image, :if => params[:type] == "blurred_image"
attribute :faces_array, :if => params[:type] == "blurred_image"
attribute :video, :if => params[:type] == "video"
attribute :video_frame_path => :video_frame , :if => params[:type] == "video"
attribute :document, :if => params[:type] == "document"