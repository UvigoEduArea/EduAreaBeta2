module ReputationAndColdStart
  require 'matrix'
  
  def self.elements_calculate
    elements = Element.where("removed=true or type='Vocabulary' or type='ActivityTemplate' or type='LessonPlanTemplate'")
    elements.each do |element|
      element.update_column(:relevance, 0)
    end
  end 
    
  def self.calculate_indicators_with_matrix
    
    reputation_vector = Hash.new
    quality_vector = Hash.new
    
    users = Profile.all
    elements = Element.where("removed=false and type!='Vocabulary' and type!='ActivityTemplate' and type!='LessonPlanTemplate'")
    
    #Se inicializan todos los valores de reputacion y relevancia a uno
    #Se crea el hash de usuarios y reputaciones, y el hash de elementos y relevancias/calidades
    reputation_vector = initialize_vectors(reputation_vector, "users", users, elements)
    quality_vector = initialize_vectors(quality_vector, "elements", users, elements)
    
    #Se crean las matrices (hashes) de cada tipo vacias, donde cada entrada (COLUMNA) está asociada con un elemento
    creations_matrix = Hash.new
    views_matrix = Hash.new
    adopts_matrix = Hash.new
    adapts_matrix = Hash.new
    boards_matrix = Hash.new
    elements.each do |element|
       creations_matrix[element.id]=[]
       views_matrix[element.id]=[]
       adopts_matrix[element.id]=[]
       adapts_matrix[element.id]=[]
       boards_matrix[element.id]=[]
    end
    
    ##########################################################################################################################################################
    # Para cada elemento de las matrices se completa con los usuarios con los que está relacionado (cada fila de la matriz estará relacionada con un usuario)
    elements.each do |element|
      creations_vector = Hash.new
      views_vector = Hash.new
      adopts_vector = Hash.new
      adapts_vector = Hash.new
      boards_vector = Hash.new
      users.each do |user|
         creations_vector[user.user_id]=0
         views_vector[user.user_id]=0
         adopts_vector[user.user_id]=0
         adapts_vector[user.user_id]=0
         boards_vector[user.user_id]=0
      end
      
      #Creaciones--> Si el elemento es un elemento original, influirá la reputación de su creador
      if element.source_id.blank?
         creations_vector[element.creator_id] = 1
      end
      creations_matrix[element.id] = creations_vector.values
      
      #Visualizaciones
      views_vector = calculate_views(element, views_vector)
      views_matrix[element.id] = views_vector.values
      
      #Adopciones
      adopts_vector = calculate_adopts(element, adopts_vector)
      adopts_matrix[element.id] = adopts_vector.values
      
      #Adaptaciones
      adapts_vector = calculate_adapts(element, adapts_vector)
      adapts_matrix[element.id] = adapts_vector.values
      
      #Boards
      boards_vector = calculate_boards(element, boards_vector)
      boards_matrix[element.id] = boards_vector.values
    end
    
    #######################################################################################################
    #Ahora hay que construir con las matrices/hashes las matrices que necesitamos
    matrix_creations = Matrix.columns(creations_matrix.values)
    matrix_views = Matrix.columns(views_matrix.values)
    matrix_adopts = Matrix.columns(adopts_matrix.values)
    matrix_adapts = Matrix.columns(adapts_matrix.values)
    matrix_boards = Matrix.columns(boards_matrix.values)
    
    #Se convierten los vectores/hashes con las reputaciones y calidades en matrices del tamaño apropiado, es decir, en vectores columna
    quality_temporal = Matrix.column_vector(quality_vector.values)
    reputation_temporal = Matrix.column_vector(reputation_vector.values)
    
    ########################################################################################################
    # Se empieza con las iteraciones
    # Aquí habría que considerar otra condición de parada
    times = 20
    
    while (times!=0)
      #Se calculan R y Q, este último en función del R calculado inmediatamente antes
      reputation_result = (0.1*matrix_creations + 0.2*matrix_views + 0.3*matrix_adopts + 0.3*matrix_adapts + 0.1*matrix_boards)*quality_temporal
      quality_result = (0.1*matrix_creations + 0.2*matrix_views + 0.3*matrix_adopts + 0.3*matrix_adapts + 0.1*matrix_boards).transpose*reputation_result
      
      reputation_result_normalized = reputation_result.column(0).normalize
      reputation_result = Matrix.column_vector(reputation_result_normalized)
       
      quality_result_normalized = quality_result.column(0).normalize
      quality_result = Matrix.column_vector(quality_result_normalized)
      
      reputation_temporal = reputation_result
      quality_temporal = quality_result
    
      times = times - 1
    end
    
    ######################################################################################################################
    #Ahora habría que actualizar los valores de reputación y relevancia correspondientes a los usuarios y a los elementos
    reputation_result = update_values(reputation_result, "users")
    quality_result = update_values(quality_result, "elements")
    
    ##############################################################################################################
    #Con los vectores actualizados habría que hacer una nueva actualización teniendo en cuenta el arranque en frío 
    
  end
  
  #################################################################################################
  # Función para la inicialización de los vectores de usuarios/reputaciones y elementos/calidades #
  #################################################################################################
  def self.initialize_vectors(vector, type, users, elements)
    if type == "users"
      unless users.blank?
        users.each do |user|
          vector[user.user_id]=1
        end
      end  
    else
      unless elements.blank?
        elements.each do |element|
          vector[element.id]=1
        end
      end
    end
    return vector
  end
  
  #################################################################################################
  # Función para calcular la influencia de las visualizaciones realizadas sobre un elemento       #
  #################################################################################################
  def self.calculate_views(element, views_vector)
    #Deberíamos considerar el hecho de que debe haberse visualizado como mínimo dos veces el elemento
    views = Profile.where("user_id!='"+element.creator_id.to_s+"' and user_id in (select user_id from usages where verb='View' and result_id='"+element.id.to_s+"')")
    unless views.blank?
      views.each do |view|
        views_vector[view.user_id] = 1
      end
    end
    return views_vector
  end
  
  #################################################################################################
  # Función para calcular la influencia de las adopciones realizadas sobre un elemento            #
  #################################################################################################
  def self.calculate_adopts(element, adopts_vector)
    #Deberíamos considerar tanto al creador original como a los sucesivos creadores previos al último
    adopts = Profile.where("user_id!='"+element.creator_id.to_s+"' and user_id in (select user_id from usages where (verb='Copy' or verb='Include') and status='Adopt' and object_id='"+element.id.to_s+"')")
    unless adopts.blank?
       adopts.each do |adopt|
         adopts_vector[adopt.user_id] = 1
       end
    end
    return adopts_vector
  end
  
  #################################################################################################
  # Función para calcular la influencia de las adaptaciones realizadas sobre un elemento          #
  #################################################################################################
  def self.calculate_adapts(element, adapts_vector)
    #Deberíamos considerar tanto al creador original como a los sucesivos creadores previos al último
    adapts = Profile.where("user_id!='"+element.creator_id.to_s+"' and user_id in (select user_id from usages where (verb='Copy' or verb='Include') and status='Adapt' and object_id='"+element.id.to_s+"')")
    unless adapts.blank?
      adapts.each do |adapt|
        adapts_vector[adapt.user_id] = 1
      end
    end
    return adapts_vector
  end
  
  #################################################################################################
  # Función para calcular la influencia de las curaciones realizadas sobre un elemento            #
  #################################################################################################
  def self.calculate_boards(element, boards_vector)
    boards = Profile.where("user_id in (select creator_id from elements where type='Board' and id in (select board_id from boards_elements where element_id='"+element.id.to_s+"'))")
    unless boards.blank?
       boards.each do |board|
          boards_vector[board.user_id] = 1
       end
    end
    return boards_vector
  end
  
  
   #################################################################################################
  # Función para calcular la influencia de las curaciones realizadas sobre un elemento            #
  #################################################################################################
  def self.update_values(vector_result, type)
    if type == "users"
      users = Profile.all
      count = 0
      unless users.blank?
        users.each do |user|
          profile = Profile.where("user_id='"+user.user_id.to_s+"'")
          profile.first.update_column(:reputation, vector_result.component(count, 0))
          count = count + 1
        end
      end
    else
      elements = Element.where("removed=false and type!='Vocabulary' and type!='ActivityTemplate' and type!='LessonPlanTemplate'")
      count = 0
      unless elements.blank?
        elements.each do |element|
          element_new = Element.where("id='"+element.id.to_s+"'")
          element_new.first.update_column(:relevance, vector_result.component(count, 0))
          count = count + 1
        end
      end
    end
    return vector_result
  end
  
end