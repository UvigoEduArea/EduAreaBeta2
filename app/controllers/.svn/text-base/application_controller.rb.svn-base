# -*- coding: utf-8 -*-
class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.

  #protect_from_forgery with: :exception
  
  #protect_from_forgery with: :exception
  #####################################################
  # EL SIGUIENTE REQUIRE ES PARA LA EVENT MACHINE
  # ESTA EVENT MACHINE CREA HILOS NUEVOS ASÍNCRONOS 
  #####################################################
  require 'em-http-request'
  
  #####################################################
  # ESTOS DOS REQUIRES SON NECESARIOS PARA QUITAR UN 
  # FRAME DE LOS VIDEOS DE LOS RECORDS
  #####################################################
  require 'rubygems'
  require 'streamio-ffmpeg'
  #####################################################
  
  #####################################################
  # DECLARACIÓN DE QUE TIPÒS DE RESPUESTA VAMOS A DAR
  # ES NECESARIO PARA UTILIZAR respond_with
  #####################################################
  respond_to :json, :html
  #####################################################
  
  #####################################################
  # LAS SIGUIENTES LÍNEAS CONFIGURAN LA GESTIÓN
  # DEL IDIOMA Y ESTABLECEN EL LOCALE POR DEFECTO 
  #####################################################
  
  before_filter :set_locale
  #before_filter :authenticate_user!, :except => [:index]
  
  #######################################################
  ##### RECONFIGURANDO URL DE RETORNO PARA LA DEVISE ####
  #######################################################
  
  # LA EXPLICACIÓN ES QUE TRAS EL SIGN_UP O EL SIGN_IN
  # LA GEMA DEVISE ACUDE A after_sign_up_path_for Y ESTA
  # A after_sign_in_path_for. ESTA ÚLTIMA ES LA QUE HAY
  # QUE MODIFICAR, Y SE HACE DE LA SIGUIENTE MANERA PORQUE ACUDE A:
  # CHANGELOG.md:  * after_sign_in_path_for now redirects to session[scope_return_to] if any value is stored in it
   
  # PRIMERO INCLUIMOS LA FUNCIÓN STORE_LOCATION PARA SER USADA
  # ANTES DE EJECUTAR CUALQUIER ACCIÓN
   
  before_filter :store_location
  
  # SALVO QUE ESTEMOS EN EL CONTROLLER SESSIONS DE LA GEMA DEVISE
  # CONFIGURAMOS LA URL DE RETORNO A HOME_PATH
  def store_location
    unless params[:controller] == "devise/sessions"
      session[:user_return_to] = home_path #ESTA ES LA LÍNEA CLAVE
    end
  end

  def stored_location_for(resource_or_scope)
    session[:user_return_to] || super
  end

  def after_sign_in_path_for(resource)
    stored_location_for(resource) || root_path #SI NO ESTUVIERA CONFIGURADA, VOLVEMOS A ROOT_PATH, QUE EN NUESTRO CASO ES LA LANDING
  end
  
  def set_locale
    I18n.locale = params[:locale] || I18n.default_locale
    params[:locale] = I18n.locale.to_s
    
  end
  
  #######################################################
  #######################################################
  #######################################################
  # Every helper method will include the URL in the query string
  def default_url_options(options={})
    logger.debug "default_url_options is passed options: #{options.inspect}\n"
    { :locale => I18n.locale }
  end
  
  def self.default_url_options
  { :locale => I18n.locale }
  end 

  #####################################################
  
  def getView(controller, ids)
    if controller != "resources" and controller != "submissions"
      array = Array.new
      ids.split(",").each do |id|
        array.push(controller.find(id))
      end
    else
      array = Array.new
      ids.split(",").each do |id|
        array.push(Element.find(id))
      end
    end
    
    return array
  end
  
end
