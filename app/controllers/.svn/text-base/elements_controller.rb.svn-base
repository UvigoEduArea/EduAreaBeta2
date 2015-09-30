# -*- coding: utf-8 -*-
class ElementsController < ApplicationController
  include WorkingWithBoxes
  include ReputationAndRelevance
  include KeywordsClass
  include ActionView::Helpers::SanitizeHelper
  include Filter
  
  private
  
  #########################################################
  ##               VALIDACION DE PARAMETROS              ##
  #########################################################
  def validate_resources_appends_params
    add_to_params
    params.permit(:resource_id, :documet, :snippet_url)  
  end
  
  def validate_setting_params
    add_to_params
    params.permit(:parent_id, :title, :image, :description, :removed, :language, :creator_id, :library, :right_id, :license_id)
  end
  
  def validate_eer_params
    params.permit(:element_id, :user_id)
  end
  
  def validate_params
    add_to_params
    params.permit(:parent_id, :title, :URL, :URI, :image, :description, :private, :removed, :language, :creator_id, :library, :abstract, :relevance, :template_id, :right_id, :license_id)
  end
  
  def validate_params_required_template
    add_to_params
    params.permit(:parent_id, :title, :URL, :URI, :image, :description, :private, :removed, :language, :creator_id, :library, :abstract, :relevance, :template_id, :right_id, :license_id)
  end
  
  def add_to_params
    params[:language] = params[:locale]
  end
  
  before_action :add_to_params, only: [:create]
  
  def actualize_time
    self.updated_at=Time.now
    self.save 
  end
  
  def self.asign_settings
    activities = Activity.where("removed = false")
    lessonplans = LessonPlan.where("removed = false")
    elements = Array.new
    elements.push(activities)
    elements.push(lessonplans)
    p elements
    elements.each do |element|
      element.each do |x|
        if x.educational_setting == nil
          x.educational_setting = EducationalSetting.new
          x.educational_setting.save
        end
        
        if x.technical_setting == nil
          x.technical_setting = TechnicalSetting.new
          x.technical_setting.save
        end
      end
    end
  end
  
  def self.experiences_privates
    Experience.all.each do |e|
      e.private = true
      e.save
    end
  end
  
  def self.reprocess_images
    Vocabulary.all.each do |v|
      v.image = nil
      v.save
    end
    Element.where("removed = 0 and type <> 'Vocabulary' and type <> 'TechnicalSetting' and type <> 'EducationalSetting'").each do |e|
      begin
          e.image.reprocess!
      rescue
        unless e.image.nil?
          e.image = nil
          e.save
        end
      end
    end
  end
  
  def self.delete_BEI
    bei_boxes = Box.where("box_type='BEI'")
    unless bei_boxes.blank?
      bei_boxes.each do |bei|
        data_boxes= DataBox.where("box_id='"+bei.id.to_s+"'")
        unless data_boxes.blank?
          data_boxes.each do |db|
            db.destroy
          end
        end
        bei.destroy
      end
    end
  end
  
  def self.asign_beingPrepared
     exp = Experience.where(:removed => false)
     exp.each do |experience|
       experience.state = "beingPrepared"
       experience.save
     end
  end
  
  def valid_email?(email)
    valid_email_regex = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
    email.present? && (email =~ valid_email_regex)
  end
  
  public
  
  def_param_group :locale do
    param :locale, String, :desc => "Language of the information", :required => true, :meta => ["es","gl","en","pt"]
  end
  
  def_param_group :index do
    param_group :locale, ElementsController
    param :page, Fixnum, :desc => "Number of the page the user wants to view", :required => false
  end
  
  def_param_group :create do
    param_group :locale, ElementsController
    param :template_id, Fixnum, :desc => "Id of the template that will be used in the Activity or LessonPlan", :required => true, :meta => {"Used on" => ["Activity", "LessonPlan"]}
  end
  
  def_param_group :search do
    param_group :locale, ElementsController
    param :page, Fixnum, :desc => "Number of the page the user wants to view", :required => false
    param :owner, [true, false], :desc => "Specific if the results are only from the owner", :required => false
    param :search, String, :desc => "The phrase to search in the experiences", :required => true
  end
  
  def_param_group :destroy do
    param_group :locale, ElementsController
    param :id, Fixnum, :desc => "Id of the element to destroy", :required => true
  end
  
  def_param_group :duplicate do
    param_group :locale, ElementsController
    param :id, Fixnum, :desc => "Id of the element to be duplicated", :required => true
  end
  
  def_param_group :view do
    param_group :locale, ElementsController
    param :id, Fixnum, :desc => "Id of the element to get the view. The id parameter can be various values, separated by commas and without spaces", :required => true
  end
  
  def_param_group :addToLibrary do
    param_group :locale, ElementsController
    param :id, Fixnum, :desc => "Id of the element to add to the library", :required => true
  end
  
  def_param_group :addElement do
    param_group :locale, ElementsController
    param :id, Fixnum, :desc => "id of the element to which another element will be added", :required => true
    param :type, String, :desc => "Type of the element that is being added", :required => true, :meta => {"Lesson Plan adding" => ["technical_setting", "educational_setting", "activity"], "Activities adding" => ["technical_setting", "educational_setting"]}
    param :element_id, Fixnum, :desc => "Id of the element to be added", :required => true
    param :new_element, [true, false], :desc => "Used to specify if is a new element. New element means that user is creating it from 0", :required => true, :meta => {"Used in" => ["Lesson Plans adding" => ["Activities", "Technical Settings", "Educational Settings"], "Activities adding" => ["Technical Setting", "Educational Setting"] ]}
    param :delete_old, [true, false], :desc => "Param used to specify if the older element will be removed", :required => true, :meta => {"Used adding" => ["Technical Setting", "Educational Setting"]}
  end
  
  def_param_group :getRecords do
    param_group :locale, ElementsController
    param :id,Fixnum, :desc => "Id of the element which have records", :required => true
  end
  
  def_param_group :addRecords do
    param_group :locale, ElementsController
    param :id, Fixnum, :desc => "Id of the element in wich will be added the records", :required => true
    param :type, String, :desc => "Specifies the type of the record to be added", :required => true, :meta => {"type" => ["image", "video", "document", "snippet","positive_comment","negative_comment","free_text","idea"]}
  end
  
  def_param_group :deleteRecord do
    param_group :locale, ElementsController
    param :id, Fixnum, :desc => "Id of the element in wich will be removed the record", :required => true
    param :record_id, Fixnum, :desc => "Id of the record to be updated", :required => true
  end
  
  def_param_group :getInfo do
    param_group :locale, ElementsController
    param :id, Fixnum, :desc => "Id of the element to get information", :required => true
  end
  
  def_param_group :getComments do
    param_group :locale, ElementsController
    param :id,Fixnum, :desc => "Id of the element which have comments", :required => true
  end
  
  def_param_group :setComments do
    param_group :locale, ElementsController
    param :id, Fixnum, :desc => "Id of the element in wich will be added the comment", :required => true
    param :description, String, :desc => "Specifies the description/comment to be added", :required => true
  end
  
  def_param_group :filter do
    param_group :locale, ElementsController
  end
  
  def_param_group :shareByEmail do
    param_group :locale, ElementsController
  end
  
  def getChannel
    channel = '/'+ Digest::MD5.hexdigest(request.session_options[:id]).to_s
 
    respond_with do |format|
      format.json{ render json: {:channel => channel}} 
    end
  end
  
  def index
    
    if params[:controller] == "resources"
      modifier = "type = 'Application' or type = 'Device' or type = 'Content' or type = 'Event' or type = 'Collaborator'"
    end
    
    if params[:controller] == "templates"
      modifier = "type = 'ActivityTemplate' OR type = 'LessonPlanTemplate' OR type = 'Template'"  
    end  
      
    if user_signed_in?      #SI EL USUARIO ESTÁ LOGUEADO
      if params[:controller] == "resources" || (params[:controller] == "templates") #SI EL USUARIO ESTÁ PIDIENDO LOS RECURSOS, BUSCAMOS POR EL MODELO ELEMENT    
        if (params[:owner] != true) && (params[:owner] != "true")
          @elements = Element.where("("+modifier+")and (removed = false and library = true) and (private = false or (private = true and creator_id = "+current_user.id.to_s+"))").order("updated_at DESC").page(params[:page]).per(20)           
        else
          @elements = Element.where("("+modifier+")and (removed = false and library = true) and (creator_id = "+current_user.id.to_s+")").order("updated_at DESC").page(params[:page]).per(20)
        end
      else #SI NO BUSCAMOS POR EL MODELO CORRESPONDIENTE
        case params[:controller]
        when "experiences"
          if params[:state] == "all" || params[:state] == nil
            @elements = params[:controller].singularize.camelize.constantize.where("(removed = false and library = true) and 
            (creator_id = "+current_user.id.to_s+" or id in (select element_id from experience_element_records where user_id='"+current_user.id.to_s+"'))").order("updated_at DESC").page(params[:page]).per(20)
          else
            @elements = params[:controller].singularize.camelize.constantize.where("(removed = false and library = true) and 
            (creator_id = "+current_user.id.to_s+" or id in (select element_id from experience_element_records where user_id='"+current_user.id.to_s+"')) 
            and (state = '"+ (params.has_key?(:state) ? params[:state] : "") +"')").order("updated_at DESC").page(params[:page]).per(20)
          end
        when "boards"
           if (params.has_key?(:popup) && params[:popup] == "true")
             @elements = params[:controller].singularize.camelize.constantize.where("(removed = false and library = true) and (creator_id = "+current_user.id.to_s+")").order("updated_at DESC").page(params[:page]).per(20)
           else
             if params[:owner] != "true"
               @elements = params[:controller].singularize.camelize.constantize.where("(removed = false and library = true) and (private = false or (private = true and creator_id = "+current_user.id.to_s+"))").order("updated_at DESC").page(params[:page]).per(20)
             else
               @elements = params[:controller].singularize.camelize.constantize.where("(removed = false and library = true) and (creator_id = "+current_user.id.to_s+")").order("updated_at DESC").page(params[:page]).per(20)
             end
           end
        when "technical_settings"
          @elements = params[:controller].singularize.camelize.constantize.where("(removed = false and library = true) and (private = false or (private = true and creator_id = "+current_user.id.to_s+"))").order("updated_at DESC").page(params[:page]).per(20)
        when "activity_templates"
           @elements = params[:controller].singularize.camelize.constantize.where("(removed = false and library = true) and (private = false or (private = true and creator_id = "+current_user.id.to_s+"))").order("id="+current_user.profile.activity_default.to_s+" desc, updated_at DESC").page(params[:page]).per(20)
        when "lesson_plan_templates"
           @elements = params[:controller].singularize.camelize.constantize.where("(removed = false and library = true) and (private = false or (private = true and creator_id = "+current_user.id.to_s+"))").order("id="+current_user.profile.lesson_plan_default.to_s+" desc, updated_at DESC").page(params[:page]).per(20)
        else
          if params[:owner] != "true" && (!(params.has_key?(:use_element) && params[:use_element] == "true"))
            @elements = params[:controller].singularize.camelize.constantize.where("(removed = false and library = true) and (private = false or (private = true and creator_id = "+current_user.id.to_s+"))").order("updated_at DESC").page(params[:page]).per(20)
          else
            @elements = params[:controller].singularize.camelize.constantize.where("(removed = false and library = true) and (creator_id = "+current_user.id.to_s+")").order("updated_at DESC").page(params[:page]).per(20)
          end              
        end
      end
    else #EL USUARIO NO ESTÁ LOGUEADO, ENTONCES...
      if params[:controller] == "resources" #SI PIDE RECURSOS
        @elements = Element.where("("+modifier+") and (removed = false and library = true) and (private = false)").order("updated_at DESC").page(params[:page]).per(20)
      else #NO PIDE RECURSOS, SE BUSCA POR EL MODELO CORRESPONDIENTE. LAS EXPERIENCIAS SON SOLO DE LOS USUARIOS, NO SE MUESTRAN A NADIE MAS
        @elements = params[:controller].singularize.camelize.constantize.where("(removed = false and library = true) and (private = false) and type <> 'Experience'").order("updated_at DESC").page(params[:page]).per(20)
      end
    end
    
    respond_with do |format|
      if (params.has_key?(:popup) && params[:popup] != "true")
        EM.run{
          EM.add_timer(1){
          unless @elements.blank?
            @elements.each do |element|
              unless element.id.blank?
                 number_copies = reload_count_number("copy", element)
                 number_views = reload_count_number("view", element)
                 element.update_column(:copy_count, number_copies)
                 element.update_column(:view_count, number_views)
               end
            end
          end
          }
        }  
      end
       
      @object = @elements
      
      if params.has_key?(:popup) && params[:popup] == "true" 
        format.html { render :partial => "/layouts/html/index_popup", :layout => "/layouts/html/popup", :locals => {:resource => params[:controller], :use_element => (params.has_key?(:use_element) && params[:use_element] == "true") ? true : false}}
      else
        format.html { render params[:controller].underscore.downcase+"/html/index"}
      end
      
      format.json { render "/layouts/json/sendObjectId"}
    end
  end
  
  def search
    if user_signed_in?
      if params[:controller] == "resources"
        resource = true
        resources = "type = 'Application' or type = 'Device' or type = 'Content' or type = 'Event' or type = 'Collaborator'"
        if (params[:owner] != "true")
          @elements = Element.where("("+resources+") and (removed = false and library = true) and (private = false or (private = true and creator_id = "+current_user.id.to_s+")) and (title like '%"+params[:search]+"%' or description like '%"+params[:search]+"%')").page(params[:page])
        else
          @elements = Element.where("("+resources+") and (removed = false and library = true) and (creator_id = "+current_user.id.to_s+") and (title like '%"+params[:search]+"%' or description like '%"+params[:search]+"%')").page(params[:page])
        end
      else
        resource = false
        if (params[:owner] != "true")
          @elements = params[:controller].singularize.camelize.constantize.where("(removed = false and library = true) and (private = false or (private = true and creator_id = "+current_user.id.to_s+")) and (title like '%"+params[:search]+"%' or description like '%"+params[:search]+"%')").page(params[:page])
        else
          @elements = params[:controller].singularize.camelize.constantize.where("(removed = false and library = true) and (creator_id = "+current_user.id.to_s+") and (title like '%"+params[:search]+"%' or description like '%"+params[:search]+"%')").page(params[:page])
        end
      end
    else
      if params[:controller] == "resources"
        resource = true
        resources = "type = 'Application' or type = 'Device' or type = 'Content' or type = 'Event' or type = 'Collaborator'"
        @elements = Element.where("("+resources+") and (removed = false and library = true) and (private = false) and (title like '%"+params[:search]+"%' or description like '%"+params[:search]+"%')").page(params[:page])
      else
        resource = false
        @elements = params[:controller].singularize.camelize.constantize.where("(removed = false and library = true) and (private = false) and (title like '%"+params[:search]+"%' or description like '%"+params[:search]+"%')").page(params[:page])
      end
    end
    
    respond_with do |format|
      @object = @elements
      
      if params.has_key?(:popup) && params[:popup] == "true" 
        format.html { render :partial => "/layouts/html/index_popup", :layout => "/layouts/html/popup", :locals => {:resource => params[:controller]}}
      else
        format.html { render :partial => "layouts/html/record_cards", :collection => @elements, :locals => {:resource => resource}}
      end
      
      format.json { render "/layouts/json/sendObjectId"}
    end
  end
  
  ########################################################################################################
  ## CREA UN NUEVO ELEMENTO. SI SE TRATA DE UNA ACTIVITY Y TIENE TEMPLATE HAY QUE TENERLO EN CUENTA     ##
  ########################################################################################################
  def create
    params[:creator_id] = current_user.id
    if params[:controller] == "activities" || params[:controller] == "lesson_plans"
      params[:template_id] = params[:element_id]
      @element = params[:controller].camelize.singularize.constantize.new(validate_params_required_template)
    end
    
    @element = params[:controller].camelize.singularize.constantize.new(validate_params)
    if @element.type == "Content" || @element.type == "Activity" || @element.type == "LessonPlan"
        @element.right_id = current_user.profile.right_id
        #@element.original_license_id = current_user.profile.right_id
    end
    @element.save
    if params[:controller] == "activities" || params[:controller] == "lesson_plans"
      parent_object = Element.find(@element.id)
      params[:parent_id] = @element.id
      create_setting(@element, "TechnicalSetting")
      create_setting(@element, "EducationalSetting") 
    end
    
    if params[:controller] == "Experiences"
      @element.lesson_plan.experience_element_records << ExperienceElementRecord.new
    end
    create_empty_data_boxes(@element, false)
    respond_with do |format|
      @object = @element
      format.json { render "layouts/json/sendObjectId"}
      format.html {redirect_to "/" + params[:locale] + "/" + params[:controller].underscore.downcase + "/" + @object.id.to_s + "?created=true", notice: 'Element was successfully created.'}
    end
  end  
  
  
  ########################################################################################################
  ## ELIMINA UN ELEMENTO    ##
  ########################################################################################################
  def destroy
    params[:id].split(",").each do |element_id|
      element = Element.find(element_id)
      element.removed = true
      element.save
     
      #Se actualiza la fecha de updated_at del elemento que se está eliminando y de todos sus padres.
      ReloadElementFields.reload_updated_at(element) 
    
      if (element.position != nil)
        element.position = nil
      end
      
      if params[:controller] == "experiences"
        se = SharedExperience.where(:experience_id => params[:id]).first
        unless se.blank?
          se.destroy
        end
      end
    
      @li_activities = Hash.new
      @valid_template = false
      if (element.type == "Activity") && (element.parent_id != nil) #En el caso de eliminar una actividad incluida en un lesson plan, hay que chequear los templates
        positions = Array.new
        parent_object = Element.find(element.parent_id)
        collection = parent_object.activities.where(:removed => false).sort_by{|e| e[:position]}
        unless collection.blank?
          template_id = collection[0].template_id
          collection.each do |activity|
            positions.push(activity)
            unless activity.title.blank?
              @li_activities[activity.id]=positions.length.to_s+". "+activity.title
            else
              @li_activities[activity.id]=positions.length.to_s+". "+t("activity")
            end
            if(activity.template_id != template_id && template_id != 0)
              template_id = 0 #Cuando el template_id es 0, quiere decir que las actividades tienen diferentes templates, y no se puede usar la table_view
            end
          end
        else
          template_id = 0
        end
   
        if template_id != 0 #Se puede añadir, pq coinciden los templates
          @valid_template = true
        end
      end
                      
    
      if (element.type == "Content") || (element.type == "Activity")
        values = create_vector_licenses(element)
        @vector = values[0]
        bandera = values[1]
      end
    end
   
    @object = params[:controller].camelize.singularize.constantize.all
    respond_with do |format|
      format.json { render :json => {licenses: @vector, valid_template: @valid_template, li_activities: @li_activities}}
      format.html {redirect_to "/" + params[:locale] + "/" + params[:controller].underscore.downcase, :status => 301 }
      #format.html {redirect_to :action => 'index', :status => 100}
    end
  end
  
  
  ########################################################################################################
  ## SE CREA UN DUPLICADO DE UN ELEMENTO, ES DECIR, UN CLON     ##
  ########################################################################################################
  #param -> id -> Id del Element a duplicar
  def duplicate
    element = Element.find(params[:id]) #RECOJO EL ELEMENTO DESDE SU PROPIO MODELO (ACTIVITY, APP, ETC)
    @object = element.clone_with_associations(current_user.id, params, session.id, true) #LLAMO AL METODO PROPIO EN CADA MODELO, YA QUE CADA UNO PUEDE TENER RELACIONES DIFERENTES
    respond_with do |format|
      format.json { render "layouts/json/sendObjectId"}
      format.html {redirect_to "/" + params[:locale] + "/" + params[:controller].underscore.downcase + "/" + @object.id.to_s, notice: 'Element was successfully created.'}
    end
    
  end
  
  #####################################################
  # getView se encuentra en application_controller.rb #
  #####################################################
  def getMiniView
    @elements = getView(params[:controller].camelize.singularize.constantize, params[:id])
    
    respond_with do |format|
      format.json {render "layouts/json/miniView"}
    end
  end
  
  def getSmallView
    @elements = getView(params[:controller].camelize.singularize.constantize, params[:id])
    
    respond_with do |format|
      format.json {render "layouts/json/smallView"}
    end
  end
  
  def getFullView
    @elements = getView(params[:controller].camelize.singularize.constantize, params[:id])
    
    respond_with do |format|
      format.json {render "layouts/json/fullView"}
    end
  end
  
  def getWholeView
    
    no_editable = false
    
    if params[:controller] == "resources" or params[:controller] == "submissions"
      @elements = getView(params[:controller], params[:id])
      @element = @elements.first
  
    else
      @elements = getView(params[:controller].camelize.singularize.constantize, params[:id])
      @element = @elements.first
   
    
      #CUANDO TODO TENGA EL MISMO FORMATO, ELIMINAR ESTA PARTE
      
      if user_signed_in?
        user_id = current_user.id
      else 
        user_id = 0
      end
     
      params[:id].split(",").each do |id|
        Usage.addUsage(user_id, id, 'View', id, session.id, 'View')  
      end
     
      create_empty_data_boxes(@element, true)
      
      case params[:controller]
        when 'lesson_plans'
          unless @element.activities.blank?
            @element.activities.each do |activity|
               create_empty_data_boxes(activity, true)
            end
          end
        when 'boards'
          unless @element.boards_elements.blank?
            boards_elements = Array.new
            @element.boards_elements.each do |elements|
              boards_elements.insert(0,Element.where("(id = '"+elements.element_id.to_s+"')").first) 
            end
          end
      end
      
      values = create_vector_licenses(@element)
      vector = values[0]
      bandera = values[1]
      
      
      if params[:controller] == "activity_templates" || params[:controller] == "lesson_plan_templates"
        params[:controller] = "templates"
      end
      
      @license = @element.license
      
      if (@element.type == "Activity") || (@element.type == "LessonPlan") || (@element.type == "Content")
        if (@element.source_id != nil)
          if ((@element.right_id == 5) || (@element.right_id == 6)) && (Element.find(@element.source_id).creator_id != @element.creator_id)
            no_editable = true
          end
        end
      end
      
      if  (@element.type == "Experience") && (@element.lesson_plan.source_id != nil)
        if ((@element.lesson_plan.right_id == 5) || (@element.lesson_plan.right_id == 6)) && (Element.find(@element.lesson_plan.source_id).creator_id != @element.lesson_plan.creator_id)
          no_editable = true
        end
      end
      
      hash_attribution = prepare_hash_attributions(@element)
      
    end
    
    respond_with do |format|  
      if params[:controller] == "activity_templates" || params[:controller] == "lesson_plan_templates" || params[:controller] == "templates"
        format.json {render "/layouts/json/viewTemplates"}
        format.html {render params[:controller].underscore.downcase+"/html/show", :object => @element, :as => "form", :locals => {:attributions => hash_attribution, :vector_licenses => vector, :created => (params[:created] == "true" || (!current_user.blank? && @element.creator_id == current_user.id)) && (no_editable == false) ? true:false, :boards_elements => params[:controller] == "boards" ? boards_elements:nil}}
      else
        if params.has_key?(:popup) && params[:popup] == "true"
          if params.has_key?(:back) && params[:back] != "false"
            if @element.type == "Experience" || @element.type == "LessonPlan" || @element.type =="Activity"
              if bandera == false
                format.html { render :partial => "/layouts/html/show_popup", :layout => "/layouts/html/popup", :locals => {:attributions => hash_attribution, :vector_licenses => vector, :resource => params[:controller], :popup => true, :back => params[:back], :created => false}}
              else
                format.html { render :partial => "/layouts/html/show_popup", :layout => "/layouts/html/popup", :locals => {:attributions => hash_attribution, :vector_licenses => vector, :resource => params[:controller], :popup => true, :back => params[:back], :created => false}}
              end
            else
              if @element.type == "Content"
                format.html { render :partial => "/layouts/html/show_popup", :layout => "/layouts/html/popup", :locals => {:attributions => hash_attribution, :resource => params[:controller], :popup => true, :back => params[:back], :created => false}}
              else
                format.html { render :partial => "/layouts/html/show_popup", :layout => "/layouts/html/popup", :locals => {:resource => params[:controller], :popup => true, :back => params[:back], :created => false}}
              end
            end
          else
            if @element.type == "Experience" || @element.type == "LessonPlan" || @element.type =="Activity"
              if bandera == false
                format.html { render :partial => "/layouts/html/show_popup", :layout => "/layouts/html/popup", :locals => {:attributions => hash_attribution, :vector_licenses => vector, :resource => params[:controller], :popup => true, :created => false}}
              else
                format.html { render :partial => "/layouts/html/show_popup", :layout => "/layouts/html/popup", :locals => {:attributions => hash_attribution, :vector_licenses => vector, :resource => params[:controller], :popup => true, :created => false}}
              end
            else
              if @element.type == "Content"
                format.html { render :partial => "/layouts/html/show_popup", :layout => "/layouts/html/popup", :locals => {:attributions => hash_attribution, :resource => params[:controller], :popup => true, :back => params[:back], :created => false}}
              else
                format.html { render :partial => "/layouts/html/show_popup", :layout => "/layouts/html/popup", :locals => {:resource => params[:controller], :popup => true, :back => params[:back], :created => false}}
              end
            end
          end
        else #No estoy en ningún popup
          
          if params.has_key?(:edition_active)
            if params[:edition_active] == "false"
              edition_active = false
            else
              edition_active = true
            end
          else
            edition_active = true
          end
          
          
          if bandera == false
            p "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
            p "Bandera es false"
            if (@element.type == "Activity" && (!@element.parent_id.blank? && !Element.find(@element.parent_id).parent_id.blank?))
              experience = true
            else
              experience = false
            end
            p experience
            p "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
            format.html {render params[:controller].underscore.downcase+"/html/show",
              :object => @element, :as => "form", 
              :locals => {:attributions => hash_attribution, :vector_licenses => vector, 
              :created => (params[:created] == "true" || @editable_experience || (!current_user.blank? && @element.creator_id == current_user.id && edition_active)) && (no_editable == false) ? true:false, 
              :boards_elements => params[:controller] == "boards" ? boards_elements:nil, 
              :contents => params.has_key?(:contents) && params[:contents] == "true" ? true : false,
              :element_parent => params.has_key?(:parent_id) ? Element.find(params[:parent_id]) : @element,
              :experience => (@element.type == "Activity" && (!@element.parent_id.blank? && !Element.find(@element.parent_id).parent_id.blank?)) ? true : false}}
            format.json {render "/layouts/json/wholeView"}
          else
            p "Bandera es true!!!!!!!!!!"
            format.html {render params[:controller].underscore.downcase+"/html/show", 
              :object => @element, :as => "form",
              :locals => {:attributions => hash_attribution, :vector_licenses => vector, 
              :created => (params[:created] == "true" || @editable_experience || (!current_user.blank? && @element.creator_id == current_user.id && edition_active)) && (no_editable == false) ? true:false, 
              :boards_elements => params[:controller] == "boards" ? boards_elements:nil, 
              :contents => params.has_key?(:contents) && params[:contents] == "true" ? true : false,
              :element_parent => params.has_key?(:parent_id) ? Element.find(params[:parent_id]) : nil,
              :experience => (@element.type == "Activity" && (!@element.parent_id.blank? && !Element.find(@element.parent_id).parent_id.blank?)) ? true : false}}
            format.json {render "/layouts/json/wholeView"}
          end
        end
      end
      
    end
  end
  
  def prepare_hash_attributions(element)
    hash_attribution=Hash.new
    case element.type
    when "LessonPlan", "Experience"
      if element.type == "Experience"
        lesson_plan = element.lesson_plan
      else
        lesson_plan = element
      end
      
      hash_attribution = create_hash_attributions(lesson_plan, hash_attribution)
      lesson_plan.activities.where(:removed => false).each do |activity|
        hash_activity = Hash.new
        hash_attribution[activity.id.to_s] = create_hash_attributions(activity, hash_activity)  
      end

    when "Activity", "Content" #ARREGLAR LOS NOMBRES DE LAS VARIABLES Y METER TODOS ESTOS IF EN UNA FUNCION
      hash_activity = Hash.new
      hash_attribution[element.id.to_s] = create_hash_attributions(element, hash_activity)
    end
    
    return hash_attribution
  end
  
  def create_vector_licenses(element)
    vector = Array.new
    (0..4).each do |n|
      vector[n] = '0'
    end
    
    vector1 = Array.new
    (0..5).each do |n|
      vector1[n] = '0'
    end
    
    bandera = false
    if element.type == "Experience"
      children = Element.where('parent_id = '+ element.lesson_plan.id.to_s + ' and removed = false and type != "TechnicalSetting" and type != "EducationalSetting"')
    else
      children = Element.where('parent_id = '+ element.id.to_s + ' and removed = false and type != "TechnicalSetting" and type != "EducationalSetting"')  
    end
    
    children.each do |child|
      case child.right_id
          when 1
            vector[3] = '1'
          when 2
            vector[2] = '1'
          when 3
            vector[1] = '1'
          when 4
            vector[0] = '1'
          when 7
            vector[4] = '1'
          when 5
            bandera = true
            vector1[0] = '1'
          when 6
            bandera = true
            vector1[0] = '1'
            vector1[1] = '1'
      end
    end
    
    
    vector = vector.join
    if element.type == "Experience"
      vector = {element.lesson_plan.id.to_s => vector}
    else
      vector = {element.id.to_s => vector}
    end
    
    vector1 = vector1.join
    if element.type == "Experience"
      vector1 = {element.lesson_plan.id.to_s => vector1}
    else
      vector1 = {element.id.to_s => vector1}
    end
    
    if (element.right_id != 5 and element.right_id !=6)
      return [vector, bandera]
    else
      return [vector1, bandera]
    end
    
  end
  #####################################################
  #   Funcion para añadir un elemento a la library    #
  #####################################################
  
  def addToLibrary
    
    @object = params[:controller].camelize.singularize.constantize.find(params[:id])
    library = false
    unless @object.library
      #Al añadir un elemento a la libreria se está haciendo una copia del original no incluido en la library.
      #Ese original debe reflejar esa copia en copy_count
      includes = @object.copy_count
      includes +=1        
      @object.update_column(:copy_count, includes)
      #Se clona el objeto    
      @object = @object.clone_with_associations(current_user.id,params, session.id)
      @object.library = true
      @object.language = params[:locale]
      @object.parent_id = nil
      @object.private = false;
      @object.save
      library = true
      #Al incluir un elemento a la library necesitamos también añadir un Include en la tabla de usages
      Usage.addUsage(current_user.id, @object.source_id, 'Include', @object.id, session.id, 'Adopt')                
    end
    
    respond_with do |format|
      if library
        format.json {render "layouts/json/sendObjectId"}
      else
        format.json {head :unprocessable_entity}  
      end
      
    end
  end
  
  def addElement
    p "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
    p params
    p "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
    params[:creator_id] = current_user.id
    parent_object = Element.find(params[:parent_id]) #Elemento padre: Actividad o Lesson Plan
    valido = true
    cambio_licencia_final="0"
    case params[:element_type]
    when "TechnicalSetting", "EducationalSetting"
      @element = Element.find(params[:element_id])
      @element = @element.clone_with_associations(current_user.id, params, session.id)
      @element.parent_id = params[:parent_id]
      @element.library = false
      @element.private = false
      @element.save
      
      element_parent = Element.find(params[:parent_id])
      if params[:element_type] == "TechnicalSetting"
        element_parent.technical_setting.destroy 
        @tsoptions = reload_vocabularies("technical_setting", @element)  
      else
        element_parent.educational_setting.destroy 
        @esoptions = reload_vocabularies("educational_setting", @element)  
      end
      ReloadElementFields.reload_updated_at(element_parent)
        
      respond_with do |format|
        format.html {render :partial => "settings/html/settings_layout", :object => @element, 
          :locals => {:added => true, :created => true, :setting => params[:element_type] == "TechnicalSetting" ? "technical" : "educational", :parent => element_parent} }
      end
      
    else 
      case params[:parent_type]
      when "Activity"
        case params[:element_type]
        when "Application", "Device", "Event", "Collaborator", "Content" # ES UN RECURSO AGREGANDOLO A UNA ACTIVIDAD
          @element = Element.find(params[:element_id])
          
          if params[:special_case] == "true" #En este caso no se dispone de vector y hay que crearlo aquí
            @element = @element.clone_with_associations(current_user.id, params, session.id)
            @element.parent_id = params[:parent_id]
            @element.library = false
            @element.private = false
            @element.abstract = false
            @element.view_count = 0
            @element.copy_count = 0
            @element.save

            if @element.type == "Content"
              vector = CompatibilityChart.create_vectors(Array.new.push(parent_object))
              valido = CompatibilityChart.check_compatibility(vector[parent_object.id.to_s],@element.right_id,parent_object.right_id,@element.creator_id,current_user.id);
            end
            
            if valido or @element.authorization_license == '1'
              Usage.addUsage(current_user.id, @element.source_id, 'Include', @element.id, params[:parent_id], session.id, 'Adopt')
              params[:new_element] = false
            else
              cambio_licencia_final="6"
              @element.destroy
            end
          
          else
            if (@element.type == "Content" and @element.right_id != 9)
              valido = CompatibilityChart.check_compatibility(params[:final_vector],@element.right_id,parent_object.right_id,@element.creator_id,current_user.id);
            end
            
            
            if valido or @element.authorization_license == 1
              @element = @element.clone_with_associations(current_user.id, params, session.id)
              @element.parent_id = params[:parent_id]
              @element.library = false
              @element.private = false
              @element.abstract = false
              @element.view_count = 0
              @element.copy_count = 0
              @element.save
              if (@element.type == "Content" and @element.right_id != 9)
                vector = CompatibilityChart.create_vectors(Array.new.push(@element))  #Al incluir la actividad en el lesson plan necesitamos también añadir un Include en la tabla de usages
              end
              Usage.addUsage(current_user.id, @element.source_id, 'Include', @element.id, params[:parent_id], session.id, 'Adopt')
              params[:new_element] = false
            else
              cambio_licencia_final="6"
            end
          end
          
        else #ES UN NUEVO RECURSO DE UN DETERMINADO TIPO AGREGANDOLO A UNA ACTIVIDAD
          params[:element_type] = params[:element_type].split("_")[0]
          @element = params[:element_type].constantize.new(validate_params)  
          @element.library = false
          @element.private = false
          @element.abstract = false
          @element.language = params[:locale]
          @element.parent_id = params[:parent_id]
          @element.view_count = 0
          @element.copy_count = 0
          
          if @element.type == "Content"
              @element.right_id = current_user.profile.right_id
              params[:final_vector] = CompatibilityChart.new_element_compatibility(@element.right_id, parent_object.right_id, params[:final_vector])  #Creamos vector de licencias para posteriormente comprobar si es compatible con la licencia del lesson plan
              valido = CompatibilityChart.check_compatibility(params[:final_vector],@element.right_id,parent_object.right_id,@element.creator_id,current_user.id); #Comprobamos compatibilidad de licencias
          end
  
          if valido
            @element.save
            if params[:element_type] == "template"
              create_empty_data_boxes(@element, true)
            end
            if @element.type == "Content"
                vector = CompatibilityChart.create_vectors(Array.new.push(@element)) #Creamos vector con las licencias de los elementos que tiene el lesson plan
            end
            Usage.addUsage(current_user.id, @element.id, 'Include', @element.id, params[:parent_id], session.id, 'Adopt') #Al incluir la actividad en el lesson plan necesitamos también añadir un Include en la tabla de usages       
          else
            cambio_licencia_final="7"
          end
          params[:new_element] = true
        end
        
        p "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@2"
        p "llego antes del respond"
        respond_with do |format|
          if params[:element_type]=="TechnicalSetting" or params[:element_type]== "EducationalSetting"
            format.html {render :partial => "settings/html/settings_layout", :object => @element, :locals => {:added => true, :created => true, :setting => params[:element_type] == "TechnicalSetting" ? "technical" : "educational"} }   
          else
            if valido or @element.authorization_license == 1
              #Se actualiza la fecha de updated_at del elemento añadido y de todos sus padres
              p "Antes del reload"
              ReloadElementFields.reload_updated_at(@element)
              p "después del reload"  
              
              if params[:special_case] == "false" or params[:special_case] == nil
                case params[:show_mode]
                when "mini"
                  p "Estoy aqui en el MINI?"
                  format.html {render :partial => "/layouts/html/mini_view", :object => @element, :locals => {:created => true, :contents => true}} 
                when "list"
                  p "Estoy aqui en el LIST?"
                  if @element.type == 'Content'
                    hash_attribution=Hash.new
                    hash_content = Hash.new
                    hash_attribution[@element.id.to_s] = create_hash_attributions(@element, hash_content)
                    format.html {render :partial => "/layouts/html/list_view", :object => @element, :locals => {:attributions => hash_attribution, :created => true, :contents => true}}
                  else
                    p "Estoy aqui en el else?"
                    format.html {render :partial => "/layouts/html/list_view", :object => @element, :locals => {:created => true, :contents => true}}
                  end                  
                end
                
              else
                format.html{head :ok}
              end   
            else
              case cambio_licencia_final
              when "6" #El recurso no se puede añadir porque su licencia no es compatible con la licencia de la actividad
                format.html {render :text => "activity_condition4", :status => 403}
              when "7" #El recurso no se puede añadir porque la licencia que tiene por defecto no es compatible con la licencia de la actividad
                format.html {render :text => "activity_condition5", :status => 403}
              end
            end
          end
        end
  #######################################################################################################################################################################################################################
  #######################################################################################################################################################################################################################
  #######################################################################################################################################################################################################################
      when "LessonPlan"
        valid_template = false
        case params[:element_type]
        when "Application", "Device", "Event", "Collaborator", "Content", "Activity" # ES UNO DE ESTOS ELEMENTOS AGREGANDOLOS AL LESSONPLAN
          @element = params[:element_type].constantize.find(params[:element_id])
          
          if params[:special_case] == "true" #En este caso no se dispone de vector y hay que crearlo aquí
            @element = @element.clone_with_associations(current_user.id, params, session.id)
            @element.parent_id = params[:parent_id]
            @element.library = false
            @element.private = false
            @element.abstract = false
            @element.view_count = 0
            @element.copy_count = 0
            @element.save
            if @element.type == "Content" || @element.type == "Activity"
              vector = CompatibilityChart.create_vectors(Array.new.push(parent_object))
              valido = CompatibilityChart.check_compatibility(vector[parent_object.id.to_s],@element.right_id,parent_object.right_id,@element.creator_id,current_user.id);
            end
            if valido or @element.authorization_license == 1
              Usage.addUsage(current_user.id, @element.source_id, 'Include', @element.id, params[:parent_id], session.id, 'Adopt')
              params[:new_element] = false
            else
              if @element.type == "Activity"
                cambio_licencia_final="6"
              else
                cambio_licencia_final="8"
              end
              @element.destroy
            end
          
          else
            if @element.type == "Content" or @element.type == "Activity"
              valido = CompatibilityChart.check_compatibility(params[:final_vector],@element.right_id,parent_object.right_id,@element.creator_id,current_user.id);
            end
            if valido or @element.authorization_license == 1
              @element = @element.clone_with_associations(current_user.id, params, session.id)
              @element.parent_id = params[:parent_id]
              @element.library = false
              @element.private = false
              @element.abstract = false
              @element.view_count = 0
              @element.copy_count = 0
              @element.save
              if @element.type == "Content" or @element.type == "Activity"
                vector = CompatibilityChart.create_vectors(Array.new.push(@element))  #Al incluir la actividad en el lesson plan necesitamos también añadir un Include en la tabla de usages
              end
              
              if (@element.type == "Activity") #En el caso de añadir una actividad, hay que chequear los templates
                #positions = Array.new
                #collection = parent_object.activities.where(:removed => false).sort_by{|e| e[:position]}
                #unless collection.blank?
                  #template_id = collection[0].template_id
                  #collection.each do |activity|
                   # positions.push(activity)
                    #if(activity.template_id != template_id && template_id != 0)
                     # template_id = 0 #Cuando el template_id es 0, quiere decir que las actividades tienen diferentes templates, y no se puede usar la table_view
                    #end
                  #end
                #else
                 # template_id = 0
                #end
                
                #p template_id
                #if template_id != 0 #Se puede añadir, pq coinciden los templates
                 # valid_template = true
                #end
                
                if (valid_template == true) || ( (valid_template == false) && (params[:show_mode] != "table") )
                  Usage.addUsage(current_user.id, @element.source_id, 'Include', @element.id, params[:parent_id], session.id, 'Adopt') #Al incluir la actividad en el lesson plan necesitamos también añadir un Include en la tabla de usages
                else
                  if (valid_template == false) && (params[:show_mode] == "table")
                    @element.destroy
                  end
                end
              else
                Usage.addUsage(current_user.id, @element.source_id, 'Include', @element.id, params[:parent_id], session.id, 'Adopt')
              end
              params[:new_element] = false  
            else#valido es false
              if @element.type == "Content"
                cambio_licencia_final="8"
              else
                if @element.type == "Activity"
                  cambio_licencia_final="9"
                end
              end
            end
          end
         
        else #DISCRIMINAMOS LOS ELEMENTOS CREADOS DE CERO -> AGREGAMOS UN RECURSO NUEVO O UNA ACTIVIDAD NUEVA(TEMPLATE)
          if params[:element_type] == "template"
            params[:template_id] = params[:element_id]
            @element = Activity.new(validate_params)
            create_setting(@element, "TechnicalSetting")
            create_setting(@element, "EducationalSetting")
          else
            params[:element_type] = params[:element_type].split("_")[0]
            @element = params[:element_type].constantize.new(validate_params)  
          end
          @element.library = false
          @element.private = false
          @element.abstract = false
          @element.language = params[:locale]
          @element.parent_id = params[:parent_id]
          @element.view_count = 0
          @element.copy_count = 0
          
          
          if @element.type == "Content" || (@element.type  =="Activity")
              @element.right_id = current_user.profile.right_id
              params[:final_vector] = CompatibilityChart.new_element_compatibility(@element.right_id, parent_object.right_id, params[:final_vector])  #Creamos vector de licencias para posteriormente comprobar si es compatible con la licencia del lesson plan
              valido = CompatibilityChart.check_compatibility(params[:final_vector],@element.right_id,parent_object.right_id,@element.creator_id,current_user.id); #Comprobamos compatibilidad de licencias
          end
  
          if valido or @element.authorization_license == 1
            @element.save
            if (@element.type == "Activity") #En el caso de añadir una actividad, hay que chequear los templates
              positions = Array.new
              collection = parent_object.activities.where(:removed => false).sort_by{|e| e[:position]}
              unless collection.blank?
                template_id = collection[0].template_id
                collection.each do |activity|
                  positions.push(activity)
                  if(activity.template_id != template_id && template_id != 0)
                    template_id = 0 #Cuando el template_id es 0, quiere decir que las actividades tienen diferentes templates, y no se puede usar la table_view
                  end
                end
              else
                template_id = 0
              end
         
              if template_id != 0 #Se puede añadir, pq coinciden los templates
                valid_template = true
              end
              
              if (valid_template == true) || ( (valid_template == false) && (params[:show_mode] != "table") )
                if params[:element_type] == "template"
                  create_empty_data_boxes(@element, true)
                end
                if @element.type == "Content" || (@element.type  =="Activity")
                    vector = CompatibilityChart.create_vectors(Array.new.push(@element)) #Creamos vector con las licencias de los elementos que tiene el lesson plan
                end
                Usage.addUsage(current_user.id, @element.id, 'Include', @element.id, params[:parent_id], session.id, 'Adopt') #Al incluir la actividad en el lesson plan necesitamos también añadir un Include en la tabla de usages
              else
                if (valid_template == false) && (params[:show_mode] == "table")
                  @element.destroy
                end
              end   
             
            else #En el caso de estar añadiendo un recurso
              if @element.type == "Content" 
                  vector = CompatibilityChart.create_vectors(Array.new.push(@element)) #Creamos vector con las licencias de los elementos que tiene el lesson plan
              end
              Usage.addUsage(current_user.id, @element.id, 'Include', @element.id, params[:parent_id], session.id, 'Adopt') #Al incluir la actividad en el lesson plan necesitamos también añadir un Include en la tabla de usages
            end       
          else
            if @element.type == "Content"
              cambio_licencia_final="10"
            else
              if @element.type == "Activity"
                cambio_licencia_final="11"
              end
            end
          end
          params[:new_element] = true
        end
        
        respond_with do |format|
          case params[:element_type]
          when "Activity", "template"
            if valido or @element.authorization_license == 1
              #Se actualiza la fecha de updated_at del elemento añadido y de todos sus padres
              ReloadElementFields.reload_updated_at(@element)
              
              if params[:special_case] == "false" or params[:special_case] == nil 
                case params[:show_mode]
                when "mini"
                  format.html {render :partial => "/layouts/html/mini_view",:object => @element, :locals => {:created => true, :valid_template => valid_template}}
                when "list"
                  hash_attribution=Hash.new
                  hash_activity = Hash.new
                  hash_attribution[@element.id.to_s] = create_hash_attributions(@element, hash_activity)
                  format.html {render :partial => "layouts/html/list_view", :object => @element, :locals => {:attributions => hash_attribution, :vector_licenses => params[:new_element] ? {@element.id.to_s => "00000"} : vector, :contents => true, :created => true, :valid_template => valid_template}}
                when "table"
                  if valid_template == true
                    format.html { render :partial => "activities/html/table_view", :object => @element, :locals => {:vector_licenses => params[:new_element] ? {@element.id.to_s => "00000"} : vector, :contents => true, :created => true, :experience => params[:experience] == true ? true:false} }
                  else
                    format.html { head :not_acceptable } #Error 406
                  end
                end
              else
                format.html{head :ok}
              end
            else
              case cambio_licencia_final
              when "9" #La licencia de la actividad no es compatible con las licencias de los recursos añadidos
                format.html {render :text => "activity_condition6", :status => 403}
              when "11" #La licencia de la actividad no es compatible con la licencia de la unidad didáctica (actividad de cero)
                format.html {render :text => "activity_condition7", :status => 403}
              when "6" #La licencia de la actividad no es compatible con la licencia de la unidad didáctica
                format.html {render :text => "activity_condition6", :status => 403}
              end           
              #format.html { head :forbidden }
            end
          when "TechnicalSetting", "EducationalSetting"
            format.html {render :partial => "settings/html/settings_layout", :object => @element, :locals => {:added => true, :created => true, :setting => params[:type] == "technical_setting" ? "technical" : "educational"} }   
          else #Cuando es un recurso
            if valido or @element.authorization_license == 1
              
              #Se actualiza la fecha de updated_at del elemento añadido y de todos sus padres
              ReloadElementFields.reload_updated_at(@element)
              
              if params[:special_case] == "false" or params[:special_case] == nil
                case params[:show_mode]
                when "mini"
                  format.html {render :partial => "/layouts/html/mini_view", :object => @element, :locals => {:created => true, :contents => true}} 
                when "list"
                  if @element.type == 'Content'
                    hash_attribution=Hash.new
                    hash_content = Hash.new
                    hash_attribution[@element.id.to_s] = create_hash_attributions(@element, hash_content)
                    format.html {render :partial => "/layouts/html/list_view", :object => @element, :locals => {:attributions => hash_attribution, :created => true, :contents => true}}
                  else
                    format.html {render :partial => "/layouts/html/list_view", :object => @element, :locals => {:created => true, :contents => true}}
                  end                  
                end
              else
                format.html{head :ok}
              end
            else
              case cambio_licencia_final
              when "8" #La licencia de la actividad no es compatible con las licencias de los recursos añadidos
                format.html {render :text => "activity_condition8", :status => 403}
              when "10" #La licencia de la actividad no es compatible con la licencia de la unidad didáctica
                format.html {render :text => "activity_condition9", :status => 403}
              end
              #format.html { head :forbidden }
            end
          end
          
        end
  #######################################################################################################################################################################################################################
  #######################################################################################################################################################################################################################
  #######################################################################################################################################################################################################################
  
      when "TechnicalSetting"
        @element = Element.find(params[:element_id])
        @element = @element.clone_with_associations(current_user.id, params, session.id)
        @element.parent_id = params[:parent_id]
        @element.library = false
        @element.private = false
        @element.abstract = false
        @element.view_count = 0
        @element.copy_count = 0
        @element.save
        Usage.addUsage(current_user.id, @element.source_id, 'Include', @element.id, params[:parent_id], session.id, 'Adopt')
        params[:new_element] = false
        
        #Se actualiza la fecha de updated_at del elemento añadido y de todos sus padres
        ReloadElementFields.reload_updated_at(@element)
        
        respond_with do |format|
           format.html {render :partial => "/layouts/html/mini_view", :object => @element, :locals => {:created => true, :contents => true}} 
        end
        
      else
        puts "La que has liao pollito! Rails"
      end
    end
  end
  

  def add_records
    @element = Element.find(params[:id]) #Recoger el LP o Activity al que le vamos a agregar
    if @element.experience_element_records.where(:user_id => current_user.id).blank?
      params[:element_id] = params[:id]
      params[:user_id] = current_user.id
      @element.experience_element_records << ExperienceElementRecord.new(validate_eer_params)
    end
    
    @record = ElementRecord.new
    case params[:type]
    when "image"
      @record.record_type = "Image"
    when "video"
      @record.record_type = "Video"
    when "document"
      @record.record_type = "Document"
    when "snippet"
      @record.record_type = "Snippet"
    when "positive_comment"
      @record.record_type = "PositiveComment"
    when "negative_comment"
      @record.record_type = "NegativeComment"
    when "free_text"
      @record.record_type = "FreeText"
    when "idea"
      @record.record_type = "Idea"
    end
    
    @element.experience_element_records.where(:user_id => current_user.id).first.element_records << @record
    
    ReloadElementFields.reload_updated_at(@element)

    respond_with do |format|
      format.html{render :partial => "/experiences/html/records", :object => @record, :as => "list_view", :locals => {:new => true, 
        :info_type => params[:info_type]} }
      format.json{render json: @record}
    end
    
  end
  
  def getRecords   
    
    if current_user.type == "Student"
      @records = Element.find(params[:id]).experience_element_records.where(:user_id => current_user.id) 
    else
      @records = Element.find(params[:id]).experience_element_records
    end
    
    unless @records.blank?
      records_array = Array.new
      @records.each do |records|
        x = records.element_records.where(:removed => false).order("created_at DESC")
        x.each do |y|
          records_array.push(y)  
        end
      end
      @records = records_array.sort_by{|x| x[:created_at]}.reverse!
    end
   
    
    respond_with do |format|
      format.json {render "/layouts/json/sendRecords"}
      format.html {render :partial => "experiences/html/records", :collection => @records, :locals => {:new => true, 
        :submission => params.has_key?(:submission) && params[:submission]=="true" ? true : false}}
    end
    
  end
  
  def destroyRecord
    
    params[:record_id].split(",").each do |record_id|
      record = ElementRecord.find(record_id)
      record.removed = true
      record.save
    end
    
    ReloadElementFields.reload_updated_at(Element.find(params[:id]))
       
    respond_with do |format|
      format.json { render nil}
    end
  end
  
  
  
  ##################################################################################################################################
  #Funciones para obtener la informacion de un elemento (si es original o no) y para ver su relevancia en función de la utilziación#
  ##################################################################################################################################
  
  def getInfo
    element = Element.find(params[:id])
    unless element.source_id.blank?
      original = Element.find(element.source_id)
      if (original.removed == true)
        original = nil
      end
    else
      original = element
    end
    
    if (element.type == "Content") || (element.type == "Activity") || (element.type == "LessonPlan")
      hash_attribution = Hash.new
      hash_attribution[element.id.to_s] = create_hash_attributions(element, hash_attribution)
    end
    
    respond_with do |format|
      if (element.type == "Content") || (element.type == "Activity") || (element.type == "LessonPlan")
        format.html {render :partial => "layouts/html/info_element", :locals => {:element => element, :original => original, :attributions => hash_attribution} }
      else
        format.html {render :partial => "layouts/html/info_element", :locals => {:element => element, :original => original} }
      end
    end
  end
  
  def getRelevanceInfo
    #Boards from element
    element = Element.where("(id= '"+params[:id]+"')").first
    if (element.type.downcase != "board")
      boards = element.boards
      unless boards.blank?
        boards_number = boards.where("removed = false").length
      else
        boards_number = 0
      end
    else
      boards_number = 0
    end
    
    #Views from element
    element = Element.find(params[:id])
    views = Usage.where("verb='View' and object_id='"+params[:id].to_s+"' and user_id!='"+element.creator_id.to_s+"'").length
    element.update_column(:view_count, views)
    users = Usage.select("distinct user_id").where("verb='View' and object_id='"+params[:id].to_s+"' and user_id!='"+element.creator_id.to_s+"'").order("user_id ASC")
    unless users.blank?
      users_views_number = users.length
    else
      users_views_number = 0
    end
        
    #Copies/Includes from element
    element = Element.find(params[:id])
    copies_includes = Usage.where("(verb='Copy' or verb='Include') and object_id='"+params[:id].to_s+"'")
    number_copies_includes = 0
    unless copies_includes.blank?
      copies_elements = Array.new
      copies_includes.each do |copy_include|
        result = Element.find(copy_include.result_id)
        if !result.removed
          copies_elements.insert(0, result)
          number_copies_includes +=1
        end
      end
    end
    
    users = Usage.select("distinct user_id").where("(verb='Copy' or verb='Include') and object_id='"+params[:id].to_s+"'").order("user_id ASC")
    unless users.blank?
      users_copies_number = users.length
    else
      users_copies_number = 0
    end
    
  
    element.update_column(:copy_count, number_copies_includes)
    
    @element = Element.find(params[:id])
    
    respond_with do |format|
      format.html {render :partial => "layouts/html/info_relevance", :object => @element, :locals => {:boards_number => boards_number, :views => views, :users_views_number => users_views_number, :copies_includes => number_copies_includes, :users_copies_number => users_copies_number} }
    end
  end
 
  #########################################################################
  #   Funciones para trabajar con las Keywords. Pedir, Agregar, Borrar    #
  #########################################################################
  
  def getKeywords
    
  end
  
  def addKeywords
    keyobj = KeywordsObject.new(Element.find(params[:id]))
    keyobj.setInputObject(hash = {"term" => params[:keyword]})
    keyobj.insertKeywordsIntoDatabase(keyobj)
    
    #Se actualiza la fecha de updated_at del elemento al que pertenece la keyword y de todos sus padres
    ReloadElementFields.reload_updated_at(Element.find(params[:id]))
    
    respond_with do |format|
      if keyobj.getOutput.length > 0
        format.json{ render json: {:keyword => keyobj.getOutput.first} }
      else
        format.json {head :not_acceptable}
      end
    end
  end
  
  def deleteKeywords
    keyword = Keyword.find(params[:keyword_id])
    
    ReloadElementFields.reload_updated_at(Element.find(keyword.element_id))
    
    keyword.destroy
    
    respond_with do |format|
      format.json { render json: {:ok => nil} }
    end
  end
  
  def callAdega(element)
    EventMachine.run{
      values = 0;
      case params[:locale]
      when "es"
        values = 2
      when "en"
        values = 1
      end
      options = {
        :body => {'text' => strip_tags(element.description), 'idOntology' => values, 'idCorpus' => values, 'idTermExtractor' => values, 'numberElementsContext' => 3},
        :head => {'X-Auth-Key' => "2724ta2la8h1ga89fiqqfsjh4c"}
      }
      http = EventMachine::HttpRequest.new("http://tec.citius.usc.es/adegaws2/ADEGA/context").post(options)
      keyobj = KeywordsObject.new(element)
      http.errback{ p "Uh oh" }
      http.callback{
        begin
          data = http.response
          #Aqui va el servicio push!
          channel = '/'+ Digest::MD5.hexdigest(request.session_options[:id]).to_s
          client = Faye::Client.new('http://edu-area.com:9292/faye')
          client.subscribe(channel)
          
           if http.response_header.status == 200
            data = ActiveSupport::JSON.decode(data)
            
            keyobj.setInputArray(data)
            keyobj.insertKeywordsIntoDatabase(keyobj)
          end
          client.publish(channel, 'keywords' => keyobj.getOutput)
        rescue
          p "Se ha producido un error en el callback"
        end
      }
    }
  end
  
  #######################################################################################################################
  #   Funcion para filtrar a partir de los parámetros que se hayan marcado                                              #
  #######################################################################################################################
  
  def filter
    if user_signed_in?
      params[:logged]='true'
      params[:current_user]=current_user.id
    else
      params[:logged]='false'
    end
    
    if (params[:commit]=="Search" or params[:commit]=="Buscar" or params[:commit]=="Pesquisar")
      filter_object=FilterObject.new(params)
      filter_object.filter_simple
      @elements = filter_object.getOutput
        
      respond_with do |format|
        @object = @elements
        format.html { render params[:controller].underscore.downcase+"/html/index"}
      end
    
    else
      if params[:type_form]=='simple_filter'
        respond_with do |format|
          format.html { redirect_to "/"+params[:locale]+"/filter?type_form=simple_filter"}
        end
      else
        filter_object=FilterObject.new(params)
        filter_object.filter_advanced
        @elements = filter_object.getOutput
        @resources = @elements.where('type IN (?)', ['Application', 'Device', 'Event', 'Content', 'Collaborator'])
        @activities = @elements.where("type='Activity'")
        @lesson_plans=@elements.where("type='LessonPlan'")
        @experiences=@elements.where("type='Experience'")
        @boards=@elements.where("type='Board'")
        respond_with do |format|
          @object = @elements
          format.html { render "home/filter_results"}
        end
      end
    end  
  end
  
  
  #########################################################################
  #   Funciones para trabajar con los comments. Pedir, Agregar            #
  #########################################################################
  
  def getComments
    @comments = Comment.where(:element_id => params[:id])
    
    respond_with do |format|
      format.html {render :partial => "comments/html/show_comments", :object => @comments, :locals => {:element_id => params[:id], :show => params[:show], :type => Element.where("(id= '"+params[:id]+"')").first.type.downcase} }
      format.json { render "/comments/json/sendComments"}
    end
  end
  
  def setComments
    new_comment = Comment.new()
    new_comment.user_id = current_user.id
    new_comment.element_id = params[:id]
    new_comment.description = params[:description]
    new_comment.save
    @comments = new_comment
    respond_with do |format|
      format.html {render :partial => "comments/html/new_comment", :locals => {:new_comment => new_comment, :nav_bar => params[:nav_bar]} }
      format.json { render "/comments/json/sendComments"}
    end
    
  end
  
  ####################################################################################################
  #Función para cambiar los mode view de la vista de actividades y de la vista de unidades didácticas#
  ####################################################################################################
  
  def changeModeView
    
    element = Element.find(params[:id])
    
    if params[:who] == "resources"
      modifier = "type = 'Application' or type = 'Device' or type = 'Content' or type = 'Event' or type = 'Collaborator'" 
      collection = Element.where("("+modifier+") and (removed = false) and (parent_id = "+params[:id]+")").order("position ASC")
    else
      collection = element.activities.where(:removed => false).sort_by{|e| e[:position]}
    end
    
    vector_hash = CompatibilityChart.create_vectors(collection)
    
    respond_with do |format|
      case params[:view]
      when "mini"
        format.html {render :partial => "/layouts/html/mini_view",:collection => collection, :locals => {:created => (params[:created] == "true") ? true : false}}
      
      when "list"
        hash_attribution=Hash.new
        case element.type
        when "LessonPlan", "Experience"
          if element.type == "Experience"
            lesson_plan = element.lesson_plan
          else
            lesson_plan = element
          end
          
          hash_attribution = create_hash_attributions(lesson_plan, hash_attribution)
 
          lesson_plan.activities.where(:removed => false).sort_by{|e| e[:position]}.each do |activity|
            hash_activity = Hash.new
            hash_attribution[activity.id.to_s] = create_hash_attributions(activity, hash_activity)
          end
          
          lesson_plan.contents.where(:removed => false).each do |content|
            hash_content = Hash.new
            hash_attribution[content.id.to_s] = create_hash_attributions(content, hash_content)  
          end
  
        when "Activity" #ARREGLAR LOS NOMBRES DE LAS VARIABLES Y METER TODOS ESTOS IF EN UNA FUNCION
          hash_attribution = create_hash_attributions(element, hash_attribution)
          element.contents.where(:removed => false).each do |content|
            hash_content = Hash.new
            hash_attribution[content.id.to_s] = create_hash_attributions(content, hash_content)
          end
          
        when "Content"
          hash_content = Hash.new
          hash_attribution[element.id.to_s] = create_hash_attributions(element, hash_content)
        end
        
        format.html {render :partial => "layouts/html/list_view", :collection => collection, :locals => {:attributions => hash_attribution, :vector_licenses => vector_hash, :contents => true, :created => (params[:created] == "true") ? true : false}}
      
      when "table"
        format.html { render :partial => "activities/html/table_view", :collection => collection, :locals => {:vector_licenses => vector_hash, :contents => true, :created => (params[:created] == "true") ? true : false, :positions => collection, :experience => params[:experience] == true ? true:false} }
      end
    end
  end
  
  
  
  ########################################
  #  Función para ordenar los elementos  #
  ########################################
  
  def sortElements
    element = Element.find(params[:id])
    if element.type == "Experience"
      element = element.lesson_plan
    end
    
    case params[:type]
    when "activities" #AQUI ORDENAMOS LAS ACTIVITIES
      activity = element.activities.where(:id => params[:activity_id]).first
      activity.insert_at(params[:position].to_i)
      @response = element.activities.where(:removed => false).order("position ASC")
    when "resources"
      modifier = "type = 'Application' or type = 'Device' or type = 'Content' or type = 'Event' or type = 'Collaborator'"
      @response = Element.where("("+modifier+") and (removed = false) and (parent_id = "+params[:id]+")").order("position ASC")
      resource = Element.find(params[:resource_id])
      resource.insert_at(params[:position].to_i)
      modifier = "type = 'Application' or type = 'Device' or type = 'Content' or type = 'Event' or type = 'Collaborator'"
      @response = Element.where("("+modifier+") and (removed = false) and (parent_id = "+params[:id]+")").order("position ASC")
      
    when "submissions"
      submission = element.submissions.where(:id => params[:submission_id]).first
      submission.insert_at(params[:position].to_i)
      @response = element.submissions.where(:removed => false).order("position ASC")
    
    else #AQUI ORDENAMOS LOS ELEMENTOS DE LA LISTA DE LOS TEMPLATES
      box = Element.find(params[:id]).template.boxes.where(:id => params[:box_id].to_i).first
      box.data_boxes.where(:id => params[:data_box_id].to_i, :element_id => params[:id]).first.insert_at(params[:position].to_i)
      @response = box.data_boxes.where(:element_id => params[:id].to_i).order("position ASC");
    end
    
    respond_with do |format|
        format.json{ render "/layouts/json/sendPositions"}
      end
    
  end
  
  
  
  
  ###################################################
  #  Función para compartir un elemento vía email   #
  ###################################################
  
  def shareByEmail
    if user_signed_in?
      @user = User.find(current_user.id)  
    else
      @user = 0    
    end
    
    @url = request.original_url.split("/shareByEmail").first; 
    
    if valid_email?(params[:share_email]) 
      @share_email = params[:share_email]
      ActionCorreo.share_url_email(@user, @url, @share_email).deliver
      
      object = Element.find(params[:id])
      if @user != 0  #Al compartir un elemento vía correo electrónico hay que añadir un Share en la tabla de usages
        Usage.addUsage(current_user.id, object.id, 'Share', object.id, session.id, 'Share')
      end
      
      respond_with do |format|
        if params.has_key?(:popup) && params[:popup] == "true"
          format.html {redirect_to request.referrer}
        else
          format.html {redirect_to @url}
        end 
      end
      
    else
      flash[:bad_email] = t("Bad_email")
      redirect_to @url
    end
    
    
    
  end
  
  def getSections
    element = Element.find(params[:id])
    
    begin
      if element.type == "Experience"
        unless element.lesson_plan.technical_setting.blank?
          @tsoptions = reload_vocabularies("technical_setting", element.lesson_plan.technical_setting)  
        end
        
        unless element.lesson_plan.educational_setting.blank?
          @esoptions = reload_vocabularies("educational_setting", element.lesson_plan.educational_setting)
        end
        @editable_experience = false
        unless SharedExperience.where(:experience_id => params[:id], :user_id => current_user.id).editable
          @editable_experience = true
        end
      end 
      
      unless element.technical_setting.blank?
        @tsoptions = reload_vocabularies("technical_setting", element.technical_setting)
      end
      
      unless element.educational_setting.blank?
        @esoptions = reload_vocabularies("educational_setting", element.educational_setting)
      end
    
      rescue       
    end
    
    values = create_vector_licenses(element)
    vector = values[0]
    bandera = values[1]
    
    attributions = prepare_hash_attributions(element)
    respond_with do |format|
      format.html{render :partial => (params[:controller] == "experiences" ? "lesson_plans" : params[:controller]) +"/html/element_sections",
         :object => element.type=="Experience" ? element.lesson_plan : element, :as => "form",
         :locals => {:created => (user_signed_in? and current_user.id == element.creator_id),
         :vector_licenses => vector, 
         :attributions => attributions,
         :experience => element.type=="Experience" || (params[:contents] == "true" && element.type == "Activity" && !element.lesson_plan.parent_id.blank?) ? true : false,
         :submission => element.type == "Experience" || element.type == "LessonPlan" || (element.type == "Activity" && params[:contents] == "true")}}
    end
  end
  
  def addFastElement
    response = 0
    params[:right_id] = current_user.profile.right_id
    params[:creator_id] = current_user.id
    
    if params[:controller] == "lesson_plans" || params[:controller] == "experiences"
      if params.has_key?(:id) #Aqui agrego una actividad al LP
        params[:template_id] = current_user.profile.activity_default
        
        if params[:controller] == "lesson_plans"
          lesson_plan = Element.find(params[:id])
        else
          lesson_plan = Element.find(params[:id]).lesson_plan
        end
        @object = Activity.new(validate_params_required_template)
        @object.library = 0
        lesson_plan.activities << @object
                
        vector = CompatibilityChart.create_vectors(Array.new.push(lesson_plan))
        valido = CompatibilityChart.check_compatibility(vector[lesson_plan.id.to_s],@object.right_id,lesson_plan.right_id,@object.creator_id,current_user.id);
        
        if valido or @object.authorization_license == 1
          Usage.addUsage(current_user.id, @object.id, 'Include', @object.id, params[:parent_id], session.id, 'Adopt') #Al incluir la actividad en el lesson plan necesitamos también añadir un Include en la tabla de usages
          params[:new_object] = false
        else
          if @object.type == "Activity"
            cambio_licencia_final=6
          else
            cambio_licencia_final=8
          end
          @object.destroy
        end
        
        response = 1
      else
        params[:template_id] = current_user.profile.lesson_plan_default
        @object = LessonPlan.new(validate_params_required_template)
        @object.save
        response = 2
      end
      
    else
      if params[:controller] == "activities"
        params[:template_id] = current_user.profile.activity_default
        @object = Activity.new(validate_params_required_template)
        @object.save
        response = 2
      end  
    end
    
    create_setting(@object, "TechnicalSetting")
    create_setting(@object, "EducationalSetting")    
    
    respond_with do |format|
      case response
      when 1
        if valido
          case params[:show_mode]
            when "mini"
              format.html {render :partial => "/layouts/html/mini_view",:object => @object, :locals => {:created => true, :contents => true}}
              format.json {render "layouts/json/sendObjectId" }
            when "list"
              hash_attribution=Hash.new
              hash_activity = Hash.new
              hash_attribution[@object.id.to_s] = create_hash_attributions(@object, hash_activity)
              format.html {render :partial => "layouts/html/list_view", :object => @object, :locals => {:contents => true, :created => true}}
              format.json {render "layouts/json/sendObjectId" }
            else
              format.json {render "layouts/json/sendObjectId" }
            end
        else
          case cambio_licencia_final
          when 6
            format.html {render :text => "activity_condition6", :status => 403}
          when 8
            format.html {render :text => "activity_condition8", :status => 403}
          end
        end 
      when 2
        format.json {render "layouts/json/sendObjectId" }
      else
      end
    end
  end
  
  def addSubmission
    
    submission = Submission.new
    submission.library = false
    submission.creator_id = current_user.id
    
    case params[:controller]
    when "activities"
      activity = Element.find(params[:id])  
      activity.submissions << submission
      
    when "lesson_plans"
      lesson_plan = Element.find(params[:id])
      lesson_plan.submissions << submission
 
    when "experiences"
      experience = Element.find(params[:id])
      experience.lesson_plan.submissions << submission
    end
    
    @object = submission
    
    ReloadElementFields.reload_updated_at(submission)
    
    respond_with do |format|
      format.html{render :partial => "layouts/html/list_view", 
        :object => submission, :locals => {:experience => params[:experience]== "true" ? true : false, :created => true}}
      format.json{render "layouts/json/sendObjectId"}
    end
  end
  
  
  def getElementList
    if params[:controller] == "experiences"
      element_exp = Element.find(params[:id])
      element = element_exp.lesson_plan
    else
      element = Element.find(params[:id])
    end
    
    case params[:who]
    when "resources"
      modifier = "type = 'Application' or type = 'Device' or type = 'Content' or type = 'Event' or type = 'Collaborator'" 
      collection = Element.where("("+modifier+") and (removed = false) and (parent_id = "+element.id.to_s+")").order("position ASC")
    when "submissions"
      collection = element.submissions.where(:removed => false).sort_by{|e| e[:position]}
    when "observations"
      collection = element.experience_element_records.first.element_records.where(:removed => false).order("created_at DESC")
    end
    
    respond_with do |format|
      if params[:who] == "observations"
        format.html {render :partial => "/experiences/html/records", :collection => collection, :as => "list_view", :locals => {:info_type => "observations"} }
      else
        format.html {render :partial => "layouts/html/list_view", :collection => collection, :locals => {:contents => true, :created => (current_user.id == element.creator_id) ? true : false}}
      end
    end
    
  end
  
  
  def showRecord
    record = ElementRecord.find(params[:who])
        
    respond_with do |format|
      format.html { render :partial => "experiences/html/record_content", :object => record, :as => "records", :locals => {:created => (user_signed_in? and current_user.id == record.experience_element_record.user.id) ? true : false} }  
    end
    
  end
  
  
  #######################################################################################################################
  #   Funcion para editar, solo en la web. Genérica, cada update específico estará en el correspondiente controlador    #
  #######################################################################################################################
  
  def edit #Solo en la web
    @element = params[:controller].camelize.singularize.constantize.find(params[:id])
    respond_with do |format|
      format.json {render params[:controller].underscore.downcase+"/json/wholeView"} 
      format.html {render params[:controller].underscore.downcase+"/html/edit"}
    end
  end
  
  protected
  
  def create_hash_attributions(element, hash_attribution)
    if element.source_id == nil
        right_id=element.right_id
        hash_attribution["modified_license_name"] = License.select(:full_license_name).where(:id => right_id)
        hash_attribution["url_license_modified"]=CompatibilityChart.url_licencia(right_id,params[:locale])
        hash_attribution["original_element"] = nil
    else
        original_right_id = Element.find(element.source_id).right_id
        hash_attribution["original_license_name"] = License.select(:full_license_name).where(:id => original_right_id)
        hash_attribution["url_license"] = CompatibilityChart.url_licencia(original_right_id,params[:locale])
        #license_name of modified work
        modified_right_id = element.right_id
        hash_attribution["modified_license_name"] = License.select(:full_license_name).where(:id => modified_right_id)
        hash_attribution["url_license_modified"] = CompatibilityChart.url_licencia(modified_right_id,params[:locale])
        hash_attribution["original_element"] = Element.find(element.source_id)
    end

    return hash_attribution
  end
  
  private
  
  def create_setting(element, type)
    if type == "TechnicalSetting"
      ts = TechnicalSetting.new(validate_setting_params)
      ts.library = false
      ts.save
          
      ts.vocabularies << Vocabulary.where(:title => "OS").first       # Le asigno los vocabularios de esta manera por que #
      ts.vocabularies << Vocabulary.where(:title => "LMS").first      # aún no se sabe si puede haber mas vocabularios del#
      ts.vocabularies << Vocabulary.where(:title => "Internet").first # del mismo tipo          
      element.technical_setting = ts                          #
    else
      es = EducationalSetting.new(validate_setting_params)
      es.library = false
      es.save
        
      es.vocabularies << Vocabulary.where(:title => "EducationalLevel", :language => params[:locale]).first       # Le asigno los vocabularios de esta manera por que #
      es.vocabularies << Vocabulary.where(:title => "Grade", :language => params[:locale]).first      # aún no se sabe si puede haber mas vocabularios del#
      es.vocabularies << Vocabulary.where(:title => "Block", :language => params[:locale]).first # del mismo tipo                                    #
      es.vocabularies << Vocabulary.where(:title => "Contents", :language => params[:locale]).first
      es.vocabularies << Vocabulary.where(:title => "EvaluationCriteria", :language => params[:locale]).first
      es.vocabularies << Vocabulary.where(:title => "LearningStandards", :language => params[:locale]).first
      es.vocabularies << Vocabulary.where(:title => "Competences", :language => params[:locale]).first
      es.vocabularies << Vocabulary.where(:title => "KnowledgeArea", :language => params[:locale]).first
      es.vocabularies << Vocabulary.where(:title => "Objectives", :language => params[:locale]).first
      element.educational_setting = es
    end
  end
  
  def reload_vocabularies(type, element)
    options = Hash.new 
    if type == "technical_setting"
      ["OS", "LMS", "Internet"].each do |current|
        ts = element.vocabularies.where(:title => current).first
        if ts.blank?
          options[current] = Array.new
        else
          options[current] = ts.vocabulary_terms.where("id not in (select field_value from settings s where s.element_id = '"+element.id.to_s+"')")
        end
      end
      
    else
      ["EducationalLevel", "Grade", "KnowledgeArea"].each do |current|
        es = element.vocabularies.where(:title => current).first
        if es.blank?
          options[current] = Array.new
        else
          options[current] = es.vocabulary_terms.where("id not in (select field_value from settings s where s.element_id = '"+element.id.to_s+"')")
        end
      end
      
      ["Block", "Contents", "Competences", "Objectives"].each do |current|
         options[current] = Array.new
      end
      
    end
    
    return options
  end
  
  def reload_count_number(type, element)
    if type == 'view'
      count = Usage.where("verb='View' and object_id='"+element.id.to_s+"' and user_id!='"+element.creator_id.to_s+"'").length
    else
      copies = Usage.where("verb='Copy' and object_id='"+element.id.to_s+"'")
      number_copies = 0
      includes = Usage.where("verb='Include' and object_id='"+element.id.to_s+"'")
      number_includes = 0
          
       unless copies.blank?
          copies_elements = Array.new
          copies.each do |copy|
            element = Element.find(copy.result_id)
            if !element.removed
              copies_elements.insert(0, element)
              number_copies +=1
            end
          end
        end
    
      unless includes.blank?
        includes_elements = Array.new
        includes.each do |include|
          element = Element.find(include.context_id)
          if !element.removed
            includes_elements.insert(0, element)
            number_includes +=1 
          end  
        end
      end
    
    count = number_copies + number_includes
      
    end
    return count
    
  end
   
end

