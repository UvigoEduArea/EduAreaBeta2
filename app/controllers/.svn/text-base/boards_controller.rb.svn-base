# -*- coding: utf-8 -*-
class BoardsController < ElementsController
  
  #######################################################
  ##  QUEDA PENDIENTE POR HACER EL CONTROL DE ACCESO   ## 
  #######################################################
  
  
  private
  
  def validate_params
    params.permit(:parent_id, :title, :URL, :URI, :image, :description, :private, :removed, :language, :creator_id, :library, :abstract, :relevance, :template_id, :right_id, :element_id, :board_id)
  end
  
  
  public 
  
  ###########################################################################
  ##                         BOARDS INDEX                                  ##
  ###########################################################################
  
  # GET /board
  # GET /board.json
  api :GET, "/boards.json", "Devuelve el indice de todos los boards del sistema"
  param :page, Fixnum, :desc => "Parametro necesario para indicar el numero de pagina que quiere visitar", :required => false
  param :boards_number, Fixnum, :desc => "Parametro que especifica el numero de boards a enviar por pagina. Por defecto 15", :required => false
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
    Esta funcion devuelve los indices de todas los boards del sistema que no sean privados o esten eliminados.
  EOS
  
  def x
    
  end
  
  ###########################################################################
  ##                          BOARDS CREATE                                ##
  ###########################################################################
  
  api :POST, "/board/create.json", "Devuelve el id del nuevo board creado"
  description <<-EOS
  ===Description
    Esta funcion crea un nuevo board. Si todo ha funcionado correctamente, el método devuelve la cabecera HTTP 200 OK, en otro caso, HTTP 500 Internal server error
  EOS
   example '[
    {
        "id": 362
    }
]'
  def y
    
  end
  
  ###########################################################################
  ##                         BOARDS DELETE                                 ##
  ###########################################################################
  
  api :DELETE, "/boards.json", "Elimina el board seleccionado del sistema"
  param :id, Fixnum, :desc => "Id del board que se quiere eliminar", :required => true
  description <<-EOS
  ===Description
    Esta funcion elimina un board del sistema. Si todo ha funcionado correctamente, el método devuelve la cabecera HTTP 200 OK, en otro caso, HTTP 500 Internal server error
  EOS
  
  def z
    
  end
  
  ###########################################################################
  ##                         BOARDS DUPLICATE                              ##
  ###########################################################################
  
  api :POST, "/boards/duplicate.json", "Duplica un board"
  param :id, Fixnum, :desc => "Id del board que se quiere duplicar", :required => true
  formats ['json']
   example '{
    "id": 274
}'
  def w
    
  end

  ###########################################################################
  ##                            BOARDS UPDATE                              ##
  ###########################################################################
  api :PATCH, "/boards/:id.json", "Actualiza los campos de un board"
  param :title, String, :desc => "Titulo del board", :required => false
  param :description, String, :desc => "Descripcion del board", :required => false
  param :image, Hash, :desc => "Imagen del board", :required => false
  param :private, [true, false], :desc => "Valor para hacer el board publico o privado", :required => false
  description <<-EOS
  ===Description
    Esta funcion actualiza los campos que contiene un board. Se pueden actualizar los campos necesarios en una unica llamada al servidor. Cuando los campos son procesadoar y si no ha ocurrido ningun error, se devuelve la cabecera HTTP 200 OK. En caso de que se haya producido algun error, se devuelve la cabecera 422 Unprocessable Entity
  EOS
  def update
    board = Board.find(params[:id])
    p params.inspect
    case params[:campo]
      
      when 'title'
        board.title = params[:contenido]   
      when 'description'
        board.description = params[:contenido]
      when 'private'
        board.private = params[:contenido]
      when 'image'
        board.image = params[:contenido]
      when 'imagenone'
        board.image = nil
    end
    
    #Si las fechas de creacion y de actualizacion no coinciden es que el elemento ya ha sido actualizado (Adaptado) antes
    #Si coinciden, es la primera actualizacion y habra que cambiar la entrada Adopt de usages por Adapt, siempre y cuando exista esa entrada Adopt
    if ((board.updated_at.tv_sec - board.created_at.tv_sec == 0) || (board.updated_at.tv_sec - board.created_at.tv_sec == 1)) 
      Usage.changeStatus(current_user.id, board.source_id, board.parent_id, board.id, session.id)
    end
    
    @object=board.save
    respond_with do |format|
      format.json { render :json => {:url => board.image.url} }
    end
end



  ###########################################################################
  ##                 BOARDS ADD ELEMENT TO BOARD                           ##
  ###########################################################################
  
  api :POST, "/boards/addElementToBoard.json", "Crea una nueva entrada en la tabla de boards_elements que relaciona al elemento con el board y devuelve el identificador de esa nueva entrada"
  param :element_id, Fixnum, :desc =>"Id del element que se quiere incluir en el board", :required => true
  param :id, Fixnum, :desc =>"Id del board en el que se quiere incluir el element", :required => true
  example '[
    {
        "id": 2
    }
]'
  description <<-EOS
  EOS

  def addElementToBoard
    
    board= Element.where("(id= '"+params[:parent_id]+"')").first
    board.updated_at = Time.now
    board.save
    
    elements = BoardsElement.where("board_id = '"+params[:parent_id].to_s+"' and element_id = '"+params[:element_id].to_s+"'")
    p elements.blank?
    if elements.blank?
      @object= BoardsElement.new
      @object.element_id= params[:element_id]
      @object.board_id = params[:parent_id]
      @object.save  
            
      respond_with do |format|
        format.json { render "layouts/json/sendObjectId"}
        format.html { render :partial => "layouts/html/record_cards", :locals => {:record_cards => Element.where(" id = '"+@object.element_id.to_s+"' ").first, :path => "show_board_path", :resource => false, :board_creator => board.creator_id}}
      end
      
    else
      respond_with do |format|
       format.json {head :forbidden}
       format.html {render :partial => "boards/html/element_repeat"}
      end
    end
             
  end
   
  
  ###########################################################################
  ##              BOARDS DELETE ELEMENT FROM BOARD                         ##
  ###########################################################################
  
  api :DELETE, "/boards/deleteElementFromBoard.json", "Elimina una entrada de la tabla de boards_elements, es decir, un elemento de un board"
  param :element_id, Fixnum, :desc =>"Id del elemento que se quiere eliminar del board", :required => true
  param :id, Fixnum, :desc =>"Id del board del que se quiere eliminar el element", :required => true
  description <<-EOS
  EOS

  def deleteElementFromBoard
    board= Element.where("(id= '"+params[:id]+"')").first
    board.updated_at = Time.now
    board.save
    
    BoardsElement.where("board_id = '"+params[:id].to_s+"' and element_id = '"+params[:element_id].to_s+"'").delete_all
    #element= BoardsElement.where("board_id = '"+params[:id].to_s+"' and element_id = '"+params[:element_id].to_s+"'").first
    #p element
    #BoardsElement.delete(element)
    
    @board= Element.where("(id= '"+params[:id].to_s+"')").first
    @board.updated_at = Time.now
    @board.save
          
    respond_with do |format|
      format.json { render nil}
    end      
  end 
  
  
  ###########################################################################
  ##                  BOARDS GET BOARDS FROM ELEMENT                       ##
  ###########################################################################
  
  api :GET, "/boards/getBoardsFromElement.json", "Devuelve el indice de todos los boards en los que está incluido el elemento"
  param :id, Fixnum, :desc => "Id del elemento del que se quieren los boards", :required => true
 
  def getBoardsFromElement
    boards = Element.where("(id= '"+params[:id]+"')").first.boards
    unless boards.blank?
      if user_signed_in?
        @public_boards = boards.where("(removed = false) and (private = false or (private = true and creator_id = "+current_user.id.to_s+"))")
      else
        @public_boards = boards.where("(removed = false) and (private = false)")
      end
      boards_number = boards.length
    else
      @public_boards = nil
      boards_number = 0
    end
    
    respond_with do |format|
      format.html {render :partial => "boards/html/show_boards_from_element", :object => @public_boards, :locals => {:boards_number => boards_number, :show => params[:show], :type => Element.where("(id= '"+params[:id]+"')").first.type.downcase} }
    end
    
  end
  
  api :GET, "/:locale/boards/:id/getComments", "Get Comments"
  param_group :getComments, ElementsController
  formats ['json', 'html']
  description '===Description
  This method returns the comments from the element.'
  def gtCmmnts
    
  end
  
  api :POST, "/:locale/boards/:id/setComments", "Set Comments"
  param_group :setComments, ElementsController
  formats ['json', 'html']
  description '===Description
  This method returns the comments from the element in wich will be added the new comment.'
  def stCmmnts
    
  end 
    
end
