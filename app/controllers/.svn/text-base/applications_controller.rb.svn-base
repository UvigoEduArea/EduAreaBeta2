# -*- coding: utf-8 -*-
class ApplicationsController < ResourcesController
  
  private
  
  #########################################################
  ##  AÑADIMOS DESPUES PERMISO A DETERMINADAS ACCIONES   ##
  ##      PARA QUE PUEDAN SER USADAS POR INVITADOS       ##
  #########################################################
  
  before_filter :authenticate_user!, :except => [:index,:search, :getMiniView, :getSmallView, :show, :getWholeView, :filter]
  
  #########################################################
  ##      PROTEGEMOS PRIMERO LAS ACCIONES CONTRA         ## 
  ##        USUARIOS QUE INTENTEN MODIFICAR DATOS        ##
  ##           DE LOS QUE NO SON PROPIETARIOS            ##
  #########################################################

  before_filter :require_owner, :only => [:edit,:destroy,:duplicate, :addToLibrary,:show,:getWholeView]#FALTA HACER EL METODO PARA UPDATE!!!!!!!!!!!
  
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
    else 
      if user_signed_in? #Para los casos de edit, destroy, addToLibrary, create
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
  
  public
  
  api :GET, "/applications", "Index"
  param_group :index, ElementsController
  formats ['json', 'html']
  example '[
    {
        "id": 1236
    }
]'
  description '===Description
  This method returns the ids of the index of the applications.'
  def in
    
  end
  
  api :POST, "/applications", "Create"
  param_group :locale, ElementsController
  example '{
    "id": 1257
}'
  description '===Description
  This method creates a new element. Once it is created, the method returns the new id of it.'
  formats ['json','html']
  def cre
    
  end
  
  api :DELETE, "/applications/:id", "Delete"
  param_group :destroy, ElementsController
  formats ['json','html']
  description '===Description
  This method removes the selected element. If everything is OK, responds with HTTP header 200 OK.'
  def des
    
  end
  
  api :POST, "/applications/duplicate", "Duplicate"
  param_group :duplicate, ElementsController
  formats ['json','html']
  example '{
    "id": 1258
}'
  description '===Description
  This method duplicates a given element. It returns the id of the duplicated element.'
  def dup
    
  end
  
  api :PATCH, "/applications/:id", "Update"
  param_group :locale, ElementsController
  param :id, Fixnum, :desc => "Id of the element to be updated", :required => true
  param :campo, Fixnum, :desc => "Type of the element field to be updated", :required => false, :meta => ["title", "description", "private", "abstract", "image", "imagenone", "URL"]
  param :contenido, String, :desc => "Content of the element field named by parameter campo", :required => false, :meta => ["text", "images - jpeg, png, jpg"]
  description '===Description
  This method updates the element. If everything is OK it responds with HTTP header 200 OK'
  def upd
    
  end
  
  api :GET, "/applications/:id/mini", "Mini view"
  param_group :view, ElementsController
  example '[
    {
        "id": 1236,
        "title": "App nueva!",
        "private": true,
        "abstract": true,
        "image": "none"
    }
]'
  description '===Description
  This method returns the mini view of the element'
  formats ['json']
  def mini
    
  end
  
  api :GET, "/applications/:id/small", "Small view"
  param_group :view, ElementsController
  example '[
    {
        "id": 1236,
        "title": "App nueva!",
        "private": true,
        "abstract": true,
        "image": "none",
        "description": ""
    }
]'
  description '===Description
  This method returns the small view of the element'
  formats ['json']
  def small
    
  end
  
  api :GET, "/applications/:id", "Whole view"
  param_group :view, ElementsController
  example '[
    {
        "id": 1236,
        "title": "App nueva!",
        "private": true,
        "abstract": true,
        "image": "none",
        "description": "",
        "URL": ""
    }
]'
  description '===Description
  This method returns the whole view of the element'
  formats ['json']
  def whole
    
  end
  
  api :GET, "/:locale/applications/:id/getComments", "Get Comments"
  param_group :getComments, ElementsController
  formats ['json', 'html']
  description '===Description
  This method returns the comments from the element.'
  def gtCmmnts
    
  end
  
  api :POST, "/:locale/applications/:id/setComments", "Set Comments"
  param_group :setComments, ElementsController
  formats ['json', 'html']
  description '===Description
  This method returns the comments from the element in wich will be added the new comment.'
  def stCmmnts
    
  end
  
end
