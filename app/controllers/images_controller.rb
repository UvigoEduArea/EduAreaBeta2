class ImagesController < ElementsController
  require 'rmagick'

  ####################################################################
  ###                       Action edit_image                      ###
  ####################################################################
  def edit_image
    session[:operation] = params[:operation].to_s
    session[:id_original_imagen] = params[:id].to_s
    element = ElementRecord.find(params[:id])
    if !element.blurred_image.path.blank?
    imag = element.blurred_image.path
    else
    imag = element.original_image.path
    end
    name = element.original_image_file_name;
    rutaPrevia = Rails.root.join('public').to_s
    dir = rutaPrevia + '/exports_files/'+ session[:idExperience]
    if !File.exists? dir
      Dir.mkdir dir
    else
      FileUtils.rm_rf(Dir.glob(dir + '/*'))
    end
    session[:temp_path] = '/exports_files/'+ session[:idExperience] + '/' + name
    @image_element = session[:temp_path] +'?'+ (Time.now.to_i).to_s
    # @image_element_original = element.original_image.url
    img = Magick::Image.read(imag)[0]
    img.write(rutaPrevia + session[:temp_path])

    respond_with do |format|
      format.html {render :partial => "/images/html/image_element_edit", :object => element, :as => "element", :locals => {:clean => true}}
    end
  end

  ####################################################################
  ###                      Ajustar la imagen                       ###
  ####################################################################
  def adjust_image
    rutaPrevia = Rails.root.join('public').to_s
    imagen = rutaPrevia + session[:temp_path]

    # name = String.new(session[:temp_path])
    # while name.include? "/" do
    # pos=name.index("/")
    # name[0..pos] = ""
    # end
    # extension = name[name.index(".")..name.length]
    # name[name.index(".")..name.length]= (Time.now.to_f* 1000000).to_s + extension

    ##### Trabajamos con las imágenes
    img = Magick::Image.read(imagen)[0]
    case params[:type]
    when "contrast" then
      img = img.contrast(sharpen=true)
      p '+++ CONTRAST de la IMAGEN::: ' + imagen.to_s
    when "del_contrast" then
      img = img.contrast(sharpen=false)
      p '+++ DEL_CONTRAST de la IMAGEN::: ' + imagen.to_s
    when "brightness" then
      # img_opacity = img.channel(Magick::OpacityChannel)
      # img_red = img.channel(Magick::RedChannel)
      # img_blue = img.channel(Magick::BlueChannel)
      # img_green = img.channel(Magick::GreenChannel)
      # img_alpha = Magick::Image.combine(nil,nil,nil,img_opacity)
      # img = Magick::Image.combine(img_red,img_green,img_blue,img_alpha)
      # img = img.gamma_channel(1.20)
      img = img.gamma_channel(1.20)
    # img.level(-Magick::QuantumRange * 0.25, Magick::QuantumRange * 1.25, 1.0)
    when "del_brightness" then
      img = img.gamma_channel(0.80)
    # img = img.contrast(sharpen=false)
    when "saturation" then
      img = img.modulate(1,1.2)
    # img = img.contrast(sharpen=false)
    when "del_saturation" then
      img = img.modulate(1,0.8)
    # img = img.contrast(sharpen=false)
    when "nivel_adjust" then
      valores = []
      valores = img.channel_extrema
      p 'VALORES:: '+valores[0].to_s + ' y '+ valores[1].to_s
      # img = img.level(valores[0] + Magick::QuantumRange * 0.05, valores[1] - Magick::QuantumRange * 0.05, gamma=1.0)
      # if !(valores[0]==0 && valores[1]==Magick::QuantumRange)
        if valores[0]==0
          # p 'SUBEXPUESTA' Magick::QuantumRange* 0.4
          img = img.level(valores[0], valores[1] - Magick::QuantumRange * 0.05, gamma=1.4)
        else
          p 'SOBREEXPUESTA'
          img = img.level(valores[0] + Magick::QuantumRange * 0.05, valores[1], gamma=0.8)
        end
      # end
    when "auto_gamma" then
      img = img.auto_gamma_channel()
    when "blur" then
      img = img.blur_image(1.0,1.0)
    when "sharpen" then
      # radius = (output ppi / 30) * 0.2
      # if radius < 1
      # sigma = radius
      # else
      # sigma = sqrt(radius)
      # end
      img = img.sharpen(1.0,1.0)
    end

    img.write(imagen)
    @image_element = session[:temp_path] +'?'+ (Time.now.to_f* 1000000).to_s

    respond_with do |format|
      format.html {render :partial => "/images/html/image_element_edit", :object => ElementRecord.find(session[:id_original_imagen]),
        :as => "element", :locals => {:clean => false}}
    end
  end

  ####################################################################
  ###                   Eliminar todos los ajustes                 ###
  ####################################################################
  def undo_changes
    # rutaPrevia = Rails.root.join('public').to_s
    # imagen = session[:imagenes][params[:id].to_f]
    # p '+++ UNDO_CHANGES de la IMAGEN::: ' + imagen.to_s
    # session[:imagenes].delete_at(params[:id].to_f)
    #
    # dir = rutaPrevia + '/exports_files/'+ session[:idExperience]
    # if File.exists? dir
    # FileUtils.rm_rf(Dir.glob(dir + '/*'))
    # end
    #
    # @imagen_element = session[:imagenes][session[:id_original_imagen].to_f]
    # @id_imagen = session[:id_original_imagen]
    # respond_with do |format|
    # format.html {render :partial => "/images/html/image_element_edit", :locals => {:clean => true}}
    # end
    redirect_to edit_image_path(:id => session[:id_original_imagen], :operation => session[:operation])
  end

  ####################################################################
  ###                   Salir sin guardar ajustes                  ###
  ####################################################################
  def out
    rutaPrevia = Rails.root.join('public').to_s
    dir = rutaPrevia + '/exports_files/'+ session[:idExperience]
    if File.exists? dir
      FileUtils.rm_rf(dir)
    end
    operacion = String.new(session[:operation])
    session.delete(:temp_path)
    session.delete(:id_original_imagen)
    session.delete(:operation)

    if (operacion=="down")
      redirect_to download_evidences_pre_path(:id => session[:idExperience])
    else
      redirect_to up_evidences_pre_path(:id => session[:idExperience])
    end
  end

  ####################################################################
  ###                      Guardar la imagen                       ###
  ####################################################################
  def save_image
    record = ElementRecord.find(session[:id_original_imagen])
    rutaPrevia = Rails.root.join('public').to_s
    imagen = rutaPrevia + session[:temp_path]

    img = File.new imagen
    record.blurred_image = img
    record.save
    record.blurred_image.reprocess!

    dir = rutaPrevia + '/exports_files/'+ session[:idExperience]
    if File.exists? dir
      FileUtils.rm_rf(dir)
    end
    operacion = String.new(session[:operation])
    session.delete(:temp_path)
    session.delete(:id_original_imagen)
    session.delete(:operation)

    if (operacion=="down")
      redirect_to download_evidences_pre_path(:id => session[:idExperience])
    else
      redirect_to up_evidences_pre_path(:id => session[:idExperience])
    end
  # respond_with do |format|
  # format.html {render :partial => "/images/html/gallery"}
  # end
  end

  ####################################################################
  ###                   Recupera la imagen original                ###
  ####################################################################
  def recover_image
    record = ElementRecord.find(session[:id_original_imagen])

    record.blurred_image.destroy
    record.save
    record.blurred_image.reprocess!

    redirect_to edit_image_path(:id => session[:id_original_imagen], :operation => session[:operation])
  end

end