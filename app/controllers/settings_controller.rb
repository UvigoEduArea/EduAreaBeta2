class SettingsController < ElementsController
  
  def update
    setting = params[:controller].singularize.camelize.constantize.find(params[:id])
    case params[:campo]
    when "title"
      setting.title = params[:contenido]
    when "description"
      setting.description = params[:contenido]
    when 'image'
      setting.image = params[:contenido]
    when 'imagenone'
      setting.image = nil
    end
    setting.save
    
    ReloadElementFields.reload_updated_at(Element.find(setting.parent_id))   
    
    respond_with do |format|
       format.json { render :json => {:url => setting.image.url} }
    end
  end
  
  #Añade un término de los vocabularios a un setting en concreto
  def addVocabulary
    element_setting = params[:controller].camelize.singularize.constantize.find(params[:id])
    setting = Setting.new()
    setting.field_type = VocabularyTerm.find(params[:term_id]).vocabulary.title
    setting.field_value = params[:term_id]
    setting.parent_type = params[:controller].camelize
    element_setting.settings << setting
    element_setting.save
    
    if params[:with_reload] == "true"
      
      second_level = true
      if setting.field_type == "EducationalLevel" or setting.field_type == "Grade" or setting.field_type == "KnowledgeArea"
        second_level = false
      end
      
      options = Hash.new
      element_setting = params[:controller].camelize.singularize.constantize.find(params[:id])
      
      if second_level
        ["Block", "Contents", "Competences", "Objectives"].each do |current|
          options_aux = ReloadVocabularies.reload_educational_vocabularies(element_setting, current)
          options[current] = options_aux.values
        end  
      else
        ["EducationalLevel", "Grade", "KnowledgeArea"].each do |current|
          options_aux = ReloadVocabularies.reload_educational_vocabularies(element_setting, current)
          options[current] = options_aux.values
        end
      end
  
      @esoptions = options
      
      respond_with do |format|
        format.html { render :partial => "/settings/html/settings_select", :locals => {:second_level => second_level, :element_setting => element_setting} }
      end
      
    else
      respond_with do |format|
        format.json{ render :json => {:term => VocabularyTerm.find(params[:term_id]).term, :id => setting.id}}
      end
    end
 
  end
  
  
  #Elimina un término de un setting
  def removeTerm
    setting = params[:controller].camelize.singularize.constantize.find(params[:id])
    send = setting.settings.find(params[:term_id]).vocabulary_term
    
    if params[:with_reload] == "true"
      
      second_level = true
      setting_to_remove = setting.settings.find(params[:term_id])
      if setting_to_remove.field_type == "EducationalLevel" or setting_to_remove.field_type == "Grade" or setting_to_remove.field_type == "KnowledgeArea"
        second_level = false
      end
      
      setting.settings.find(params[:term_id]).destroy
      options = Hash.new
      element_setting = params[:controller].camelize.singularize.constantize.find(params[:id])
      if second_level
        ["Block", "Contents", "Competences", "Objectives"].each do |current|
          options_aux = ReloadVocabularies.reload_educational_vocabularies(element_setting, current)
          options[current] = options_aux.values
        end
      else
        ["EducationalLevel", "Grade", "KnowledgeArea"].each do |current|
          options_aux = ReloadVocabularies.reload_educational_vocabularies(element_setting, current)
          options[current] = options_aux.values
        end
      end
      @esoptions = options
     
      respond_with do |format|
        format.html { render :partial => "/settings/html/settings_select", :locals => {:second_level => second_level, :element_setting => element_setting} }
      end
    
    else
      setting.settings.find(params[:term_id]).destroy
      respond_with do |format|
        format.json{ render :json => send }
      end
    end
  
  end
  
  #No vamos a utilizar esto ahora, pq actualizaremos los vocabularios cada vez que se añada o elimine uno.
  #Actualiza los vocabularios del select, tras haber pinchado en él. Solo para educational setting.
  def reloadVocabulary
    element_setting = params[:controller].camelize.singularize.constantize.find(params[:id])
    @esoptions = ReloadVocabularies.reload_educational_vocabularies(element_setting, params[:type_select])
    respond_with do |format|
      format.html { render :partial => "/settings/html/settings_select", :locals => {:type_select => params[:type_select], :validate => false} }
    end
  end
  
  def validateOptionsVocabulary
    options = Hash.new
    element_setting = params[:controller].camelize.singularize.constantize.find(params[:id])
    
    if params[:accion] == "second_level"
      ["Block", "Contents", "Competences", "Objectives"].each do |current|
        options_aux = ReloadVocabularies.reload_educational_vocabularies(element_setting, current)
        options[current] = options_aux.values
      end
    else
      ["EducationalLevel", "Grade", "KnowledgeArea"].each do |current|
        options_aux = ReloadVocabularies.reload_educational_vocabularies(element_setting, current)
        options[current] = options_aux.values
      end
    end
   
    @esoptions = options
    
    respond_with do |format|
      format.html { render :partial => "/settings/html/settings_select", :locals => {:second_level => params[:accion]=="second_level" ? true : false, :element_setting => element_setting, :accion => params[:accion]} }
    end
  end
  
end