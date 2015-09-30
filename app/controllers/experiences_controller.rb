# -*- coding: utf-8 -*-
class ExperiencesController < ElementsController
  
  private
  
  def validate_experience_params
    params.permit(:creator_id, :language, :title, :image, :description)
  end
  
  def create_params(element)
    params[:language] = params[:locale]
    params[:creator_id] = current_user.id
    params[:user_id] = params[:creator_id]
    params[:title] = element.title
    params[:description] = element.description
  end
  
  public
  
  api :GET, "/:locale/experiences", "Get the index information"
  param_group :index, ElementsController
  example '[
    {
        "id": 1213
    },
    {
        "id": 1209
    },
    {
        "id": 1205
    },
    {
        "id": 1199
    },
    {
        "id": 1195
    },
    {
        "id": 1185
    },
    {
        "id": 1181
    }
]'
  description '===Description
  This function return the index of the experiences. The index is paginated, so is necessary send the param page to see more than first page. The number of experiences per page is 20'
  def a
    
  end
  
  api :GET, "/:locale/experiences/search", "Search experiences"
  param_group :search, ElementsController
  example '[
    {
        "id": 1181
    },
    {
        "id": 1185
    },
    {
        "id": 1195
    },
    {
        "id": 1199
    },
    {
        "id": 1205
    },
    {
        "id": 1209
    }
]'
  description '===Description
  This function return the index of the experiences. The index is paginated, so is necessary send the param page to see more than first page. The number of experiences per page is 20'
  def aa
    
  end
   
  api :POST, "/:locale/experiences", "Creates a new experience"
  param :element_id, Fixnum, :desc => "Id of the lesson plan with which will the user create the experiences", :required => true
  param_group :locale, ElementsController
  example "{
    'id': 1213
}"
  description "===Description
  This method creates a new Experience from a given Lesson Plan"
  formats ['json','html']
  
  def create
    exp_default = false
    if params.has_key?(:element_id) 
      element = Element.find(params[:element_id]).clone_with_associations(current_user.id, params, session.id)
    else
      
      params[:creator_id] = current_user.id
      params[:template_id] = User.find(current_user.id).profile.lesson_plan_default
      params[:controller] = "lesson_plans"
      element = params[:controller].camelize.singularize.constantize.new(validate_params_required_template)
            
      element = params[:controller].camelize.singularize.constantize.new(validate_params)
      element.right_id = current_user.profile.right_id
      element.save
      
      parent_object = Element.find(element.id)
      params[:parent_id] = element.id
      create_setting(element, "TechnicalSetting")
      create_setting(element, "EducationalSetting") 
      
      element.experience_element_records << ExperienceElementRecord.new
      create_empty_data_boxes(element, false)
      
      params[:controller] = "experiences"
      exp_default = true      
    end
    
    element.library = false
    element.private = true
    create_params(element)    
    @experience = Experience.new(validate_experience_params)
    case element.type
    when "Activity"
      @experience.activity = element
    when "LessonPlan"
      @experience.lesson_plan = element
    end
    @experience.image = element.image
    @experience.right_id = element.right_id
    @experience.state = "beingPrepared"
    @experience.save
    
    params[:element_id] = @experience.id
    @experience.lesson_plan.experience_element_records << ExperienceElementRecord.new(validate_eer_params)
    @experience.lesson_plan.submissions << element.submissions
    
    #Se crea una entrada include asociada al lessonplan sobre el q se crea la nueva experiencia
    if !exp_default
      Usage.addUsage(current_user.id, element.source_id, 'Include', element.id, @experience.id, session.id, 'Adopt')    
    end
    
    respond_with do |format|
      @object = @experience
      format.json { render "layouts/json/sendObjectId"}
      format.html {redirect_to "/" + params[:locale] + "/" + params[:controller].underscore.downcase + "/" + @object.id.to_s + "?created=true", notice: 'Element was successfully created.'}
    end
  end
  
  api :DELETE, "/:locale/experiences/:id", "Function used to remove an element"
  param_group :destroy, ElementsController
  formats ['json', 'html']
  description "===Description
  This function deletes an element. It responses with HTTP 200 OK if everything is OK"
  def aaa
    
  end
  
  api :PATCH, "/:locale/experiences/:id", "Updates the records of the experience"
  param :id, Fixnum, :desc => "Id of the Experience to be updated", :required => true
  param_group :locale, ElementsController
  param :record_id, Fixnum, :desc => "Id of the record to be updated", :required => true
  param :type, Fixnum, :desc => "Type of the record to be updated", :required => false, :meta => ["title", "description", "snippet", "text_content", "positive_comment", "negative_comment", "free_text", "idea", "image", "video", "document"]
  param :content, String, :desc => "Content of the record", :required => false, :meta => ["text", "images - jpeg, png, jpg", "videos - mp4, ogg, webm", "documents - PDF"]
  example "updating an image:
  {
    'image': '/system/element_records/images/000/000/139/original/admin.png?1416415931'
  }"
  description "===Description
  This method updated the records of a Experience. Records are all the reflections and evidences the user can upload. The function returns the record updated"
  formats ['json','http']
  
  def update
    @record = ElementRecord.find(params[:record_id])
    case params[:type]
    when "title"
      @record.title = params[:content]
    when "description"
      @record.description = params[:content]
    when "snippet", "text_content", "positive_comment", "negative_comment","free_text", "idea"
      @record.text_content = params[:content]
    when "original_image"
      @record.original_image = params[:content]
      @record.blurred_image = nil
      @record.faces_array = nil
    when "blurred_image"
      @record.blurred_image = params[:content]
      @record.faces_array = params[:faces_array]
    when "video"
      @record.video = params[:content]
      @record.save
      movie = FFMPEG::Movie.new(@record.video.path)
      video_name = @record.video_file_name.split(".")[0]
      thumb_path = @record.video.path.gsub(@record.video_file_name, video_name+".jpg")
      movie.screenshot(thumb_path, seek_time: 2)
      @record.video_frame_path = thumb_path.gsub(Rails.root.to_s+"/public", "")
    when "document"
      @record.document = params[:content]
    end
    
    experience = Element.find(params[:id])
    if ((experience.updated_at.tv_sec - experience.created_at.tv_sec == 0) || (experience.updated_at.tv_sec - experience.created_at.tv_sec == 1)) 
      Usage.changeStatus(current_user.id, experience.source_id, experience.parent_id, experience.id, session.id)
    end
    
    ReloadElementFields.reload_updated_at(experience)
    
    @record.save
    respond_with do |format|
      format.html{ render :partial => "/experiences/html/record_content", :object => @record, :as => :records, :locals => {:created => true}}
      format.json{ render "/experiences/json/sendRecord" }
=begin      case params[:type]
      when "Snippet", "Image", "Video", "Document"
        
      when "Idea", "PositiveComment", "NegativeComment", "FreeText"
        format.html {render }
      end
=end      
    end
  end
  
  api :POST, "/:locale/experiences/duplicate", "This method duplicates the element"
  param_group :duplicate, ElementsController
  formats ['json', 'html']
  example '{
    "id": 1214
}'
  description '===Description
  This method duplicated the element into new one. The new element will belongs to the current user'
  def aaaa
    
  end
  
  api :GET, "/:locale/experiences/:id/mini", "Mini View"
  param_group :view, ElementsController
  formats ['json']
  example 'url => /es/experiences/1185,1213/mini
  [
    {
        "id": 1185,
        "title": "hola",
        "private": true,
        "abstract": true,
        "image": "/system/experiences/images/000/001/185/original/jesus-wepting.jpg?1416569981"
    },
    {
        "id": 1213,
        "title": "",
        "private": true,
        "abstract": true,
        "image": "none"
    }
]'
  description '===Description
  This method returns the mini view of a element.'
  def mini
    
  end
  
  api :GET, "/:locale/experiences/:id/small", "Small View"
  param_group :view, ElementsController
  formats ['json']
  example 'url => /es/experiences/1185,1213/small
  [
    {
        "id": 1185,
        "title": "hola",
        "private": true,
        "abstract": true,
        "image": "/system/experiences/images/000/001/185/original/jesus-wepting.jpg?1416569981",
        "description": ""
    },
    {
        "id": 1213,
        "title": "",
        "private": true,
        "abstract": true,
        "image": "none",
        "description": ""
    }
]'
  description '===Description
  This method returns the small view of an element.'
  def small
    
  end
  
  api :GET, "/:locale/experiences/:id", "Whole View"
  param_group :view, ElementsController
  formats ['json', 'html']
  example '[
    {
        "id": 1320,
        "title": "Copia de \"Lesson Plan 1\"",
        "private": true,
        "abstract": true,
        "image": "none",
        "description": "",
        "lesson_plan": 1321,
        "template": {
            "id": 715,
            "boxes": [
                {
                    "id": 9,
                    "title": "",
                    "description": "",
                    "position": "left",
                    "type": "BEI",
                    "data_type": "resources",
                    "data_boxes": []
                },
                {
                    "id": 10,
                    "title": "",
                    "description": "",
                    "position": "left",
                    "type": "BT",
                    "data_type": "",
                    "data_boxes": []
                }
            ]
        },
        "activities": [
            {
                "id": 1324,
                "parent_id": 1321
            },
            {
                "id": 1323,
                "parent_id": 1321
            },
            {
                "id": 1322,
                "parent_id": 1321
            }
        ]
    }
]'
  description '===Description
  This method return de whole view of an element. The parent_id of the activities makes reference to the element that contains them.'
  def whole
    
  end
  
  api :GET, "/:locale/experiences/:id/getComments", "Get Comments"
  param_group :getComments, ElementsController
  formats ['json', 'html']
  description '===Description
  This method returns the comments from the element.'
  def gtCmmnts
    
  end
  
  api :POST, "/:locale/experiences/:id/setComments", "Set Comments"
  param_group :setComments, ElementsController
  formats ['json', 'html']
  description '===Description
  This method returns the comments from the element in wich will be added the new comment.'
  def stCmmnts
    
  end
  
  def shareExperience
    user_ids = params[:user_ids].split(",")
    user_ids.each do |user_id|
      shared_experience = SharedExperience.where(:user_id => user_id).first 
      unless shared_experience.blank?
        shared_experience.editable = params[:editable]
        shared_experience.save
        
      else
        shex = SharedExperience.new
        shex.user_id = user_id
        shex.experience_id = params[:id]
        shex.editable = params[:editable]
        shex.save        
      end
    end
    
    respond_with do |format|
      format.json {render json: user_ids}
    end
  end
  
  
  
  def getCodeToShare
    
    exist_element = ExperienceCode.where("experience_id='"+params[:id]+"'").first()
    
    if exist_element.blank?
      code_to_share = SecureRandom.random_bytes(3).each_byte.map { |b| b.to_s(16) }.join
      exist_code =  ExperienceCode.where("code='"+code_to_share+"'").first()
      while !exist_code.blank?
        code_to_share = SecureRandom.random_bytes(3).each_byte.map { |b| b.to_s(16) }.join
        exist_code =  ExperienceCode.where("code='"+code_to_share+"'").first()
      end
      exp_code = ExperienceCode.new
      exp_code.experience_id = params[:id]
      exp_code.code = code_to_share
      exp_code.save 
    else
      code_to_share = exist_element.code
    end
   
    respond_with do |format|
      format.json{ render json: {:code_to_share => code_to_share}}
    end
  end
  
  
  
  def useCode
    
    exp_code = ExperienceCode.where("code='"+params[:enter_code]+"'").first()
    
    unless exp_code.blank?
      share_relation = ExperienceElementRecord.where("user_id="+current_user.id.to_s+" and element_id="+exp_code.experience_id.to_s)
      if share_relation.blank?
        share_relation = ExperienceElementRecord.new
        share_relation.element_id = exp_code.experience_id
        share_relation.user_id = current_user.id
        share_relation.save
      end
      
      respond_with do |format|
        format.json{ render json: {:shared => exp_code.experience_id}}
      end
    
    else
      respond_with do |format|
        format.json{ render json: {:shared => nil}}
      end
    end
    
  end
  
end
