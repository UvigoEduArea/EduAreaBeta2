module ReputationAndRelevance
  require 'matrix'
  
  def self.calculate_reputation_and_relevance
    
    ##### Se inicializan todos los valores a 1, para que cada vez que se llama a esta funcion se calculen los nuevos valores correctamente
    Profile.update_all(:reputation => 1)
    Element.update_all(:relevance => 1)
   
    ##### Calculo por primera vez la reputación para todos los usuarios
    users = Profile.all
    all_users = Hash.new
    users_relations = Hash.new
    unless users.blank?
      users.each do |user|
        reputation = 0
        creations = Element.where("creator_id='"+user.user_id.to_s+"' and source_id is null and removed=false and type!='Vocabulary' and type!='ActivityTemplate' and type!='LessonPlanTemplate'")
        views = Element.where("creator_id!='"+user.user_id.to_s+"' and removed=false and type!='Vocabulary' and id in (select result_id from usages where verb='View' and user_id='"+user.user_id.to_s+"')")
        adopts = Element.where("creator_id!='"+user.user_id.to_s+"' and removed=false and type!='Vocabulary' and id in (select object_id from usages where (verb='Copy' or verb='Include) and status='Adopt' and user_id='"+user.user_id.to_s+"')")
        adapts = Element.where("creator_id!='"+user.user_id.to_s+"' and removed=false and type!='Vocabulary' and id in (select object_id from usages where (verb='Copy' or verb='Include) and status='Adapt' and user_id='"+user.user_id.to_s+"')")
        boards = Element.where("removed=false and type!='Vocabulary' and id in (select element_id from boards_elements where board_id in (select id from elements where type='Board' and creator_id='"+user.user_id.to_s+"'))")
        reputation_array = creations + views + adopts + adapts + boards
        #reputation_array = Element.where("(creator_id='"+user.user_id.to_s+"' and source_id is null and removed=false and type!='Vocabulary') or (creator_id!='"+user.user_id.to_s+"' and removed=false and type!='Vocabulary' and id in (select result_id from usages where verb='View' and user_id='"+user.user_id.to_s+"')) or (creator_id!='"+user.user_id.to_s+"' and removed=false and type!='Vocabulary' and id in (select object_id from usages where verb='Copy' and user_id='"+user.user_id.to_s+"')) or (creator_id!='"+user.user_id.to_s+"' and removed=false and type!='Vocabulary' and id in (select object_id from usages where verb='Include' and user_id='"+user.user_id.to_s+"')) or (removed=false and type!='Vocabulary' and id in (select element_id from boards_elements where board_id in (select id from elements where type='Board' and creator_id='"+user.user_id.to_s+"')))")
        unless reputation_array.blank?
          reputation_array.each do |element_array|
            reputation = reputation + element_array.relevance
          end
        end
        #eEn el hash users_relations, para cada usuario se almacenan los elementos con los que está relacionado
        users_relations[user.user_id] = reputation_array
        #En el hash all_users se van almacenando los identificadores de todos los usuarios con su reputacion, para actualizar despúes esos valores nuevos de la reputación.
        all_users[user.user_id]=reputation
      end
    end
    
    ##### Calculo por primera vez la calidad(relevancia) para todos los elementos
    elements = Element.where("removed=false and type!='Vocabulary' and type!='ActivityTemplate' and type!='LessonPlanTemplate'")
    all_elements = Hash.new
    elements_relations = Hash.new
    unless elements.blank?
      elements.each do |element|
        relevance = 0
        creations = Profile.where("user_id in (select creator_id from elements where id='"+element.id.to_s+"' and source_id is null)")
        views = Profile.where("user_id!='"+element.creator_id.to_s+"' and user_id in (select user_id from usages where verb='View' and result_id='"+element.id.to_s+"')")
        adopts = Profile.where("user_id!='"+element.creator_id.to_s+"' and user_id in (select user_id from usages where (verb='Copy' or verb='Include') and status='Adopt' and object_id='"+element.id.to_s+"')")
        adapts = Profile.where("user_id!='"+element.creator_id.to_s+"' and user_id in (select user_id from usages where (verb='Copy' or verb='Include') and status='Adapt' and object_id='"+element.id.to_s+"')")
        boards = Profile.where("user_id in (select creator_id from elements where type='Board' and id in (select board_id from boards_elements where element_id='"+element.id.to_s+"'))")
        relevance_array = creations + views + adopts + adapts + boards
        #relevance_array = Profile.where("(user_id='"+element.creator_id.to_s+"') or (user_id!='"+element.creator_id.to_s+"' and user_id in (select user_id from usages where verb='View' and result_id='"+element.id.to_s+"')) or (user_id!='"+element.creator_id.to_s+"' and user_id in (select user_id from usages where verb='Copy' and object_id='"+element.id.to_s+"')) or (user_id!='"+element.creator_id.to_s+"' and user_id in (select user_id from usages where verb='Include' and object_id='"+element.id.to_s+"')) or (user_id in (select creator_id from elements where type='Board' and id in (select board_id from boards_elements where element_id='"+element.id.to_s+"')))")
        
        unless relevance_array.blank?
          relevance_array.each do |element_array|
            relevance = relevance + element_array.reputation
          end
        end
        #En el hash elements_relations, para cada elementos se almacenan los usuarios con los que está relacionado
        elements_relations[element.id] = relevance_array
        #En el hash all_users se van almacenando los identificadores de todos los usuarios con su reputacion, para actualizar despúes esos valores nuevos de la reputación.
        all_elements[element.id]=relevance
      end
    end
    
    #### Normalización de los valores
    
    #Se calcula la suma de todos los valores de reputación al cuadrado
    add_reputations = 0
    all_users.each_value{|value| (add_reputations = add_reputations + value**2)}
    if add_reputations != 1
      new_factor_reputations = Math.sqrt(add_reputations)
      #new_factor_reputations = Math.sqrt(1/add_reputations)
      #(1/add_reputations)**0.5
    end
    
    #Se calcula la suma de todos los valores de relevancia al cuadrado
    add_relevances = 0
    all_elements.each_value{|value| (add_relevances = add_relevances + value**2)}
    if add_relevances != 1
      new_factor_relevances = Math.sqrt(add_relevances)
      #new_factor_relevances = Math.sqrt(1/add_relevances)
      #(1/add_relevances)**0.5
    end
    
    #Inicializamos el número máximo de veces que queremos que se repita el algoritmo si no se alcanza la convergencia 
    times = 19
    
    
    #Bucle del algoritmo. Se entra siempre y cuando la suma de los cuadrados de las reputaciones y la suma de los cuadrados de las calidades sean distintas a 1 
    #o si ya se ha hecho el bucle el número máximo de veces que hemos marcado
    while ( ( (add_reputations != 1) && (add_relevances != 1) ) && (times != 0)) do
      
      #### Actualización de valores
      all_users = Hash[all_users.map{ |k, v| [k, v/new_factor_reputations]}]
      all_elements = Hash[all_elements.map{ |k, v| [k, v/new_factor_relevances]}]
      
      all_users_aux = Hash[all_users]
      all_elements_aux = Hash[all_elements]
      
      
      users = Profile.all
      unless users.blank?
        users.each do |user|
          reputation = 0
          elements_in_users = users_relations[user.user_id]
          unless elements_in_users.blank?
            elements_in_users.each do |element_users|
              element_users.relevance = all_elements[element_users.id]
              reputation = reputation + all_elements[element_users.id]
            end
          end
          all_users_aux[user.user_id] = reputation
        end
      end
      
      elements = Element.where("removed=false and type!='Vocabulary' and type!='ActivityTemplate' and type!='LessonPlanTemplate'")
      unless elements.blank?
        elements.each do |element|
          relevance = 0
          users_in_elements = elements_relations[element.id]
          unless users_in_elements.blank?
            users_in_elements.each do |user_elements|
              user_elements.reputation = all_users[user_elements.user_id]
              relevance = relevance + all_users[user_elements.user_id]
            end
          end
          all_elements_aux[element.id] = relevance
        end
      end
      
      #### Normalización de los valores
    
      #Se calcula la suma de todos los valores de reputación al cuadrado
      add_reputations = 0
      all_users_aux.each_value{|value| (add_reputations = add_reputations + value**2)}
      if add_reputations != 1
        new_factor_reputations = Math.sqrt(add_reputations)
        #new_factor_reputations = Math.sqrt(1/add_reputations)
      end
      
      #Se calcula la suma de todos los valores de relevancia al cuadrado
      add_relevances = 0
      all_elements_aux.each_value{|value| (add_relevances = add_relevances + value**2)}
      if add_relevances != 1
        new_factor_relevances = Math.sqrt(add_relevances)
        #new_factor_relevances = Math.sqrt(1/add_relevances)
      end
      
      all_users = Hash[all_users_aux]
      all_elements = Hash[all_elements_aux]
      
      times = times - 1      
    end
    
    #Salgo del bucle por el motivo que sea (valores iguales a 1 o número máximo de veces realizado) y recalculo otra vez los valores
    #### Actualización de valores
    all_users = Hash[all_users.map{ |k, v| [k, v/new_factor_reputations]}]
    all_elements = Hash[all_elements.map{ |k, v| [k, v/new_factor_relevances]}]    
    
    usuarios = Matrix.column_vector(all_users.values).column(0).normalize
    elementos = Matrix.column_vector(all_elements.values).column(0).normalize
    
    users = Profile.all
    unless users.blank?
      users.each do |user|
        profile = Profile.where("user_id='"+user.user_id.to_s+"'")
        profile.first.update_column(:reputation, all_users[user.user_id])
      end
    end
    
    elements = Element.where("removed=false and type!='Vocabulary' and type!='ActivityTemplate' and type!='LessonPlanTemplate'")
    unless elements.blank?
      elements.each do |element|
        element_new = Element.where("id='"+element.id.to_s+"'")
        element_new.first.update_column(:relevance, all_elements[element.id])
      end
    end 
  end


  def self.calculate_reputation_and_relevance_with_matrix
    
    reputation_vector = Hash.new
    quality_vector = Hash.new
    
    #Se inicializan todos los valores de reputacion y relevancia a uno
    #Se crea el hash de usuarios y reputaciones, y el hash de elementos y relevancias/calidades
    users = Profile.all
    unless users.blank?
      users.each do |user|
        reputation_vector[user.user_id]=1
      end
    end
    
    elements = Element.where("removed=false and type!='Vocabulary' and type!='ActivityTemplate' and type!='LessonPlanTemplate'")
    unless elements.blank?
      elements.each do |element|
        quality_vector[element.id]=1
      end
    end
    
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
      
      if element.source_id.blank?
         creations_vector[element.creator_id] = 1
      end
      creations_matrix[element.id] = creations_vector.values
      
      views = Profile.where("user_id!='"+element.creator_id.to_s+"' and user_id in (select user_id from usages where verb='View' and result_id='"+element.id.to_s+"')")
      unless views.blank?
         views.each do |view|
           views_vector[view.user_id] = 1
         end
      end
      views_matrix[element.id] = views_vector.values
            
      adopts = Profile.where("user_id!='"+element.creator_id.to_s+"' and user_id in (select user_id from usages where (verb='Copy' or verb='Include') and status='Adopt' and object_id='"+element.id.to_s+"')")
      unless adopts.blank?
         adopts.each do |adopt|
           adopts_vector[adopt.user_id] = 1
         end
      end
      adopts_matrix[element.id] = adopts_vector.values
      
      adapts = Profile.where("user_id!='"+element.creator_id.to_s+"' and user_id in (select user_id from usages where (verb='Copy' or verb='Include') and status='Adapt' and object_id='"+element.id.to_s+"')")
      unless adapts.blank?
         adapts.each do |adapt|
           adapts_vector[adapt.user_id] = 1
         end
      end
      adapts_matrix[element.id] = adapts_vector.values
      
      boards = Profile.where("user_id in (select creator_id from elements where type='Board' and id in (select board_id from boards_elements where element_id='"+element.id.to_s+"'))")
      unless boards.blank?
         boards.each do |board|
            boards_vector[board.user_id] = 1
         end
      end
      boards_matrix[element.id] = boards_vector.values
    end
    
    #Ahora hay que construir con las matrices/hashes las matrices que necesitamos
    matrix_creations = Matrix.columns(creations_matrix.values)
    matrix_views = Matrix.columns(views_matrix.values)
    matrix_adopts = Matrix.columns(adopts_matrix.values)
    matrix_adapts = Matrix.columns(adapts_matrix.values)
    matrix_boards = Matrix.columns(boards_matrix.values)
    
    #Se convierten los vectores/hashes con las reputaciones y calidades en matrices del tamaño apropiado, es decir, en vectores columna
    quality_temporal = Matrix.column_vector(quality_vector.values)
    reputation_temporal = Matrix.column_vector(reputation_vector.values)
    
    #Se empiezan a hacer las iteraciones
    times = 20
    
    while (times!=0)
      reputation_result = (matrix_creations + matrix_views + matrix_adopts + matrix_adapts + matrix_boards)*quality_temporal
      reputation_result_normalized = reputation_result.column(0).normalize
      reputation_result = Matrix.column_vector(reputation_result_normalized)
      
      quality_result = (matrix_creations + matrix_views + matrix_adopts + matrix_adapts + matrix_boards).transpose*reputation_temporal 
      quality_result_normalized = quality_result.column(0).normalize
      quality_result = Matrix.column_vector(quality_result_normalized)
      
      reputation_temporal = reputation_result
      quality_temporal = quality_result
    
      times = times - 1
    end
    
    #Ahora habría que actualizar los valores de reputación y relevancia correspondientes a los usuarios y a los elementos
    users = Profile.all
    count = 0
    unless users.blank?
      users.each do |user|
       profile = Profile.where("user_id='"+user.user_id.to_s+"'")
       profile.first.update_column(:reputation, reputation_result.component(count, 0))
        count = count + 1
      end
    end
    
    elements = Element.where("removed=false and type!='Vocabulary' and type!='ActivityTemplate' and type!='LessonPlanTemplate'")
    count = 0
    unless elements.blank?
      elements.each do |element|
        element_new = Element.where("id='"+element.id.to_s+"'")
        element_new.first.update_column(:relevance, quality_result.component(count, 0))
        count = count + 1
      end
    end 
          
  end
  
  ###################################################
  #Esta función se ha creado para modificar la base de datos y marcar como eliminados todos aquellos includes que pertenecen a un elemento eliminado
  #####################################################
  def self.change_removed_correctly
    elements = Element.where("removed=true")
    unless elements.blank?
      elements.each do |element|
        includes = Element.where("parent_id='"+element.id.to_s+"'")
        unless includes.blank?
          includes.each do |include|
            include.update_column(:removed, true)  
            activity_includes = Element.where("parent_id='"+include.id.to_s+"'")
            unless activity_includes.blank?
              activity_includes.each do |activity_include|
                activity_include.update_column(:removed, true)
                resource_includes = Element.where("parent_id='"+activity_include.id.to_s+"'")
                unless resource_includes.blank?
                  resource_includes.each do |resource_include|
                    resource_include.update_column(:removed, true)
                  end
                end
              end
            end 
          end
        end
      end
    end    
  end
  
  
  #######################################################################################################################
  #######################################################################################################################
  #Función para completar las tablas de matrices. Se hará una única vez, la primera vez que se vaya a trabajar con ellas
  # pq ya existen datos en el sistema
  
  def self.calculate_matrix
    
    users = Profile.all
    elements = Element.where("removed=false and type!='Vocabulary' and type!='ActivityTemplate' and type!='LessonPlanTemplate'")
        
    # Para cada elemento de las matrices se completa con los usuarios con los que está relacionado (cada fila de la matriz estará relacionada con un usuario)
    elements.each do |element|
      views = Profile.where("user_id!='"+element.creator_id.to_s+"' and user_id in (select user_id from usages where verb='View' and result_id='"+element.id.to_s+"')")
      adopts = Profile.where("user_id!='"+element.creator_id.to_s+"' and user_id in (select user_id from usages where (verb='Copy' or verb='Include') and status='Adopt' and object_id='"+element.id.to_s+"')")
      adapts = Profile.where("user_id!='"+element.creator_id.to_s+"' and user_id in (select user_id from usages where (verb='Copy' or verb='Include') and status='Adapt' and object_id='"+element.id.to_s+"')")
      boards = Profile.where("user_id in (select creator_id from elements where type='Board' and id in (select board_id from boards_elements where element_id='"+element.id.to_s+"'))")
      users.each do |user|
        
        #Creations_Matrix
        new_element = MatrixCreation.new
        new_element.element_id = element.id
        new_element.user_id = user.user_id
        new_element.relation = 0
        if element.source_id.blank?
          if user.user_id == element.creator_id
            new_element.relation = 1
          end
        end
        new_element.save
        
        #Views_matrix
        new_element = MatrixView.new
        new_element.element_id = element.id
        new_element.user_id = user.user_id
        new_element.relation = 0
        unless views.blank?
          views.each do |view_user|
            if user.user_id == view_user.user_id
              new_element.relation = 1
            end
          end
        end
        new_element.save
          
        
        #Adopts_Matrix
        new_element = MatrixAdopt.new
        new_element.element_id = element.id
        new_element.user_id = user.user_id
        new_element.relation = 0
        unless adopts.blank?
          adopts.each do |adopt_user|
            if user.user_id == adopt_user.user_id
              new_element.relation = 1
            end
          end
        end
        new_element.save
        
        #Adapts_matrix
        new_element = MatrixAdapt.new
        new_element.element_id = element.id
        new_element.user_id = user.user_id
        new_element.relation = 0
        unless adapts.blank?
          adapts.each do |adapt_user|
            if user.user_id == adapt_user.user_id
              new_element.relation = 1
            end
          end
        end
        new_element.save
        
        #Boards_matrix
        new_element = MatrixBoard.new
        new_element.element_id = element.id
        new_element.user_id = user.user_id
        new_element.relation = 0
        unless boards.blank?
          boards.each do |board_user|
            if user.user_id == board_user.user_id
              new_element.relation = 1
            end
          end
        end
        new_element.save
        
      end  
    end
  end
  
  #######################################################################################################################
  #######################################################################################################################
  # Funcion que calcula la reputación y la relevancia utilizando los datos almacenados en las tablas de matrices
  
  def self.reputation_and_relevance_with_tables
    
    #########################################################################################################################################
    #####Se crean los vector de reputacion y calidad/relevancia###############################################################################
    reputation_vector = Hash.new
    quality_vector = Hash.new
    #Se inicializan todos los valores de reputacion y relevancia a uno
    #Se crea el hash de usuarios y reputaciones, y el hash de elementos y relevancias/calidades
    users = Profile.all
    unless users.blank?
      users.each do |user|
        reputation_vector[user.user_id]=1
      end
    end
    
    elements = Element.where("removed=false and type!='Vocabulary' and type!='ActivityTemplate' and type!='LessonPlanTemplate'")
    unless elements.blank?
      elements.each do |element|
        quality_vector[element.id]=1
      end
    end
    #Se convierten los vectores/hashes con las reputaciones y calidades en matrices del tamaño apropiado, es decir, en vectores columna
    quality_temporal = Matrix.column_vector(quality_vector.values)
    reputation_temporal = Matrix.column_vector(reputation_vector.values)
    ############################################################################################################################################
    
    #############################################################################################################################################
    #Se crean las matrices (hashes) de cada tipo vacias, donde cada entrada (COLUMNA) está asociada con un elemento
    creations = MatrixCreation.all.order("element_id ASC")
    views = MatrixView.all.order("element_id ASC")
    adopts = MatrixAdopt.all.order("element_id ASC")
    adapts = MatrixAdapt.all.order("element_id ASC")
    boards = MatrixBoard.all.order("element_id ASC")
    
    creations_matrix = Hash.new
    views_matrix = Hash.new
    adopts_matrix = Hash.new
    adapts_matrix = Hash.new
    boards_matrix = Hash.new
    elements.each do |element|
       creations_matrix[element.id]=creations.select{|x| x.element_id == element.id}.map{|i| i.relation}
       views_matrix[element.id]=views.select{|x| x.element_id == element.id}.map{|i| i.relation}
       adopts_matrix[element.id]=adopts.select{|x| x.element_id == element.id}.map{|i| i.relation}
       adapts_matrix[element.id]=adapts.select{|x| x.element_id == element.id}.map{|i| i.relation}
       boards_matrix[element.id]=boards.select{|x| x.element_id == element.id}.map{|i| i.relation}
    end
    #Ahora hay que construir con las matrices/hashes las matrices que necesitamos
    matrix_creations = Matrix.columns(creations_matrix.values)
    matrix_views = Matrix.columns(views_matrix.values)
    matrix_adopts = Matrix.columns(adopts_matrix.values)
    matrix_adapts = Matrix.columns(adapts_matrix.values)
    matrix_boards = Matrix.columns(boards_matrix.values)
    ######################################################################################################################################################
    
    
    ######################################################################################################################################################
    ##################################Se empiezan a hacer las iteraciones ################################################################################
    # En este caso se hará 20 veces
    times = 20
    while (times!=0)
      reputation_result = (matrix_creations + matrix_views + matrix_adopts + matrix_adapts + matrix_boards)*quality_temporal
      reputation_result_normalized = reputation_result.column(0).normalize
      reputation_result = Matrix.column_vector(reputation_result_normalized)
      
      quality_result = (matrix_creations + matrix_views + matrix_adopts + matrix_adapts + matrix_boards).transpose*reputation_temporal 
      quality_result_normalized = quality_result.column(0).normalize
      quality_result = Matrix.column_vector(quality_result_normalized)
      
      reputation_temporal = reputation_result
      quality_temporal = quality_result
    
      times = times - 1
    end
    #####################################################################################################################################################################
    
    
    #####################################################################################################################################################################
    #Ahora habría que actualizar los valores de reputación y relevancia correspondientes a los usuarios y a los elementos
    users = Profile.all
    count = 0
    unless users.blank?
      users.each do |user|
       profile = Profile.where("user_id='"+user.user_id.to_s+"'")
       profile.first.update_column(:reputation, reputation_result.component(count, 0))
        count = count + 1
      end
    end
    
    elements = Element.where("removed=false and type!='Vocabulary' and type!='ActivityTemplate' and type!='LessonPlanTemplate' and id<=2207")
    count = 0
    unless elements.blank?
      elements.each do |element|
        element_new = Element.where("id='"+element.id.to_s+"'")
        element_new.first.update_column(:relevance, quality_result.component(count, 0))
        count = count + 1
      end
    end   
    ##########################################################################################################################################################################
    
  end
  
  
  def self.autovector_autovalor
    p "hola"
    columnas = Hash.new
    columnas[0] = [1, 2, 3]
    columnas[1] = [4, 5, 6]
    vector1 = Hash.new
    vector1[0] = [2, 2]
    matriz_columnas = Matrix.columns(columnas.values)
    p matriz_columnas
    matriz_vector = Matrix.columns(vector1.values)
    p matriz_vector
    resultado = matriz_columnas * matriz_vector
    p resultado
    v, d, v_inv = resultado.eigensystem
    p v
    p d
    p v_inv
    p "!!!!!!!!"
    p autovalores = resultado.eigenvalues
    p autovectores = resultado.eigenvector
    p "chau"
  end
    
end

