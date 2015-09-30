module GoogleHelper

  require 'google/api_client'

  ###################################################################
  #
  # => Muestra una ventana para que el usuario autorice 
  # la aplicación.
  #
  ###################################################################
  def login_url(redirect_url,client_id,scopes)
    url = 'https://accounts.google.com/o/oauth2/auth?'+
    'scope='+ scopes + '&'+
    'redirect_uri='+ redirect_url + '&'+
    'response_type=code&'+
    'client_id='+ client_id+ '&'+
    'access_type=offline'+ '&'+
    'approval_prompt=force'
    URI.parse(URI.encode(url.strip))
  end

  ###################################################################
  #
  # => A partir del código recibido construye la petición 
  # y recupera el access_token.
  #
  ###################################################################
  def get_tokens(code, redirect_url, client_id, client_secret)
    url = URI.parse('https://accounts.google.com/o/oauth2/token')
    request = Net::HTTP::Post.new(url.path)
    request.set_form_data({
      'code' => code,
      'client_id' => client_id,
      'client_secret' => client_secret,
      'redirect_uri' => redirect_url,
      'grant_type' => 'authorization_code'}
    )
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE
    response = http.start {|temp| temp.request(request) }
    JSON.parse(response.body)
  end

  ###################################################################
  #
  # => Extrae información del usuario, lo usamos para extraer 
  # el email del usuario.
  #
  ###################################################################
  def call_api(access_token)
    # Initialize HTTP library
    url = URI.parse('https://www.googleapis.com/oauth2/v2/userinfo')
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE

    # Make request to API
    request = Net::HTTP::Get.new(url.path)
    request['Authorization'] = 'Bearer ' + access_token
    response = http.request(request)
    JSON.parse(response.body)
  end

  ###################################################################
  #
  # => Para comprovar si el access_token ya expiró.
  # 
  ###################################################################
  def valid_token?(access_token)
    puts "ACCESS_TOKEN ==== #{access_token}"
    # Initialize HTTP library
    url = URI.parse('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + access_token)
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE

    # Make request to API
    request = Net::HTTP::Get.new(url.path)
    response = http.request(request)
    result = JSON.parse(response.body)

    if (result['error'] == 'invalid_token') != nil
    false
    else
    true
    end
  end

  ###################################################################
  #
  # => Refresca el access_token.
  #
  ###################################################################
  def refresh_token(refresh_token, client_id, client_secret)
    url = URI.parse('https://accounts.google.com/o/oauth2/token')
    request = Net::HTTP::Post.new(url.path)
    request.set_form_data({
      'refresh_token' =>  refresh_token,
      'client_id' => client_id,
      'client_secret' => client_secret,
      'grant_type' => 'refresh_token'}
    )
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE
    response = http.start {|temp| temp.request(request) }
    JSON.parse(response.body)
  end

  ###################################################################
  #
  # => Crea una carpeta con el nombre folder_name.
  #
  ###################################################################
  def create_folder(access_token, folder_name)
    url = URI.parse('https://www.googleapis.com/drive/v2/files')
    request = Net::HTTP::Post.new(url.path)
    datos = {
      "title" => folder_name,
      "mimeType" => "application/vnd.google-apps.folder"
    }.to_json

    request['Authorization'] = 'Bearer ' + access_token
    request['Content-Type'] = 'application/json'
    request.body = datos
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE
    response = http.start {|temp| temp.request(request) }
    result = JSON.parse(response.body)
    return result['id']
  end
  
  ###################################################################
  #
  # => Método utilizado para subir las observaciones.
  #
  ###################################################################
  def upload_media(access_token, redirect_url, client_id, client_secret, scopes, id_folder, files)
     ### Subir un archivo usando google-api-client
    client = Google::APIClient.new
    drive = client.discovered_api('drive', 'v2')
    
    # Request authorization
    client.authorization.client_id = client_id
    client.authorization.client_secret = client_secret
    client.authorization.scope = scopes
    client.authorization.redirect_uri = redirect_url
    client.authorization.access_token = access_token
    
    files.each do |f|
      evidence = f.to_s
      p 'EVIDENCE:: '+evidence
      pos0=evidence.index("/public/")
      #evidence[0..evidence.index("/public/")] = ""
      name = String.new(evidence)
        while name.include? "/" do
          pos=name.index("/")
          name[0..pos] = ""
        end
      extension = name[name.index(".")..name.length]
      mimeType = case extension
        when '.png' then 'image/png'
        when '.jpg','.jpeg' then 'image/jpeg'
        when '.mp4' then 'video/mp4'
        else
          mimeType = "application/octet-stream"
      end
      p 'NAME:: '+name+' y EXTENSION:: '+mimeType
      file = drive.files.insert.request_schema.new({
        'title' => name,
        #'description' => 'A test document',
        'mimeType' => mimeType,
        'parents' => [{
          'id' => id_folder
          }]
      })
      if File.exist?(evidence)
        openfile =  File.open(evidence, "rb")
      end
      
      media = Google::APIClient::UploadIO.new(openfile, mimeType)
      result = client.execute(
      :api_method => drive.files.insert,
      :body_object => file,
      :media => media,
      :parameters => {
        'uploadType' => 'multipart',
        'alt' => 'json'})
        
      openfile.close
    end    
  end

  ###################################################################
  #
  # => Método para subir la experiencia.
  #
  ###################################################################
  def upload_file(access_token, redirect_url, client_id, client_secret, scopes, file_name, mifile, tipo)
    ### Utilizamos google-api-client
    client = Google::APIClient.new
    drive = client.discovered_api('drive', 'v2')

    # Construimos la autorizacion
    client.authorization.client_id = client_id
    client.authorization.client_secret = client_secret
    client.authorization.scope = scopes
    client.authorization.redirect_uri = redirect_url
    client.authorization.access_token = access_token

    # Insertamos el archivo
    if (tipo=='pdf')
      file = drive.files.insert.request_schema.new({
        'title' => file_name,
        #'description' => 'A test document',
        'mimeType' => 'application/pdf'
      })

      media = Google::APIClient::UploadIO.new(mifile, 'application/pdf')
      result = client.execute(
      :api_method => drive.files.insert,
      :body_object => file,
      :media => media,
      :parameters => {
        'uploadType' => 'multipart',
        'alt' => 'json'})

    else
      file = drive.files.insert.request_schema.new({
        'title' => file_name,
        #'description' => 'A test document',
        'mimeType' => 'application/vnd.google-apps.document'
      })

      media = Google::APIClient::UploadIO.new(mifile, 'text/html')
      result = client.execute(
      :api_method => drive.files.insert,
      :body_object => file,
      :media => media,
      :parameters => {
        'uploadType' => 'multipart',
        'convert' => 'true',
        'alt' => 'json'})
    end

    if (!result.status == 200)
      puts "An error occurred: #{result.data['error']['message']}"
    end

    return nil
  end
end