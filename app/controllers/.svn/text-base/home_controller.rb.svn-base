# -*- coding: utf-8 -*-
class HomeController < ApplicationController
  include Filter
  
  def x
    render "home/prueba"
  end
  
  # GET /activities
  # GET /activities.json
  api :GET, "/activities.json", "Devuelve el indice de todas las activities del sistema"
  param :page, Fixnum, :desc => "Parametro necesario para indicar el numero de pagina que quiere visitar", :required => false
  param :activities_number, Fixnum, :desc => "Parametro que especifica el numero de actividades a enviar por pagina. Por defecto 15", :required => false
  formats ['json']
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
  description <<-EOS
  ===Description  
    Esta funcion devuelve los indices de todas las activities del sistema que no sean privadas o esten eliminadas.
  EOS
  
  def landing
    render layout: "landing_layout"
  end
  def landing_extended
    render layout: "landing_layout"
  end
  def index
    if user_signed_in? && current_user.type != "Student" 
        id_usuario = current_user.id

        @activities = Activity.where("(removed = false and library = true and language = '"+params[:locale]+"') and (private = false or (private = true and creator_id = '"+id_usuario.to_s+"'))").order("updated_at DESC LIMIT 4")
        @lessonplans= LessonPlan.where("(removed = false and library = true and language = '"+params[:locale]+"') and (private = false or (private = true and creator_id = '"+id_usuario.to_s+"'))").order("updated_at DESC LIMIT 4")
      #  @subjects = Subject.where("(removed = false and library = true and language = '"+params[:locale]+"') and (private = false or (private = true and creator_id = '"+id_usuario.to_s+"'))").order("updated_at DESC LIMIT 4")
        @resources = Resource.where("(removed = false and library = true and language = '"+params[:locale]+"') and (private = false or (private = true and creator_id = '"+id_usuario.to_s+"'))").order("updated_at DESC LIMIT 4")
    else 
        if !user_signed_in?
          id_usuario = nil
        end
        @activities = Activity.where("(removed = false and library = true and language = '"+params[:locale]+"') and (private = false)").order("updated_at DESC LIMIT 4")
        @lessonplans= LessonPlan.where("(removed = false and library = true and language = '"+params[:locale]+"') and (private = false)").order("updated_at DESC LIMIT 4")
       # @subjects = Subject.where("(removed = false and library = true and language = '"+params[:locale]+"') and (private = false)").order("updated_at DESC LIMIT 4")
        @resources = Resource.where("(removed = false and library = true and language = '"+params[:locale]+"') and (private = false)").order("updated_at DESC LIMIT 4")
    end
   
   
  end
  
  def filter
    if user_signed_in? && current_user.type != "Student" 
      params[:logged]='true'
      params[:current_user]=current_user.id
    else
      params[:logged]='false'
    end
    
    if params[:commit]=="Search"
      filter_object=FilterObject.new(params)
      filter_object.filter_simple
      
      @elements = filter_object.getOutput
      @resources = @elements.where('type IN (?)', ['Application', 'Device', 'Event', 'Content', 'Collaborator'])
      @activities = @elements.where("type='Activity'")
      @lesson_plans=@elements.where("type='LessonPlan'")
      @experience=@elements.where("type='Experience'")
      @boards=@elements.where("type='Board'")
        
      respond_to do |format|
        format.html { render "home/filter_results"}
      end
    else
      if params[:type_form]=='simple_filter'
        respond_with do |format|
          format.html { render "home/filter"}
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

  
end
