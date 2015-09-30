class Usage < ActiveRecord::Base
  
  #attr_accessible :user_id, :object_id, :verb, :context_id, :result_id, :status

  ###########################################################################
  ##              AÑADE UN NUEVA ENTRADA A LA TABLA                        ##
  ###########################################################################
  
  def self.addUsage(user_id, add_id, verb, result_id, context_id = nil, session_id, status) 
    
    if (verb == 'Copy') || (verb == 'View') || (verb == 'Include') || (verb == 'Share')
      usage = Usage.new
      usage.user_id = user_id
      usage.object_id = add_id
      usage.verb = verb.capitalize
      usage.result_id = result_id
      usage.status = status
      if (!context_id.nil?)
        usage.context_id = context_id
      end
      usage.session_id = session_id
      usage.save
      
      #Cada vez que hago una copia o un include, actualizo el contador de copias correspondiente
      if ((verb == 'Copy') || (verb == 'Include'))
        usages_copy = Usage.where("verb='Copy' and object_id='"+add_id.to_s+"' and object_id!=result_id")
        usages_include = Usage.where("verb='Include' and object_id='"+add_id.to_s+"' and object_id!=result_id")
        copies = 0
        includes = 0
        
        unless usages_copy.blank?
          usages_copy.each do |usage_copy|
             element = Element.find(usage_copy.result_id)
             if element.removed == false
               copies +=1
             end
          end
        end
        
        unless usages_include.blank?
          usages_include.each do |usage_include|
            unless usage_include.context_id.blank?
              element = Element.find(usage_include.context_id)
              if element.removed == false
                 includes +=1
              end 
            else
              includes +=1
            end 
          end
        end
        
        copies_count = copies + includes
        element = Element.find(add_id)
        element.update_column(:copy_count, copies_count)    
        
      end
      
      #Cada vez que hago una vista actualizo el controlador de vistas correpondiente
      if (verb == 'View')
        element = Element.find(add_id)
        views = Usage.where("verb='View' and object_id='"+add_id.to_s+"' and user_id!='"+element.creator_id.to_s+"'").length
        element.update_column(:view_count, views)
      end
      
      return usage
    end
  end
  
  def self.changeStatus(user_id, original_id, context_id, result_id, session_id)
    #En esta función se debe primero de todo buscar la entrada Copy o Include correspondiente con el status a Adopt
    #Posteriormente se debe cambiar ese estado a Adapt
    usage = Usage.where("(verb='Copy' or verb='Include') and object_id='"+original_id.to_s+"' and result_id='"+result_id.to_s+"' and status='Adopt'")
    p usage
    unless usage.blank?
      usage.first.update_column(:session_id, session_id)
      usage.first.update_column(:status, 'Adapt')
    end
  end 
  
end
