Apipie.configure do |config|
  config.app_name                = "EduAreaBeta2 API"
  config.api_base_url            = "/:locale"
  config.doc_base_url            = "/apipie"
  config.validate                = false
  config.validate_presence       = true
  config.app_info                = <<-EOS
    = Linea futura de trabajo
      En el futuro se implementaran funciones como getSimilar, en la que, una vez invocada, devolvera recursos de la web similares al que el usuario este visualizando.
      Tambien sera interesante otra funcion llamada Scrobbler, que reportara informacion al sistema sobre los recursos que ven los usuarios o utilizan fuera de la web. Este sistema sera interesante para saber los intereses de los usuarios
    = Introduction
      The API documentation is still under development. Until now, we have focused on the guides and experience section, but in future we will create the remaining sections.
    ==Images
      For now, the JSON server responses only provides de image files name and the elements needed to construct the directory url. So, the images path follows this structure: system/:page_name/element_images/000/000/:element_id/:folder/:element_image_file_name\n
      :page_name => guides,experiences,technicalSettings\n
      :element_id => if the id is lower than 100 must have one or thow 0 to complete de 3 ciphers\n
      :folder => Choose between medium, original, thumbnail\n
      :element_image_file_name => the image name provided in the JSON response\n
    ==Guides
     In this section user can create new guides to share with other users and incentivate others to realized it.
     Las funciones new y edit, solo envian los campos que se pueden modificar, por lo que no es necesario llamarlos desde otra aplicacion.
     Los campos devueltos con los nombres technical_setting y contextual setting, seran substituidos por technical setting y educational setting en el futuro.
    ==Experiences
     This section is used to document the experience of a user when he realized the activities from a guide. All functionalities are not programed yet. In a near future it will be done.
     Las funciones new y edit, solo envian los campos que se pueden modificar, por lo que no es necesario llamarlos desde otra aplicacion.
  EOS
  # where is your API defined?
  config.api_controllers_matcher = "#{Rails.root}/app/controllers/*.rb"
end
