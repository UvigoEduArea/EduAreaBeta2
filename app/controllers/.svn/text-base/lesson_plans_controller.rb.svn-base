# -*- coding: utf-8 -*-
class LessonPlansController < ElementsController
  
  private
  
  #########################################################
  ##               VALIDACION DE PARAMETROS              ##
  #########################################################
  
  def validate_params
    params.permit(:parent_id, :title, :URL, :URI, :image, :description, :private, :removed, :language, :creator_id, :library, :abstract, :relevance, :template_id, :right_id)
  end
  
  #########################################################
  ##      PROTEGEMOS PRIMERO LAS ACCIONES CONTRA         ## 
  ##        USUARIOS QUE INTENTEN MODIFICAR DATOS        ##
  ##           DE LOS QUE NO SON PROPIETARIOS            ##
  #########################################################
  
  before_filter :require_owner, :only => [:addActivity,:removeActivity,:update, :edit,:destroy,:duplicate, :addToLibrary,:show,:getWholeView]
  
  def require_owner

    @object_id = params[:id]
    @object = Element.find(@object_id)
    
    case params[:action]
    when 'duplicate'
      unless (@object.private == false)||((@object.private == true)&&(current_user.id == @object.creator_id))
        flash[:error] = "You must be the owner in order to execute this action"
        unless params[:format] == 'json' 
          redirect_to :action => :index
        else
          respond_with do |format|
            format.json{head :forbidden}
          end
        end
      end
     when 'getWholeView', 'show'
      if user_signed_in?
        unless (@object.private == false)||((@object.private == true)&&(current_user.id == @object.creator_id))
          flash[:error] = "You must be the owner in order to execute this action"
          unless params[:format] == 'json' 
            redirect_to :action => :index
          else
            respond_with do |format|
              format.json{head :forbidden}
            end
          end
        end
      else
        unless (@object.private == false)
          flash[:error] = "You must be the owner in order to execute this action"
          unless params[:format] == 'json' 
            redirect_to :action => :index
          else
            respond_with do |format|
              format.json{head :forbidden}
            end
          end
        end
      end
    else 
      if user_signed_in? #Para los casos de addActivity, removeActivity, update, edit, destroy, addToLibrary
        unless current_user.id == @object.creator_id
          flash[:error] = "You must be the owner in order to execute this action"
          unless params[:format] == 'json' 
            redirect_to :action => :index
          else
            respond_with do |format|
              format.json{head :forbidden}
            end
          end
        end
      else
        flash[:error] = "You must be the owner in order to execute this action"
        unless params[:format] == 'json' 
          redirect_to :action => :index
        else
          respond_with do |format|
            format.json{head :forbidden}
          end
        end
      end
    end
  end
  
  #########################################################
  ##  AÑADIMOS DESPUES PERMISO A DETERMINADAS ACCIONES   ##
  ##      PARA QUE PUEDAN SER USADAS POR INVITADOS       ##
  #########################################################
  
  before_filter :authenticate_user!, :except => [:index,:search, :getMiniView, :getSmallView, :show, :getWholeView, :getSections, :changeModeView]

   
  
  public
  
  #ANTIGUO ACTIVITY SEQUENCE
  
  ###########################################################################
  ##                   LESSON PLANS INDEX                                  ##
  ###########################################################################
  
  # GET /lessonPlan
  # GET /lessonPlan.json
  api :GET, "/lessonPlans", "Index"
  param_group :index, ElementsController
  formats ['json','html']
  example '[
    {
        "id": 1259
    },
    {
        "id": 1233
    }
]'
  description '===Description
  This method returns the ids of the index elements.'
  
  def x
    
  end
  
  ###########################################################################
  ##                    LESSON PLANS CREATE                                ##
  ###########################################################################
  
  api :POST, "/lessonPlan/create.json", "Create"
  param_group :create, ElementsController
   example '{
    "id": 1259
}'
  def y
    
  end
  
  ###########################################################################
  ##                   LESSON PLANS GET TEMPLATES                          ##
  ###########################################################################
  api :GET, "/lesson_plans/getTemplates.json", "Get Templates"
  param_group :locale, ElementsController
  description '===Description
  The method returns the id of the templates for activities.'
  example '[
    {
        "id": 715
    }
]'

  def getTemplates 
    @object = LessonPlanTemplate.where(:language => params[:locale], :private => false, :removed => false)
    
    respond_with do |format|
      format.json{ render "/layouts/json/sendObjectId" }
    end
  end
  
  ###########################################################################
  ##                   LESSON PLANS DELETE                                 ##
  ###########################################################################
  
  api :DELETE, "/lessonPlans.json", "Remove"
  param_group :destroy, ElementsController
  description '===Description
  This method deletes the element. Once the element is removed, this method redirects you to the index page.'  
  def z
    
  end
  
  ###########################################################################
  ##                   LESSON PLANS DUPLICATE                              ##
  ###########################################################################
  
  api :POST, "/lessonPlans/duplicate.json", "Duplicate"
  param_group :duplicate, ElementsController
  formats ['json']
   example '{
    "id": 1331
}'
  def w
    
  end

  ###########################################################################
  ##                      LESSON PLANS UPDATE                              ##
  ###########################################################################
  api :PATCH, "/lesson_plans/:id.json", "Update"
  param :id, Fixnum, :desc => "Id of the element to update", :required => true
  param :campo, String, :desc => "Name of the field to update", :required => true, :meta => ['title', 'description', 'private', 'image', 'imagenone','content_value', 'data_boxes', 'textarea', 'abstract']
  param :contenido, Fixnum, :desc => "Content of the field to be updated. The content type depends on the field to update", :required => true
  param :data_box, Fixnum, :desc => "Id of the databa box to update", :required => true, :meta => {"Used with fields" => ['content_value', 'data_boxes', 'textarea']}
  param :parent_element, [true, false], :desc => "Specify if the lesson plans belongs to an upper element", :required => false
  description <<-EOS
  ===Description
    This method updates the values of a Lesson Plan. If this element belongs to a experience (upper element), it is necessary send the parameter "parent_element" to update the header values of the experience
  EOS
  def update
    valido = true
    valido_general = true 
    lesson_plan = LessonPlan.find(params[:id])
    cambio_licencia_final="0"
    case params[:campo]
      when 'title'
        lesson_plan.title = params[:contenido]
        if params.has_key?(:parent_element) && params[:parent_element] == "true"
          lesson_plan.experience.title = params[:contenido]
          lesson_plan.experience.save          
        end   
      when 'description'
        lesson_plan.description = params[:contenido]
        if params.has_key?(:parent_element) && params[:parent_element] == "true"
          lesson_plan.experience.description = params[:contenido]
          lesson_plan.experience.save          
        end
        callAdega(lesson_plan)
      when 'description_student'
        lesson_plan.description_student = params[:contenido]
        if params.has_key?(:parent_element) && params[:parent_element] == "true"
          lesson_plan.experience.description_student = params[:contenido]
          lesson_plan.experience.save          
        end
      when 'private'
        lesson_plan.private = params[:contenido]
        if params.has_key?(:parent_element) && params[:parent_element] == "true"
          lesson_plan.experience.private = params[:contenido]
          lesson_plan.experience.save          
        end
      when 'image'
        lesson_plan.image = params[:contenido]
        if params.has_key?(:parent_element) && params[:parent_element] == "true"
          experience = lesson_plan.experience
          experience.image = params[:contenido]
          experience.save          
        end
      when 'imagenone'
        lesson_plan.image = nil
        if params.has_key?(:parent_element) && params[:parent_element] == "true"
          lesson_plan.experience.image = nil
          lesson_plan.experience.save          
        end
      when 'state'
        lesson_plan.experience.state = params[:contenido]
        lesson_plan.experience.save
      when 'content_value', 'data_boxes', 'textarea'
        data_box = DataBox.find(params[:data_box])
        data_box.content_value = params[:contenido]
        data_box.save
      when 'abstract'
        lesson_plan.abstract = params[:contenido] unless params[:contenido].blank?
       when 'licenses'
        #Si source_id = nil, es que estamos ante un LP original (no clonado)
        if lesson_plan.source_id == nil
        #CC-BY
            if (params[:commercial]  == "1") and (params[:derivative] == "1") and (params[:condition] == "1")
              valido = CompatibilityChart.license_change_compatibility(params[:commercial],params[:derivative],params[:condition],params[:vector_licenses],lesson_plan.creator_id,current_user.id)
              if valido
                lesson_plan.right_id = "1"
              end
            end
            #CC-BY-SA
            if (params[:commercial]  == "1") and (params[:derivative] == "2") and (params[:condition] == "1")
              valido = CompatibilityChart.license_change_compatibility(params[:commercial],params[:derivative],params[:condition],params[:vector_licenses],lesson_plan.creator_id,current_user.id)
              if valido
                lesson_plan.right_id = "2"
              end
            end
            #CC-BY-NC
            if (params[:commercial]  == "0") and (params[:derivative] == "1") and (params[:condition] == "1")
              valido = CompatibilityChart.license_change_compatibility(params[:commercial],params[:derivative],params[:condition],params[:vector_licenses],lesson_plan.creator_id,current_user.id)
              if valido
                 lesson_plan.right_id = "3"
              end
            end
            #CC-BY-NC-SA
            if (params[:commercial]  == "0") and (params[:derivative] == "2") and (params[:condition] == "1")
              valido = CompatibilityChart.license_change_compatibility(params[:commercial],params[:derivative],params[:condition],params[:vector_licenses],lesson_plan.creator_id,current_user.id)
              if valido
                lesson_plan.right_id = "4"
              end
            end
            #CC-BY-ND
            if (params[:commercial]  == "1") and (params[:derivative] == "0") and (params[:condition] == "1")
              valido = CompatibilityChart.license_change_compatibility(params[:commercial],params[:derivative],params[:condition],params[:vector_licenses],lesson_plan.creator_id,current_user.id)
              if valido
                lesson_plan.right_id = "5" 
              end
            end
            #CC-BY-NC-ND
            if (params[:commercial]  == "0") and (params[:derivative] == "0") and (params[:condition] == "1")
              valido = CompatibilityChart.license_change_compatibility(params[:commercial],params[:derivative],params[:condition],params[:vector_licenses],lesson_plan.creator_id,current_user.id)
              if valido
                lesson_plan.right_id = "6"
              end
            end
            #CC0 Public Domain
            if ((params[:commercial]  == "1") and (params[:derivative] == "1")) and (params[:condition] == "2")
              valido = CompatibilityChart.license_change_compatibility(params[:commercial],params[:derivative],params[:condition],params[:vector_licenses],lesson_plan.creator_id,current_user.id)
              if valido
                lesson_plan.right_id = "7" 
              end
            end
        if !valido
          cambio_licencia_final="4"
        end
        #Si source_id != nil, estamos ante un LP clonado
        else
            #license_id=LessonPlan.find(lesson_plan.source_id).right_id
            license_id=lesson_plan.original_license_id
            #Comprobamos si licencia del elemento clonado es compatible con la licencia original
            valido = CompatibilityChart.licencia_clonar_elemento(license_id,params[:commercial],params[:derivative],params[:condition])
            if valido
              #Una vez que la licencia es compatible con la licencia original hay que comprobar que si a su vez es compatible con los recursos
              valido_general = CompatibilityChart.license_change_compatibility(params[:commercial],params[:derivative],params[:condition],params[:vector_licenses],lesson_plan.creator_id,current_user.id)
              if valido_general
                p "valido_general "
                lesson_plan.right_id = CompatibilityChart.construct_right_id(params[:commercial],params[:derivative],params[:condition])
              else
                cambio_licencia_final="4"
              end
            else
              cambio_licencia_final="5"
            end
        end
       when 'author'
         if (params[:contenido] == "true" )  #Si el usuario es el autor => meter en element.author el first_name and last_name del current_user
             #element.author=  current_user.profile.first_name + ' ' +current_user.profile.last_name
             lesson_plan.author=nil
             lesson_plan.author_URL=nil
             #element.author_URL= element.author_URL
         else
             lesson_plan.author=""
             lesson_plan.author_URL=""
         end
      when 'author_name'   
          lesson_plan.author = params[:contenido]
      when 'author_URL'
          lesson_plan.author_URL = params[:contenido]
      when 'known_CC_license'   
          if params[:contenido]=="false"
              lesson_plan.right_id=8
          else
              vector = CompatibilityChart.create_vectors(Array.new.push(lesson_plan))
              license = CompatibilityChart.check_license_true(vector[lesson_plan.id.to_s], true)
              if license
                lesson_plan.right_id = License.where(:name => license).first.id
              else
                lesson_plan.right_id = current_user.profile.right_id
              end
          end
         
    end
    
    #Si las fechas de creacion y de actualizacion no coinciden es que el elemento ya ha sido actualizado (Adaptado) antes
    #Si coinciden, es la primera actualizacion y habra que cambiar la entrada Adopt de usages por Adapt, siempre y cuando exista esa entrada Adopt
    if params.has_key?(:parent_element) && params[:parent_element] == "true" #En este caso se trata de una experiencia
      if ((lesson_plan.experience.updated_at.tv_sec - lesson_plan.experience.created_at.tv_sec == 0) || (lesson_plan.experience.updated_at.tv_sec - lesson_plan.experience.created_at.tv_sec == 1)) 
        Usage.changeStatus(current_user.id, lesson_plan.experience.source_id, lesson_plan.experience.parent_id, lesson_plan.experience.id, session.id)
      end          
    else #Si es un lesson plan
      if ((lesson_plan.updated_at.tv_sec - lesson_plan.created_at.tv_sec == 0) || (lesson_plan.updated_at.tv_sec - lesson_plan.created_at.tv_sec == 1)) 
        Usage.changeStatus(current_user.id, lesson_plan.source_id, lesson_plan.parent_id, lesson_plan.id, session.id)
      end
    end
    
    if lesson_plan.source_id == nil
          right_id=lesson_plan.right_id
          modified_license_name = License.select(:full_license_name).where(:id => right_id)
          url_license_modified=CompatibilityChart.url_licencia(right_id,params[:locale])
    else
          original_right_id = LessonPlan.find(lesson_plan.source_id).right_id
          original_license_name = License.select(:full_license_name).where(:id => original_right_id)
          url_license = CompatibilityChart.url_licencia(original_right_id,params[:locale])
          #license_name of modified work
          modified_right_id = lesson_plan.right_id
          modified_license_name = License.select(:full_license_name).where(:id => modified_right_id)
          url_license_modified = CompatibilityChart.url_licencia(modified_right_id,params[:locale])
    end
    
    if lesson_plan.author==nil #el current user es el autor
          aux_author=current_user.profile.first_name+' '+current_user.profile.last_name
          aux_author_URL=user_path(lesson_plan.user.id)
    else
          aux_author=lesson_plan.author
          aux_author_URL=ElementsHelper.ext_link(lesson_plan.author_URL)
    end
    
    
    if valido && valido_general
      @object=lesson_plan.save
      unless lesson_plan.parent_id.blank?
        lesson_plan.experience.right_id = lesson_plan.right_id
      end
      #@license=lesson_plan.license
      @license = Hash.new 
      @license["license_icon"] = lesson_plan.license.license_icon
      @license["right_id"]=lesson_plan.right_id
      @license["title"]=lesson_plan.title
      @license["author"]=aux_author
      @license["author_url"]=aux_author_URL
      @license["modified_license_name"]=modified_license_name.first.full_license_name
      @license["url_license_modified"]=url_license_modified
      @license["url_license"]=url_license
      #@license["lesson_plan_vector"]=vector_licenses_lp.nil? ? nil : vector_licenses_lp[activity.parent_id.to_s]
    end
    
    respond_with do |format|
      #format.json { render :json => {:url => lesson_plan.image.url} }
      if valido && valido_general
        #Se actualiza la fecha de updated_at del elemento que se está modificando y de todos sus padres.
        ReloadElementFields.reload_updated_at(lesson_plan)   
        
        if params[:campo]== "licenses" || params[:campo]=="author" || params[:campo]=="author_name" || params[:campo]=="author_URL" || params[:campo]=="known_CC_license"
          format.json { render :json => @license }
        else 
          format.json { render :json => {:url => lesson_plan.image.url} }
        end
      else
        case cambio_licencia_final
         when "4" #La licencia de la unidad didáctica no es compatible con las licencias de los recursos y/o actividades añadidas
           format.json {render :json => { :x => "lessonplan_condition1"  },:status => 403}
         when "5" #La licencia de la unidad didáctica clonada no es compatible con la licencia de la unidad didáctica original
           format.json {render :json => { :x => "lessonplan_condition2"  },:status => 403}
        #format.json { head :forbidden }
        end
      end
    end
  end

  api :GET, "/:locale/lesson_plans/:id", "Whole view"
  param_group :view, ElementsController
  example '[
    {
        "id": 1331,
        "title": "Copia de \"holita!\"",
        "private": true,
        "abstract": true,
        "image": "none",
        "description": "",
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
                "id": 1381,
                "parent_id": 1331,
                "position": 10
            },
            {
                "id": 1368,
                "parent_id": 1331,
                "position": 9
            },
            {
                "id": 1367,
                "parent_id": 1331,
                "position": 8
            },
            {
                "id": 1351,
                "parent_id": 1331,
                "position": 7
            },
            {
                "id": 1341,
                "parent_id": 1331,
                "position": 6
            },
            {
                "id": 1340,
                "parent_id": 1331,
                "position": 5
            },
            {
                "id": 1339,
                "parent_id": 1331,
                "position": 4
            },
            {
                "id": 1334,
                "parent_id": 1331,
                "position": 3
            },
            {
                "id": 1333,
                "parent_id": 1331,
                "position": 2
            },
            {
                "id": 1332,
                "parent_id": 1331,
                "position": 1
            }
        ]
    }
]'
  description '===Description
  This method returns the whole view of the element'
  def whole
    
  end

  ###########################################################################
  ##                   LESSON PLAN ADD ACTIVITY                            ##
  ###########################################################################
  
  api :POST, "/lesson_plans/:id/addElement", "Add Element"
  param_group :addElement, ElementsController
  description <<-EOS
  ===Description
    This function adds a new element. In this case, for Lesson Plan, you can add Technical Setting, Educational Setting and Activity, using the corresponding params
  EOS
  
  def x
  
  end
  
  api :GET, "/:locale/lesson_plans/:id/getRecords", "Get Records"
  param_group :getRecords, ElementsController
  formats ['json']
  example '[
    {
        "record_type": "Image",
        "title": "Titulo",
        "description": "Descripción",
        "created_at": "2014-12-10T10:36:47.000Z",
        "updated_at": "2014-12-10T10:38:43.000Z",
        "image": "/system/element_records/images/000/000/160/original/admin.png?1418207872"
    },
    {
        "record_type": "Snippet",
        "title": "Titulo!",
        "description": "Descripción!",
        "created_at": "2014-12-10T10:36:52.000Z",
        "updated_at": "2014-12-10T10:38:37.000Z",
        "text": "<iframe width=\"426\" height=\"216\" src=\"//www.youtube-nocookie.com/embed/aVh_XhwVPNg\" frameborder=\"0\" allowfullscreen=\"\"></iframe>"
    },
    {
        "record_type": "Idea",
        "title": "Titulo!",
        "description": "Descripción!",
        "created_at": "2014-12-10T10:36:59.000Z",
        "updated_at": "2014-12-10T10:38:27.000Z",
        "text": "Esto es una idea! Y como puedes ver, puedo escribir en negrita cuando quiero!"
    }
]'
  description '===Description
  This method returns the records from the element.'
  def getRec
    
  end
  
  ###########################################################################
  ##                      LESSON PLAN REMOVE RECORD                        ##
  ###########################################################################
  
  api :DELETE, "/:locale/lesson_plans/:id/deleteRecord", "Removed record"
  param_group :deleteRecord, ElementsController
  formats ['json', 'html']
  description '===Description
  This method delete a record from the element in which is content. Once it was delete, action could not go back.'
  def dltRe
  end
  
  def getTableView
    activities = LessonPlan.find(params[:id]).activities.where(:removed => false).sort_by{|e| e[:position]}
    vector_hash = CompatibilityChart.create_vectors(activities)
    
    respond_with do |format|
      format.html { render :partial => "activities/html/table_view", :collection => activities, :locals => {:vector_licenses => vector_hash, :contents => true, :created => params[:created] == "true" ? true:false, :positions => activities, :experience => params[:experience] == true ? true:false} }
    end
    
  end
  
  def getListView
    activities = LessonPlan.find(params[:id]).activities.where(:removed => false).sort_by{|e| e[:position]}
    vector_hash = CompatibilityChart.create_vectors(activities)
        
    respond_with do |format|
      format.html { render :partial => "activities/html/form", :collection => activities, :locals => {:vector_licenses => vector_hash, :contents => true, :created => params[:created] == "true" ? true:false, :positions => activities, :experience => params[:experience] == true ? true:false} }  
    end
    
  end
  
  api :GET, "/:locale/lesson_plans/:id/getComments", "Get Comments"
  param_group :getComments, ElementsController
  formats ['json', 'html']
  description '===Description
  This method returns the comments from the element.'
  def gtCmmnts
    
  end
  
  api :POST, "/:locale/lesson_plans/:id/setComments", "Set Comments"
  param_group :setComments, ElementsController
  formats ['json', 'html']
  description '===Description
  This method returns the comments from the element in wich will be added the new comment.'
  def stCmmnts
    
  end
    
  
end
