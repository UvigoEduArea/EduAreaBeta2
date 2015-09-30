# -*- coding: utf-8 -*-
class SubjectsController < ElementsController
  
  private
  
  #########################################################
  ##      PROTEGEMOS PRIMERO LAS ACCIONES CONTRA         ## 
  ##        USUARIOS QUE INTENTEN MODIFICAR DATOS        ##
  ##           DE LOS QUE NO SON PROPIETARIOS            ##
  #########################################################
  
  before_filter :require_owner, :only => [:update, :edit,:destroy,:duplicate, :addToLibrary,:show,:getWholeView]
  
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
      if user_signed_in? #Para los casos de update, edit, destroy, addToLibrary
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
   
  before_filter :authenticate_user!, :except => [:index,:search, :getMiniView, :getSmallView, :show, :getWholeView]

  
  public
  
  ###########################################################################
  ##                       SUBJECTS INDEX                                  ##
  ###########################################################################
  
  # GET /subject
  # GET /subject.json

  def x
    
  end
  
  ###########################################################################
  ##                        SUBJECTS CREATE                                ##
  ###########################################################################
  

  def y
    
  end
  
  ###########################################################################
  ##                        SUBJECT DELETE                                 ##
  ###########################################################################

  
  def z
    
  end
  
  ###########################################################################
  ##                       SUBJECTS DUPLICATE                              ##
  ###########################################################################
  

  def w
    
  end

  ###########################################################################
  ##                          SUBJECTS UPDATE                              ##
  ###########################################################################

  def update
    subject = Subject.find(params[:id])
    case params[:campo]
      
      when 'title'
        subject.title = params[:contenido]   
      when 'description'
        subject.description = params[:contenido]
      when 'private'
        subject.private = params[:contenido]
      when 'image'
        subject.image = params[:element_image]
    end
    @object=subject.save
    respond_with do |format|
      format.json { render :json => {:url => subject.image.url} }
    end
end

end

