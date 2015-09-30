class OperationsController < ElementsController

  require 'nokogiri'
  require 'zip'
  include GoogleHelper
  # include WorkingWithBoxes

  ####################################################################
  ###                       Action index                           ###
  ####################################################################
  def index
    session[:idExperience] = params[:idExperience]
    respond_with do |format|
      format.html {render :partial => "/operations/html/index", :layout => "/html/popup"}
    end
  end

  ####################################################################
  ###                     Action make_file                         ###
  ####################################################################
  def make_pdf_file
    @lp = Element.find(session[:idExperience]).lesson_plan 
    if !@lp.title.blank?
      @name_file = params[:student] == "true" ? "EDUAREA - " + @lp.title + '_student_version.pdf' : "EDUAREA - " + @lp.title + '_teacher_version.pdf' 
    else
      @name_file = params[:student] == "true" ? "EDUAREA (" + current_user.id.to_s + '_' + session[:idExperience] + ")" + '_student_version.pdf' : "EDUAREA (" + current_user.id.to_s + '_' + session[:idExperience] + ")" + '_teacher_version.pdf'
    end
    @name_file = @name_file.gsub!(/\s+/,"")
    
    if user_signed_in? && params[:student] == "true"
      current_user.type = "Student"
    end
    
    pdf = WickedPdf.new.pdf_from_string(render_to_string(:partial => '/pdf/html/lesson_plan', :layout => "html/experience_layout", :object => @lp, :as => "form", :locals => {:attributions => prepare_hash_attributions(@lp.experience)}))

    return pdf
  end

  ####################################################################
  ###                  Action save_experience_pdf                  ###
  ####################################################################

  def save_experience_pdf
    @account = Account.find(params[:id])
    @accountService = Accounts_Service.where(:servicio => "GoogleDrive").first

    pdf = make_pdf_file

    # Convierto el documento para poder trabajar con el

    save_path = Rails.root.join('public/exports_files', @name_file)

    sube = true
    if sube
      File.open(save_path, 'wb') do |f|
        f.write(pdf)
        f.close
      end

      miPdf = File.open(save_path, 'rb')
      if !valid_token?(@account.access_token)
        user_tokens = refresh_token(
          @account.refresh_token,
          @accountService['client_id'],
          @accountService['client_secret'])
        @account.access_token = user_tokens['access_token']
        @account.expires = user_tokens['expires_in']
      @account.save
      end

      upload_file(@account.access_token,
        @accountService['redirect_url'],
        @accountService['client_id'],
        @accountService['client_secret'],
        @accountService['scopes'],
        @name_file,
        miPdf,
        'pdf')
    miPdf.close
    end

    File.delete(save_path) if File.exist?(save_path)
    # redirect_to show_experience_path(:id => session[:idExperience]) and return
    respond_with do |format|
      format.html {head :ok}
    end
  end

  ####################################################################
  ###                       Action up_evidences                    ###
  ####################################################################
  def up_evidences
    @account = Account.find(params[:id])
    @accountService = Accounts_Service.where(:servicio => "GoogleDrive").first
    
    rutaPrevia = Rails.root.join('public').to_s
    
    id_evidences = params[:images_id].split(',')
    
    evidences = []
    id_evidences.each do |id|
      record = ElementRecord.find(id)
      case(record.record_type)
      when "Image"
        if !record.blurred_image.path.blank?
        ruta = record.blurred_image.path
        else
        ruta = record.original_image.path
        end
      when "Video"
        ruta = record.video.path
      when "Document"
        ruta = record.document.path
      end
      evidences.push(ruta)
    end

    experience = Element.find(session[:idExperience])
    
    if !experience.title.blank?
      folder_name = "EDUAREA - " + experience.title + '.zip'
    else
      folder_name = "EDUAREA (" + current_user.id.to_s + '_' + session[:idExperience] + ")" + '.zip'
    end

    if !valid_token?(@account.access_token)
      user_tokens = refresh_token(
          @account.refresh_token,
          @accountService['client_id'],
          @accountService['client_secret'])
      @account.access_token = user_tokens['access_token']
      @account.expires = user_tokens['expires_in']
    @account.save
    end

    id_folder = create_folder(@account.access_token,folder_name)
    
    upload_media(@account.access_token,
        @accountService['redirect_url'],
        @accountService['client_id'],
        @accountService['client_secret'],
        @accountService['scopes'],
        id_folder,
        evidences)

    # redirect_to show_experience_path(:id => session[:idExperience])
    respond_to do |format|
      format.html {render :nothing => true}
    end
  end

  ####################################################################
  ###       Action para descargar y después borrar el pdf          ###
  ####################################################################

  def download_pdf
    file = make_pdf_file

    rutaPrevia = Rails.root.join('public').to_s
    dir = rutaPrevia + '/exports_files/'+ session[:idExperience]
    if !File.exists? dir
      Dir.mkdir dir
    else
      FileUtils.rm_rf(Dir.glob(dir + '/*'))
    end
    save_path = dir + '/' + @name_file

    File.open(save_path, 'wb') do |f|
      f.write(file)
      f.close
    end

    session[:file]=@name_file
    @idExperience = session[:idExperience]

    respond_with do |format|
      format.html {render :partial => "/operations/html/file", :layout => "/html/popup"}
    end
   #send_data(file, :filename => @name_file)
  end

  ####################################################################
  ###      Action para poder escojer y mejorar las evidencias      ###
  ####################################################################

  def up_evidences_pre
    
    get_images_videos_docs
    
    respond_with do |format|
      format.html {render :partial => "/images/html/gallery", :locals => {:up => true}}
    end

  end

  ####################################################################
  ###      Action para poder escojer y mejorar las evidencias      ###
  ####################################################################

  def download_evidences_pre
    
    get_images_videos_docs
    
    respond_with do |format|
      format.html {render :partial => "/images/html/gallery", :locals => {:up => false}}
    end

  end

  ####################################################################
  ###        Action para descargar las evidencias escogidas        ###
  ####################################################################

  def download_evidences
    EM.run{
      EM.add_timer(3){
        id_evidences = params[:images_id].split(',')
        
        experience = Element.find(session[:idExperience]) 
        if !experience.title.blank?
          @name_file = "EDUAREA - " + experience.title + '.zip'
        else
          @name_file = "EDUAREA (" + current_user.id.to_s + '_' + session[:idExperience] + ")" + '.zip'
        end
    
        rutaPrevia = Rails.root.join('public').to_s
        dir = rutaPrevia + '/exports_files/'+ session[:idExperience]
        if !File.exists? dir
          Dir.mkdir dir
        else
          FileUtils.rm_rf(Dir.glob(dir + '/*'))
        end
        zipfile_name = dir+'/'+@name_file
        # if File.exist?(zipfile_name)
        # File.delete(zipfile_name)
        # end
      
        Zip::File.open(zipfile_name, Zip::File::CREATE) do |zipfile|
          id_evidences.each do |id|
            record = ElementRecord.find(id)
            case(record.record_type)
            when "Image"
              name = record.original_image_file_name
              ruta = record.original_image.path
            when "Video"
              name = record.video_file_name
              ruta = record.video.path
            when "Document"
              name = record.document_file_name
              ruta = record.document.path
            end
            zipfile.add(name, ruta)
          end
        end
        
        session[:file]=@name_file
        @idExperience = session[:idExperience]
        
        channel = '/'+ Digest::MD5.hexdigest(request.session_options[:id]).to_s
        client = Faye::Client.new('http://edu-area.com:9292/faye')
        client.subscribe(channel)
        
        client.publish(channel, :popup => render_to_string(:partial => "/operations/html/file", :layout => "/html/popup"))
      }
    }
    
    respond_with do |format|
      format.html {render :nothing => true}
    end
  end

  ####################################################################
  ###      Action para poder escojer y mejorar las evidencias      ###
  ####################################################################

  def download_file
    name = session[:file]
    dir = 'public/exports_files/'+ session[:idExperience]
    file_name = dir + '/' + session[:file]
    if File.exist?(file_name)
      file = File.open(file_name, "rb")
    contents = file.read
    file.close
    end
    FileUtils.rm_rf(dir)
    session.delete(:file)
    send_data(contents, :filename => name)
  end

  ####################################################################
  ###                  Action save_experience_doc                  ###
  ####################################################################

  def save_experience_doc
    @account = Account.find(params[:id])
    @accountService = Accounts_Service.where(:servicio => "GoogleDrive").first

    html = getWholeView("experiences", session[:idExperience]) + getSections("experiences", session[:idExperience])
    html_limpio = clean_html(html)

    name_file = current_user.id.to_s + '_' + session[:idExperience] + '.doc'
    # file = Htmltoword::Document.create html_limpio, name_file
    save_path = Rails.root.join('public/exports_files', name_file)
    sube = true
    if sube
      File.open(save_path, 'wb') do |f|
        f.write(html_limpio)
        f.close
      end

      miDoc = File.open(save_path, 'rb')
      if valid_token?(@account.access_token)
        else
        user_tokens = refresh_token(
          @account.refresh_token,
          @accountService['client_id'],
          @accountService['client_secret'])
        @account.access_token = user_tokens['access_token']
        @account.expires = user_tokens['expires_in']
      @account.save
      end

      upload_file(@account.access_token,
        @accountService['redirect_url'],
        @accountService['client_id'],
        @accountService['client_secret'],
        @accountService['scopes'],
        name_file,
        miDoc,
        'doc')
    miDoc.close
    end

    File.delete(save_path) if File.exist?(save_path)
    # redirect_to show_experience_path(:id => session[:idExperience]) and return
    respond_with do |format|
      format.html {head :ok}
    end
  end
  
  private
  
  def get_images_videos_docs
    lesson_plan = Element.find(session[:idExperience]).lesson_plan
    element_records = Array.new
    
    element_records = add_records_to_array(lesson_plan.element_records.where(:removed => false), element_records)
    
    lesson_plan.activities.where(:removed => false).each do |activity|
      element_records = add_records_to_array(activity.element_records.where(:removed => false), element_records)
    end
    
    @imagenes = element_records.select{|x| x.record_type == "Image"}
    @evidences = element_records.select{|x| x.record_type == "Document" || x.record_type == "Video"}
  end
  
  def add_records_to_array(records, records_array)
    records.each do |record|
      records_array.push(record)
    end
    
    return records_array
  end

end