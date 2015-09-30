# -*- coding: utf-8 -*-
class EventsController < ResourcesController
  private
  
  #########################################################
  ##  AÑADIMOS DESPUES PERMISO A DETERMINADAS ACCIONES   ##
  ##      PARA QUE PUEDAN SER USADAS POR INVITADOS       ##
  #########################################################
  
  before_filter :authenticate_user!, :except => [:index,:search, :getMiniView, :getSmallView, :show, :getWholeView]
  
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
  
  
  ###########################################################################
  ##                       EVENTS DUPLICATE                                ##
  ###########################################################################
  
  api :POST, "/events/duplicate.json", "Duplica un event"
  param :id, Fixnum, :desc => "Id del event que se quiere duplicar", :required => true
  formats ['json']
   example '{
    "id": 274
}'
  def w
    
  end
  
  api :GET, "/:locale/events/:id/getComments", "Get Comments"
  param_group :getComments, ElementsController
  formats ['json', 'html']
  description '===Description
  This method returns the comments from the element.'
  def gtCmmnts
    
  end
  
  api :POST, "/:locale/events/:id/setComments", "Set Comments"
  param_group :setComments, ElementsController
  formats ['json', 'html']
  description '===Description
  This method returns the comments from the element in wich will be added the new comment.'
  def stCmmnts
    
  end
  
end
