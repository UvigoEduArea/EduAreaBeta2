# -*- coding: utf-8 -*-
class ResourcesController < ElementsController
  
  private
  
  #########################################################
  ##      PROTEGEMOS PRIMERO LAS ACCIONES CONTRA         ## 
  ##        USUARIOS QUE INTENTEN MODIFICAR DATOS        ##
  ##           DE LOS QUE NO SON PROPIETARIOS            ##
  #########################################################

  before_filter :require_owner, :only => [:update]
  
  def require_owner

    @object_id = params[:id]
    
    if user_signed_in?
        @object = Element.find(@object_id)
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

  public
  # element.image.url
  
  api :GET, "/resources/:id", "Whole view"
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
  
  
  
  def update
    element = Element.find(params[:id])
   
    case params[:campo]
      
      when 'title'
        element.title = params[:contenido]   
      when 'description'
        element.description = params[:contenido]
        callAdega(element)
      when 'private'
        element.private = params[:contenido]
      when 'image'
        element.image = params[:contenido]
      when 'imagenone'
        element.image = nil 
      when 'URL'
        element.URL = params[:contenido]
      when 'abstract'
        element.abstract = params[:contenido] unless params[:contenido].blank?
      when 'licenses'
          if (params[:commercial]  == "1") and (params[:derivative] == "1") #CC-BY 
            element.right_id = "1"
          end
          if (params[:commercial]  == "1") and (params[:derivative] == "2") #CC-BY-SA
            element.right_id = "2"
          end
          if (params[:commercial]  == "0") and (params[:derivative] == "1") #CC-BY-NC
            element.right_id = "3"
          end
          if (params[:commercial]  == "0") and (params[:derivative] == "2") #CC-BY-NC-SA 
            element.right_id = "4"
          end
          if (params[:commercial]  == "1") and (params[:derivative] == "0") #CC-BY-ND 
            element.right_id = "5"
          end
          if (params[:commercial]  == "0") and (params[:derivative] == "0") #CC-BY-NC-ND 
            element.right_id = "6"
          end
          if ((params[:commercial]  == "1") and (params[:derivative] == "1")) and (params[:condition] == "2") #CC0 Public Domain
          element.right_id = "7"
          end
      when 'author'
          if (params[:contenido] == "true" )
              element.author=nil
              element.author_URL=nil
          else
              element.author=""
              element.author_URL=""
          end
      when 'author_name'   
          element.author = params[:contenido]
      when 'author_URL'
          element.author_URL = params[:contenido]
      when 'known_CC_license'
          if params[:contenido]=="false" and element.authorization_license == 0
              element.right_id=8
          else
              if (element.authorization_license == 0 or params[:contenido]=="true")
                element.right_id=current_user.profile.right_id
                #element.right_id = params[:right_id]
              else
                element.right_id=9
              end
          end
      when 'authorization_license'
        #Para contenido que tiene copyright
          if params[:contenido]=="true"
              element.authorization_license=1
              element.right_id =9
          else
              element.authorization_license=0
              element.right_id=8
          end
       when 'document'
         if params[:new] == "false"
           @append = ResourcesAppend.find(params[:append_id])
           @append.document = params[:contenido]
           @append.type_append = params[:type]
           @append.save
         else
           new_document = ResourcesAppend.new
           new_document.resource_id = element.id
           new_document.document = params[:contenido]
           new_document.type_append = params[:type]
           new_document.save
           @append = new_document
         end
       when 'snippet'
          if params[:new] == "false"
            @append = ResourcesAppend.find(params[:append_id])
            @append.snippet_url = params[:contenido]
            @append.save
          else
            new_snippet = ResourcesAppend.new
            new_snippet.resource_id = element.id
            new_snippet.snippet_url = params[:contenido]
            new_snippet.type_append = params[:type]
            new_snippet.save
            @append = new_snippet
          end
    end
     #Si las fechas de creacion y de actualizacion no coinciden es que el elemento ya ha sido actualizado (Adaptado) antes
    #Si coinciden, es la primera actualizacion y habra que cambiar la entrada Adopt de usages por Adapt, siempre y cuando exista esa entrada Adopt
    if ((element.updated_at.tv_sec - element.created_at.tv_sec == 0) || (element.updated_at.tv_sec - element.created_at.tv_sec == 1)) 
      Usage.changeStatus(current_user.id, element.source_id, element.parent_id, element.id, session.id)
    end
    element.save
    
    if element.type == "Content"
      if element.source_id == nil
            right_id=element.right_id 
            modified_license_name = License.select(:full_license_name).where(:id => right_id) #cogemos nombre de licencia correspondiente al right_id
            url_license_modified=CompatibilityChart.url_licencia(right_id,params[:locale]) #cogemos Creative Commons url correspondiente al right_id
      else
            original_right_id = Element.find(element.source_id).right_id
            original_license_name = License.select(:full_license_name).where(:id => original_right_id)
            url_license = CompatibilityChart.url_licencia(original_right_id,params[:locale])
            modified_right_id = element.right_id #license_name of modified work
            modified_license_name = License.select(:full_license_name).where(:id => modified_right_id)
            url_license_modified = CompatibilityChart.url_licencia(modified_right_id,params[:locale])
      end
      
      if element.author==nil #el current user es el autor
            aux_author=current_user.profile.first_name+' '+current_user.profile.last_name
            aux_author_URL=user_path(element.user.id)
      else
            aux_author=element.author
            aux_author_URL=ElementsHelper.ext_link(element.author_URL)
      end
      
      @license = Hash.new 
      @license["license_icon"] = element.license.license_icon
      @license["authorization_license"] = element.authorization_license
      @license["right_id"]=element.right_id
      @license["title"]=element.title
      @license["author"]=aux_author
      @license["author_url"]=aux_author_URL
      @license["modified_license_name"]=modified_license_name.first.full_license_name
      @license["url_license_modified"]=url_license_modified
      @license["url_license"]=url_license
    end
    
    #Se actualiza la fecha de updated_at del elemento que se está modificando y de todos sus padres.
    ReloadElementFields.reload_updated_at(element)   
   
    respond_with do |format|
       if params[:campo]== "licenses" || params[:campo]=="author" || params[:campo]=="author_name" || params[:campo]=="author_URL" || params[:campo]=="known_CC_license" || params[:campo]=="authorization_license" 
                 format.json { render :json => @license }
      else 
        format.html{ render :partial => "/contents/html/appends", :object => @append, :locals => {:created => true}}
        format.json { render :json => {:url => element.image.url} }
      end
    end
  end
end
