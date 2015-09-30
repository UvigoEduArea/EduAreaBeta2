# -*- coding: utf-8 -*-
class ActivitiesController < ElementsController
    
  private
  
  #########################################################
  ##      PROTEGEMOS PRIMERO LAS ACCIONES CONTRA         ## 
  ##        USUARIOS QUE INTENTEN MODIFICAR DATOS        ##
  ##           DE LOS QUE NO SON PROPIETARIOS            ##
  #########################################################

  before_filter :require_owner, :only => [:addInvolvements,:removeInvolvements,:update, :edit,:destroy,:duplicate, :addToLibrary,:show,:getWholeView]
  
  def require_owner

    @object_id = params[:id]
    @object = Element.find(@object_id)
   
    case params[:action]
    when 'duplicate'
      unless @object.removed
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
        flash[:error] = "The element is removed"
      end
     when 'getWholeView', 'show'
       unless @object.removed  
         if user_signed_in?
            
          unless (@object.private == false)||((@object.private == true)&&(current_user.id == @object.creator_id))||((@object.private == true)&&(current_user.type == "Student"))
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
        flash[:error] = "The element is removed"
        unless params[:format] == 'json' 
          redirect_to :action => :index
        else
          respond_with do |format|
            format.json{head :forbidden}
          end
        end
      end
    else #AQUI SE PONE EL DEFAULT DEL SWITCH
      unless @object.removed 
        if user_signed_in? #Para los casos de addInvolvements, removeInvolvements, update, edit, destroy, addToLibrary
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
      else
        flash[:error] = "The element is removed"
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
  
  before_filter :authenticate_user!, :except => [:index,:search, :getMiniView, :getSmallView, :getTemplates, :show, :getWholeView, :getSections, :changeModeView]
  
  
  public
  
  ###########################################################################
  ##                   ACTIVITIES INDEX                                    ##
  ###########################################################################
  
  # GET /activities
  # GET /activities.json
  api :GET, "/activities", "Index"
  param_group :index, ElementsController
  formats ['json', 'html']
  example '[
    {
        "id": 362
    },
    {
        "id": 363
    },
    {
        "id": 364
    },
    {
        "id": 365
    }
]'
  description '===Description
  This function return the ids of the activities of the index'
  
  def ind
    
  end
  
  ###########################################################################
  ##                   ACTIVITIES CREATE                                   ##
  ###########################################################################
  
  api :POST, "/activities.json", "Create"
  param_group :create, ElementsController
  description '===Description
  This method creates a new element. Returns the id of the new element'
  formats ['json','html']
   example '[
    {
        "id": 362
    }
]'

  def cre
  
  end

 
  
  ###########################################################################
  ##                   ACTIVITIES DELETE                                   ##
  ###########################################################################
  
  api :DELETE, "/activities.json", "Destroy"
  param_group :destroy, ElementsController
  formats ['json', 'html']
  description '===Description
  This method removes the element. Once the elimination is done, this method redirects you to the previus page.'
   
  def des
    
  end
  
  ###########################################################################
  ##                   ACTIVITIES DUPLICATE                                ##
  ###########################################################################
  
  api :POST, "/activities/duplicate.json", "Duplicate"
  param_group :duplicate, ElementsController
  formats ['json', 'html']
  example '{
    "id": 274
}'
  description '===Description
  This method duplicates an element. Once it is duplicated, the method returns the new id.'
  def dup
    
  end

  ###########################################################################
  ##                   ACTIVITIES GET TEMPLATES                            ##
  ###########################################################################
  
  api :GET, "/activities/getTemplates.json", "Get Templates"
  param_group :locale, ElementsController
  description '===Description
  The method returns the id of the templates for activities.'
  example '[
    {
        "id": 674
    }
]'

  def getTemplates 
    @object = ActivityTemplate.where(:language => params[:locale], :private => false, :removed => false)
    
    respond_with do |format|
      format.json{ render "/layouts/json/sendObjectId" }
    end
  end
  
  api :GET, "/activity_templates/:id", "Activity Templates view"
  param_group :view, ElementsController
  example '[
    {
        "id": 674,
        "title": "",
        "description": "",
        "boxes": [
            {
                "id": 1,
                "title": "",
                "description": "",
                "position": "left",
                "type": "BFTI",
                "data_type": "",
                "data_boxes": []
            },
            {
                "id": 2,
                "title": "",
                "description": "",
                "position": "right",
                "type": "BEI",
                "data_type": "Device",
                "data_boxes": []
            }
        ]
    }
]'
  formats ['json']
  description '===Description
  This method returns the whole view of the template. Take care about the URL, in this case is "activity_templates"!'
  def tempView
    
  end
    
  ###########################################################################
  ##                ACTIVITIES ADD TO LIBRARY                              ##
  ###########################################################################
  api :POST, "/activities/:id/addToLibrary", "Add to library"
  param_group :addToLibrary, ElementsController
  description '===Description
  This method moves to the lirary the element that is contained in other element. The method returns the new id.'
  example '{
    "id": 1252
}'
  def aa
    
  end
  
  
  
  ###########################################################################
  ##                      ACTIVITIES UPDATE                                ##
  ###########################################################################
  api :PATCH, "/activities/:id.json", "Update"
  param :id, Fixnum, :desc => "Id of the element to update", :required => true
  param :campo, String, :desc => "Name of the field to update", :required => true, :meta => ['title', 'description', 'private', 'image', 'imagenone','content_value', 'data_boxes', 'textarea', 'abstract']
  param :contenido, Fixnum, :desc => "Content of the field to be updated. The content type depends on the field to update", :required => true
  param :data_box, Fixnum, :desc => "Id of the databa box to update", :required => true, :meta => {"Used with fields" => ['content_value', 'data_boxes', 'textarea']}
  description <<-EOS
  ===Description
    This method updates de element corresponding to the id. If all is ok, the method returns the header HTTP 200 OK.
  ====Explanation of parameters
    - The parameter campo is a field identificator parameter.
    - The parameter contenido contains the data of the parameter campo. For example 'title': 'This is a title!' -> campo = title & contenido = This is a title!. 
    - The parameter data_box is used to update the content of a data box from the template
  EOS
  def update
    activity = Activity.find(params[:id])
    valido = true
    valido_general = true
    cambio_licencia_final="0"
        
    case params[:campo]
      
      when 'title'
        activity.title = params[:contenido]  
      when 'description'
        activity.description = params[:contenido]
        callAdega(activity)
      when 'description_student'
        activity.description_student = params[:contenido]
      when 'private'
        activity.private = params[:contenido]
      when 'image'
        activity.image = params[:contenido]
      when 'imagenone'
        activity.image = nil
      when 'content_value', 'data_boxes', 'textarea'
        data_box = DataBox.find(params[:data_box])
        data_box.content_value = params[:contenido]
        data_box.save
      when 'abstract'
        activity.abstract = params[:contenido] unless params[:contenido].blank?
      when 'licenses'
        if activity.source_id == nil #aqui entra si actividad es original (no clonada) o cuando añadimos actividad nueva a un lesson plan y le queremos cambiar la licencia
              #comprobamos que la licencia que hemos elegido es compatible con los recursos añadidos
              right_id = CompatibilityChart.construct_right_id(params[:commercial],params[:derivative],params[:condition])
              valido = CompatibilityChart.license_change_compatibility(params[:commercial],params[:derivative],params[:condition],params[:vector_licenses],activity.creator_id,current_user.id)
              aux_right_id=activity.right_id #right_id inicial
              if !valido
                cambio_licencia_final="1"
              end 
              if valido && activity.parent_id != nil #Tenemos una actividad añadida al lesson plan y le queremos cambiar la licencia de la actividad
                  activity.right_id=right_id
                  activity.save
                  parent_right_id = LessonPlan.find(activity.parent_id).right_id
                  #Crear vector_licenses
                  lesson_plan=Element.find(activity.parent_id)
                  vector_licenses_lp=CompatibilityChart.create_vectors(Array.new.push(lesson_plan))
                  valido_general = CompatibilityChart.check_compatibility(vector_licenses_lp[lesson_plan.id.to_s],activity.right_id,parent_right_id,activity.creator_id,current_user.id)
                  if valido_general == false
                      activity.right_id=aux_right_id
                      cambio_licencia_final="2"
                  end
              else
                if valido
                    activity.right_id=right_id
                    activity.save
                end
              end 
                 
        else #Si source_id != nil, estamos ante una actividad clonada o una actividad añadida de la library al lesson plan(que puede ser mía o de otro)
            right_id = CompatibilityChart.construct_right_id(params[:commercial],params[:derivative],params[:condition])
            #Comprobamos que licencia que queremos cambiar es compatible con los recursos incluidos
            valido = CompatibilityChart.license_change_compatibility(params[:commercial],params[:derivative],params[:condition],params[:vector_licenses],activity.creator_id,current_user.id)
            aux_right_id=activity.right_id #right_id inicial
            if !valido
               cambio_licencia_final="1"
            end
            if valido && activity.parent_id != nil #activity de la library añadida al lesson plan -> ver si licencia es compatible con lesson plan
                  activity.right_id=right_id
                  activity.save
                  lesson_plan=Element.find(activity.parent_id)
                  parent_right_id = lesson_plan.right_id
                  #Tenemos una actividad añadida al lesson plan y le queremos cambiar la licencia de la actividad
                  #Crear vector_licenses
                  vector_licenses_lp=CompatibilityChart.create_vectors(Array.new.push(lesson_plan))
                  valido_general = CompatibilityChart.check_compatibility(vector_licenses_lp[lesson_plan.id.to_s],activity.right_id,parent_right_id,activity.creator_id,current_user.id)
                  if valido_general == false
                      params[:source]=false;
                      activity.right_id=aux_right_id
                      activity.save
                      cambio_licencia_final="2"
                  end
            else #es una actividad clonada de otra actividad
                  #Comprobamos si licencia del elemento clonado es compatible con la licencia original
                  #license_id=Activity.find(activity.source_id).right_id
                  license_id=activity.original_license_id
                  valido_general = CompatibilityChart.licencia_clonar_elemento(license_id,params[:commercial],params[:derivative],params[:condition])
                  if valido_general
                    activity.right_id = right_id
                  else
                    cambio_licencia_final="3"
                  end
            end    
        end
      when 'author'
         if (params[:contenido] == "true" )  #Si el usuario es el autor => meter en element.author el first_name and last_name del current_user
             #element.author=  current_user.profile.first_name + ' ' +current_user.profile.last_name
             activity.author=nil
             activity.author_URL=nil
             #element.author_URL= element.author_URL
         else
             activity.author=""
             activity.author_URL=""
         end
      when 'author_name'   
          activity.author = params[:contenido]
      when 'author_URL'
          activity.author_URL = params[:contenido]
      when 'known_CC_license'   
          if params[:contenido]=="false"
              activity.right_id=8
          else
              vector = CompatibilityChart.create_vectors(Array.new.push(activity))
              license = CompatibilityChart.check_license_true(vector[activity.id.to_s], true)
              if license
                activity.right_id = License.where(:name => license).first.id
              else
                activity.right_id = current_user.profile.right_id
              end
          end
           
    end #del case
    
    if valido && valido_general
      activity.save
    end
    @object=activity
    
    if activity.source_id == nil
          right_id=activity.right_id
          modified_license_name = License.select(:full_license_name).where(:id => right_id)
          url_license_modified=CompatibilityChart.url_licencia(right_id,params[:locale])
    else
          original_right_id = Activity.find(activity.source_id).right_id
          original_license_name = License.select(:full_license_name).where(:id => original_right_id)
          url_license = CompatibilityChart.url_licencia(original_right_id,params[:locale])
          #license_name of modified work
          modified_right_id = activity.right_id
          modified_license_name = License.select(:full_license_name).where(:id => modified_right_id)
          url_license_modified = CompatibilityChart.url_licencia(modified_right_id,params[:locale])
    end
    if activity.author==nil #el current user es el autor
          aux_author=current_user.profile.first_name+' '+current_user.profile.last_name
          aux_author_URL=user_path(activity.user.id)
    else
          aux_author=activity.author
          aux_author_URL=ElementsHelper.ext_link(activity.author_URL)
    end
    @license = Hash.new 
    respond_with do |format|
      if valido && valido_general
        #Se actualiza la fecha de updated_at del elemento que se está modificando y de todos sus padres.
        ReloadElementFields.reload_updated_at(@object)   
        
        if params[:campo]== "licenses" || params[:campo]=="author" || params[:campo]=="author_name" || params[:campo]=="author_URL" || params[:campo]=="known_CC_license"
          @license["license_icon"] = activity.license.license_icon
          @license["lesson_plan_vector"]=vector_licenses_lp.nil? ? nil : vector_licenses_lp[activity.parent_id.to_s]
          @license["title"]=activity.title
          @license["author"]=aux_author
          @license["author_url"]=aux_author_URL
          @license["modified_license_name"]=modified_license_name.first.full_license_name
          @license["url_license_modified"]=url_license_modified
          @license["url_license"]=url_license
          @license["right_id"]=activity.right_id
          format.json { render :json => @license }
        else 
          format.json { render :json => {:url => activity.image.url} }
        end
      else
         case cambio_licencia_final
         when "1" #La licencia de la actividad no es compatible con las licencias de los recursos añadidos
           format.json {render :json => { :x => "activity_condition1"  },:status => 403}
         when "2" #La licencia de la actividad no es compatible con la licencia de la unidad didáctica
           format.json {render :json => { :x => "activity_condition2"  },:status => 403}
         when "3" #La licencia de la actividad clonada no es compatible con la licencia de la actividad original
           format.json {render :json => { :x => "activity_condition3"  },:status => 403}
         end
      end
    end
  end
  
  api :GET, "/activities/:id/mini", "Mini view"
  param_group :view, ElementsController
  formats ['json']
  example '[
    {
        "id": 1252,
        "title": "",
        "private": false,
        "abstract": false,
        "image": "none"
    }
]'
  description '===Description
  This method returns the small view of the element.'
  def mini
    
  end
  
  api :GET, "/activities/:id/small", "Small view"
  param_group :view, ElementsController
  example '[
    {
        "id": 1252,
        "title": "",
        "private": false,
        "abstract": false,
        "image": "none",
        "description": ""
    }
]'
  description '===Description
  This method returns the mini view of the element.'
  def small
    
  end
  
  api :GET, "/activities/:id", "Whole view"
  param_group :view, ElementsController
  example '[
    {
        "id": 1252,
        "title": "",
        "private": false,
        "abstract": false,
        "image": "none",
        "description": "",
        "template": {
            "id": 674,
            "boxes": [
                {
                    "id": 1,
                    "title": "",
                    "description": "",
                    "position": "left",
                    "type": "BFTI",
                    "data_type": "",
                    "data_boxes": []
                },
                {
                    "id": 2,
                    "title": "",
                    "description": "",
                    "position": "right",
                    "type": "BEI",
                    "data_type": "Device",
                    "data_boxes": []
                }
            ]
        }
    }
]'
  description '===Description
  This method returns the whole view of the element.'
  def whole
    
  end
  
  api :GET, "/:locale/activities/:id/getRecords", "Get Records"
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
  
  api :DELETE, "/:locale/activities/:id/deleteRecord", "Remove record"
  param_group :deleteRecord, ElementsController
  formats ['json', 'html']
  description '===Description
  This method delete a record from the element in which is content. Once it was delete, action could not go back.'
  def dltRe
  end
  
  api :GET, "/:locale/activities/:id/getComments", "Get Comments"
  param_group :getComments, ElementsController
  formats ['json', 'html']
  description '===Description
  This method returns the comments from the element.'
  def gtCmmnts
    
  end
  
  api :POST, "/:locale/activities/:id/setComments", "Set Comments"
  param_group :setComments, ElementsController
  formats ['json', 'html']
  description '===Description
  This method returns the comments from the element in wich will be added the new comment.'
  def stCmmnts
    
  end
  
  
  
end
