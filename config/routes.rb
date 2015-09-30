Rails.application.routes.draw do
  
  apipie
  
  devise_for :users, :controllers => { registrations: 'registrations' }
  
  #root :to => "home#index"
  root :to => "home#landing"
  
  scope "(/:locale)", :locale => /en|gl|pt|es/ do
#    devise_for :users
  
  
  ##################################################################
  ##                                                              ## 
  ##                          HOME                                ##
  ##                                                              ##
  ##################################################################
  get "/pruebas" => "home#x"
  get "/home" => "home#index", :as => "home"
  post "/filter" => "home#filter"
  get "/filter" => "home#filter"
  get "/landing" => "home#landing", :as => "landing"
  get "/landing_extended" => "home#landing_extended", :as => "more_landing"
  
  ##################################################################
  ##                                                              ## 
  ##                          ADMIN                               ##
  ##                                                              ##
  ##################################################################

  get  "/admins" => "users#index", :as => "admins"
  get  "/admins/:user" => "users#show", :as => "admin"
  get  "/admins/" => "admins#index", :as => "admin_index" 
  patch "/admins/:user" => "users#patch"
  post "/admins/create" => "users#create", :as => "create_admin"
  post "/admins/:id/setDefaultTemplate" => "users#setDefaultTemplate"
  
  
  ##################################################################
  ##                                                              ## 
  ##                        TEACHER                               ##
  ##                                                              ##
  ##################################################################

  get  "/teachers" => "users#index", :as => "teachers"
  get  "/teachers/:user" => "users#show", :as => "teacher"
  patch "/teachers/:user" => "users#patch"
  post "/teachers/create" => "users#create", :as => "create_teacher"
  post "/teachers/:id/setDefaultTemplate" => "users#setDefaultTemplate"
  
  
  ##################################################################
  ##                                                              ## 
  ##                        STUDENT                               ##
  ##                                                              ##
  ##################################################################

  get  "/students" => "users#index", :as => "students"
  get  "/students/:user" => "users#show", :as => "student"
  patch "/students/:user" => "users#patch"
  post "/students/create" => "users#create", :as => "create_student"
  post "/students/:id/setDefaultTemplate" => "users#setDefaultTemplate"
  
  
  ##################################################################
  ##                                                              ## 
  ##                        RESOURCES                             ##
  ##                                                              ##
  ##################################################################
  
  get "/resources/search" => "resources#search"
  post "/resources/filter" => "resources#filter"
  get "/resources/:id/getComments" => "resources#getComments"
  post "/resources/:id/setComments" => "resources#setComments"
  post "/resources/:id/shareByEmail" => "resources#shareByEmail"
  get "/resources/:id" => "resources#getWholeView", :as => "show_resource"
  
  
  ##################################################################
  ##                                                              ## 
  ##                      APPLICATIONS                            ##
  ##                                                              ##
  ##################################################################
  
  post "/applications/filter" => "applications#filter"
  get "/applications/getInfo" => "applications#getInfo"
  get "/applications/getRelevanceInfo" => "applications#getRelevanceInfo"  
  get "/applications/search" => "applications#search"
  post "/applications" => "applications#create", :as => "create_application"
  post "/applications/duplicate" => "applications#duplicate"
  #get "/applications/index_popup" => "applications#index"
  post "/applications/:id/shareByEmail" => "applications#shareByEmail"
  get "/applications/:id" => "applications#getWholeView", :as => "show_application"
  get "/applications/:id/mini" => "applications#getMiniView"
  get "/applications/:id/small" => "applications#getSmallView"
  get "/applications/:id/full" => "applications#getFullView"
  post "/applications/:id/addKeyword" => "applications#addKeywords"
  delete "/applications/:id/deleteKeyword" => "applications#deleteKeywords"
  patch "/applications/:id" => "applications#update"
  post "/applications/:id/addToLibrary" => "applications#addToLibrary"
  get "/applications/:id/getComments" => "applications#getComments"
  post "/applications/:id/setComments" => "applications#setComments"
  
    
  ##################################################################
  ##                                                              ## 
  ##                    COLLABORATORS                             ##
  ##                                                              ##
  ##################################################################
  
  get "/collaborators/getInfo" => "collaborators#getInfo"
  get "/collaborators/getRelevanceInfo" => "collaborators#getRelevanceInfo"
  get "/collaborators/search" => "collaborators#search"
  post "/collaborators" => "collaborators#create", :as => "create_collaborator"
  #get "/collaborators/index_popup" => "collaborators#index"
  post "/collaborators/duplicate" => "collaborators#duplicate"
  post "/collaborators/filter" => "collaborators#filter"
  post "/collaborators/:id/addToLibrary" => "collaborators#addToLibrary"
  get "/collaborators/:id/getComments" => "collaborators#getComments"
  post "/collaborators/:id/setComments" => "collaborators#setComments"
  get "/collaborators/:id" => "collaborators#getWholeView", :as => "show_collaborator"
  get "/collaborators/:id/mini" => "collaborators#getMiniView"
  get "/collaborators/:id/small" => "collaborators#getSmallView"
  get "/collaborators/:id/full" => "collaborators#getFullView"
  patch "/collaborators/:id" => "collaborators#update"
  post "/collaborators/:id/addKeyword" => "collaborators#addKeywords"
  delete "/collaborators/:id/deleteKeyword" => "collaborators#deleteKeywords"
  post "/collaborators/:id/shareByEmail" => "collaborators#shareByEmail"
  
  ##################################################################
  ##                                                              ## 
  ##                         CONTENTS                             ##
  ##                                                              ##
  ##################################################################
  
  get "/contents/getInfo" => "contents#getInfo"
  get "/contents/getRelevanceInfo" => "contents#getRelevanceInfo"
  get "/contents/search" => "contents#search"
  post "/contents" => "contents#create", :as => "create_content"
  post "/contents/duplicate" => "contents#duplicate"
  patch "/contents/:id" => "contents#update"
  post "/contents/filter" => "contents#filter"
  post "/contents/:id/addToLibrary" => "contents#addToLibrary"
  #get "/contents/index_popup" => "contents#index"
  get "/contents/:id/getComments" => "contents#getComments"
  post "/contents/:id/setComments" => "contents#setComments"
  get "/contents/:id" => "contents#getWholeView", :as => "show_content"
  get "/contents/:id/mini" => "contents#getMiniView"
  get "/contents/:id/small" => "contents#getSmallView"
  get "/contents/:id/full" => "contents#getFullView"
  post "/contents/:id/addKeyword" => "contents#addKeywords"
  delete "/contents/:id/deleteKeyword" => "contents#deleteKeywords"
  delete "/contents/:id/deleteAppend" => "contents#deleteAppend"
  post "/contents/:id/shareByEmail" => "contents#shareByEmail"  
  
  ##################################################################
  ##                                                              ## 
  ##                         DEVICES                              ##
  ##                                                              ##
  ##################################################################
  
  get "/devices/getInfo" => "devices#getInfo"
  get "/devices/getRelevanceInfo" => "devices#getRelevanceInfo"
  get "/devices/search" => "devices#search"
  #get "/devices/index_popup" => "devices#index"
  post "/devices/create" => "devices#create", :as => "create_device" 
  post "/devices/duplicate" => "devices#duplicate"
  post "/devices/filter" => "devices#filter"
  post "/devices/:id/addToLibrary" => "devices#addToLibrary"
  get "/devices/:id/getComments" => "devices#getComments"
  post "/devices/:id/setComments" => "devices#setComments"
  get "/devices/:id" => "devices#getWholeView", :as => "show_device"
  get "/devices/:id/mini" => "devices#getMiniView"
  get "/devices/:id/small" => "devices#getSmallView"
  get "/devices/:id/full" => "devices#getFullView"
  patch "/devices/:id" => "devices#update"
  post "/devices/:id/addKeyword" => "devices#addKeywords"
  delete "/devices/:id/deleteKeyword" => "devices#deleteKeywords" 
  post "/devices/:id/shareByEmail" => "devices#shareByEmail"
  
  ##################################################################
  ##                                                              ## 
  ##                         EVENTS                               ##
  ##                                                              ##
  ##################################################################
  
  get "/events/getInfo" => "events#getInfo"
  get "/events/getRelevanceInfo" => "events#getRelevanceInfo"
  get "/events/search" => "events#search"
  post "/events" => "events#create", :as => "create_event"
  #get "/events/index_popup" => "events#index", :as => "event_index_popup"
  post "/events/duplicate" => "events#duplicate"
  post "/events/filter" => "events#filter"
  post "/events/:id/addToLibrary" => "events#addToLibrary"
  get "/events/:id/getComments" => "events#getComments"
  post "/events/:id/setComments" => "events#setComments"
  get "/events/:id" => "events#getWholeView", :as => "show_event"
  get "/events/:id/mini" => "events#getMiniView"
  get "/events/:id/small" => "events#getSmallView"
  get "/events/:id/full" => "events#getFullView"
  post "/events/:id/addKeyword" => "events#addKeywords"
  delete "/events/:id/deleteKeyword" => "events#deleteKeywords"
  patch "/events/:id" => "events#update"
  post "/events/:id/shareByEmail" => "events#shareByEmail"  
  
  ##################################################################
  ##                                                              ## 
  ##                        ACTIVITIES                            ##
  ##                                                              ##
  ##################################################################
  
  post "/activities/:id/addElement" => "activities#addElement", :as => "add_element_to_activity"
  post "/activities/:id/addSubmission" => "activities#addSubmission"
  post "/activities/:id/addFastElement" => "activities#addFastElement"
  post "/activities/addFastElement" => "activities#addFastElement"
  post "/activities/:id/shareByEmail" => "activities#shareByEmail"
  get "/activities/getInfo" => "activities#getInfo"
  get "/activities/getRelevanceInfo" => "activities#getRelevanceInfo"
  get "/activities/getTemplates" => "activities#getTemplates"
  post "/activities/duplicate" => "activities#duplicate"
  get "/activities/search" => "activities#search"
  post "/activities/create" =>"activities#create", :as => "create_activity"
  post "/activities/filter" => "activities#filter"
  post "/activities/:id/sort/:type" => "activities#sortElements"
  get "/activities/:id/showRecord/:who" => "activities#showRecord"
  get "activities/:id/:view/:who" => "activities#changeModeView"
  get "/activities/:id/getComments" => "activities#getComments"
  post "/activities/:id/setComments" => "activities#setComments"
  post "/activities/:id/addToLibrary" => "activities#addToLibrary"
  get "/activities/:id" => "activities#getWholeView", :as => "show_activity"
  get "/activities/:id/mini" => "activities#getMiniView"
  get "/activities/:id/small" => "activities#getSmallView"
  get "/activities/:id/full" => "activities#getFullView"
  get "/activities/:id/getSections" => "activities#getSections"
  post "/activities/:id/addKeyword" => "activities#addKeywords"
  delete "/activities/:id/deleteKeyword" => "activities#deleteKeywords"
  post "/activities/:id/add_setting" => "activities#addSetting"
  patch "/activities/:id" => "activities#update"
  delete "/activities/:id/removeElement" => "activities#removeElement", :as => "remove_element_from_activity"  
  post "/activities/:id/addRecord" => "activities#add_records"
  get "/activities/:id/getRecords" => "activities#getRecords"
  delete "/activities/:id/deleteRecord" => "activities#destroyRecord"
  delete "/activities/:id/deleteSelectedElements" => "activities#deleteSelectedElements"
  get "/activities/:id/getElementList" => "activities#getElementList"
  
  
  ##################################################################
  ##                                                              ## 
  ##                        TEMPLATES                             ##
  ##                                                              ##
  ##################################################################
  
    
  post "/templates/create" => "templates#create", :as => "create_template"
  post "/activity_template/create" => "activity_templates#create", :as => "create_activity_template"
  post "/lesson_plan_template/create" => "lesson_plan_templates#create", :as => "create_lesson_plan_template" 
  get "/activity_templates" => "activity_templates#index", :as => "activity_template"
  get "/lesson_plan_templates" => "lesson_plan_templates#index", :as => "lesson_plan_template"
  post "/activity_templates/duplicate" => "activity_templates#duplicate", :as => "duplicate_activity_template"
  post "/lesson_plan_templates/duplicate" => "lesson_plan_templates#duplicate", :as => "duplicate_lesson_plan_template"
  post "/templates/duplicate" => "templates#duplicate"
  
  get "/templates/:id" => "templates#getWholeView", :as => "show_template"
  get "/templates/:id/mini" => "templates#getMiniView"
  get "/templates/:id/small" => "templates#getSmallView"
  patch "/templates/:id" => "templates#update" 
  get "/activity_templates/:id" => "activity_templates#getWholeView", :as => "show_activity_template"
  get "/lesson_plan_templates/:id" => "lesson_plan_templates#getWholeView", :as => "show_lesson_plan_template"
  patch "/activity_templates/:id" => "activity_templates#update", :as => "patch_activity_template"
  patch "/lesson_plan_templates/:id" => "lesson_plan_templates#update", :as => "patch_lesson_plan"
  delete "/activity_templates/:id" => "activity_templates#destroy", :as => "destroy_activity_template"
  delete "/lesson_plan_templates/:id" => "lesson_plan_templates#destroy", :as => "destroy_lesson_plan_template"
  put "/activity_templates/:id" => "activity_templates#update", :as => "update_activity_template"
  put "/lesson_plan_templates/:id" => "lesson_plan_templates#update", :as => "update_lesson_plan_template"
  
  
  ##################################################################
  ##                                                              ## 
  ##                      LESSON PLANS                            ##
  ##                                                              ##
  ##################################################################
  
  post "/lesson_plans/:id/addSubmission" => "lesson_plans#addSubmission"
  post "/lesson_plans/:id/addFastElement" => "lesson_plans#addFastElement"
  post "/lesson_plans/addFastElement" => "lesson_plans#addFastElement"
  post "/lesson_plans/:id/shareByEmail" => "lesson_plans#shareByEmail"
  get "/lesson_plans/getInfo" => "lesson_plans#getInfo"
  get "/lesson_plans/getRelevanceInfo" => "lesson_plans#getRelevanceInfo"
  get "/lesson_plans/search" => "lesson_plans#search"
  post "/lesson_plans/duplicate" => "lesson_plans#duplicate"
  get "/lesson_plans/getTemplates" => "lesson_plans#getTemplates"
  post "/lesson_plans/create" => "lesson_plans#create", :as => "create_lesson_plan"
  post "/lesson_plans/filter" => "lesson_plans#filter"
  post "/lesson_plans/:id/addElement" => "lesson_plans#addElement", :as => "add_element_to_lesson_plan"
  post "/lesson_plans/:id/sort/:type" => "lesson_plans#sortElements"
  get "/lesson_plans/:id/showRecord/:who" => "lesson_plans#showRecord"
  get "lesson_plans/:id/:view/:who" => "lesson_plans#changeModeView"
  get "/lesson_plans/:id/edit" => "lesson_plans#edit", :as => "edit_lesson_plan"
  get "/lesson_plans/:id" => "lesson_plans#getWholeView", :as => "show_lesson_plan"
  get "/lesson_plans/:id/mini" => "lesson_plans#getMiniView"
  get "/lesson_plans/:id/small" => "lesson_plans#getSmallView"
  get "/lesson_plans/:id/full" => "lesson_plans#getFullView"
  get "/lesson_plans/:id/table" => "lesson_plans#getTableView"
  get "/lesson_plans/:id/list" => "lesson_plans#getListView"
  get "/lesson_plans/:id/getSections" => "lesson_plans#getSections"
  get "/lesson_plans/:id/getComments" => "lesson_plans#getComments"
  post "/lesson_plans/:id/setComments" => "lesson_plans#setComments"
  post "/lesson_plans/:id/addKeyword" => "lesson_plans#addKeywords"
  delete "/lesson_plans/:id/deleteKeyword" => "lesson_plans#deleteKeywords"
  patch "/lesson_plans/:id" => "lesson_plans#update"
  get "/lesson_plans/:id/getRecords" => "lesson_plans#getRecords"
  post "/lesson_plans/:id/addRecord" => "lesson_plans#add_records"
  delete "/lesson_plans/:id/deleteRecord" => "lesson_plans#destroyRecord"
  delete "/lesson_plans/:id/deleteSelectedElements" => "lesson_plans#deleteSelectedElements"
  get "/lesson_plans/:id/getElementList" => "lesson_plans#getElementList"
  
  
  ##################################################################
  ##                                                              ## 
  ##                      SUBJECTS                                ##
  ##                                                              ##
  ##################################################################
  
  post "/subjects/duplicate" => "subjects#duplicate"
  get "/subjects/getMiniView" => "subjects#getMiniView"
  get "/subjects/getSmallView" => "subjects#getSmallView"
  get "/subjects/:id/edit" => "subjects#edit", :as => "edit_subject"
  get "/subjects/:id" => "subjects#getWholeView"
  get "/subjects/:id/mini" => "subjects#getMiniView"
  get "/subjects/:id/small" => "subjects#getSmallView"
  get "/subjects/:id/full" => "subjects#getFullView"
  patch "/subjects/:id" => "subjects#update"
  post "/subjects" => "subjects#create", :as => "create_subject"
  
  ##################################################################
  ##                                                              ## 
  ##                          USAGES                              ##
  ##                                                              ##
  ##################################################################
  
  get "/usages/getViews" => "usages#getViews"
  get "/usages/getCopies" => "usages#getCopies"
  get "/usages/getAdopt" => "usages#getAdopt"
  get "/usages/getAdoptWithContext" => "usages#getAdoptWithContext"
  get "/usages/getAdapt" => "usages#getAdapt"
  get "/usages/getAdaptWithContext" => "usages#getAdaptWithContext"
  post "/usages/setUsage" => "usages#setUsage"
  
  ##################################################################
  ##                                                              ## 
  ##                         COMMENTS                             ##
  ##                                                              ##
  ##################################################################
  
  get "/comments/getComments" => "comments#getComments"
  post "/comments/setComments" => "comments#setComments"
  
  ##################################################################
  ##                                                              ## 
  ##                         BOXES                                ##
  ##                                                              ##
  ##################################################################
  
  post "/:locale/boxes" => "boxes#addBoxToTemplate"
  post "/boxes/addBoxToTemplate" => "boxes#addBoxToTemplate"
  delete "/boxes/deleteBoxFromTemplate" => "boxes#deleteBoxFromTemplate"
  patch "/boxes/:id" => "boxes#update", :as => "update_box"
  delete "/boxes/:id" => "boxes#deleteBoxFromTemplate"
  
  
  ##################################################################
  ##                                                              ## 
  ##                      DATA_BOXES                              ##
  ##                                                              ##
  ##################################################################
  
  post "/dataBoxes/addDataToBox" => "data_boxes#addDataToBox"
  delete "/dataBoxes/:data_id" => "data_boxes#deleteDataFromBox"
  
  ##################################################################
  ##                                                              ## 
  ##                          USERS                               ##
  ##                                                              ##
  ##################################################################
  
  patch "/users/:user" => "users#patch"
  get "/users/getAllUsers" => "users#getAllUsers"
  post "/users/:id/setDefaultTemplate" => "users#setDefaultTemplate"
  
  
  ##################################################################
  ##                                                              ## 
  ##                          BOARDS                              ##
  ##                                                              ##
  ##################################################################
  
  get "/boards/getInfo" => "boards#getInfo"
  get "/boards/getRelevanceInfo" => "boards#getRelevanceInfo"
  get "/boards/search" => "boards#search"
  post "/boards/duplicate" => "boards#duplicate"
  post "/boards/create" => "boards#create", :as => "create_board"
  delete "/boards/deleteElementFromBoard" => "boards#deleteElementFromBoard"
  post "/boards/filter" => "boards#filter"
  get "/boards/:id/getComments" => "boards#getComments"
  post "/boards/:id/setComments" => "boards#setComments"
  get "/boards/:id/getBoardsFromElement" => "boards#getBoardsFromElement"
  get "/boards/:id" => "boards#getWholeView", :as => "show_board"
  post "/boards/:id/addElement" => "boards#addElementToBoard"
  post "/boards/:id/shareByEmail" => "boards#shareByEmail"
  
    
  ##################################################################
  ##                                                              ## 
  ##                    TECHNICAL SETTINGS                        ##
  ##                                                              ##
  ##################################################################

  post "/technical_settings/:id/addToLibrary" => "technical_settings#addToLibrary"
  post "/technical_settings/:id/addVocabulary" => "technical_settings#addVocabulary"
  post "/technical_settings/:id/addElement" => "technical_settings#addElement", :as => "add_element_to_ts"
  delete "/technical_settings/:id/removeElement" => "technical_settings#removeElement", :as => "remove_element_from_ts"
  delete "/technical_settings/:id/removeTerm" => "technical_settings#removeTerm", :as => "remove_term_from_ts"
  get "/technical_settings/:id" => "technical_settings#getWholeView", :as => "show_technical_setting"
  get "/technical_settings/:id/mini" => "technical_settings#getMiniView"
  get "/technical_settings/:id/small" => "technical_settings#getSmallView"
  delete "/technical_settings/:id" => "technical_settings#destroy"
  
  ##################################################################
  ##                                                              ## 
  ##                   EDUCATIONAL SETTINGS                       ##
  ##                                                              ##
  ##################################################################  
  post "/educational_settings/:id/validateOptionsVocabulary" => "educational_settings#validateOptionsVocabulary"
  post "/educational_settings/:id/reloadVocabulary" => "educational_settings#reloadVocabulary"
  post "/educational_settings/:id/addVocabulary" => "educational_settings#addVocabulary"
  post "/educational_settings/:id/addElement" => "educational_settings#addElement", :as => "add_element_to_es"
  delete "/educational_settings/:id/removeElement" => "educational_settings#removeElement", :as => "remove_element_from_es"
  delete "/educational_settings/:id/removeTerm" => "educational_settings#removeTerm", :as => "remove_term_from_es"
  get "/educational_settings/:id" => "educational_settings#getWholeView", :as => "show_educational_setting"
  get "/educational_settings/:id/mini" => "educational_settings#getMiniView"
  get "/educational_settings/:id/small" => "educational_settings#getSmallView"
  post "/educational_settings/:id/addToLibrary" => "educational_settings#addToLibrary"
  
  ##################################################################
  ##                                                              ## 
  ##                        INFO PAGES                            ##
  ##                                                              ##
  ##################################################################  
  
  post "/info_pages/contactByEmail" => "info_pages#contactByEmail"
  get "/info_pages/infoWhatFind" => "info_pages#infoWhatFind", :as => "info_what_find"
  get "/info_pages/infoResources" => "info_pages#infoResources", :as => "info_resources"
  get "/info_pages/infoActivities" => "info_pages#infoActivities", :as => "info_activities"
  get "/info_pages/infoLessonPlans" => "info_pages#infoLessonPlans", :as => "info_lesson_plans"
  get "/info_pages/infoWhatDo" => "info_pages#infoWhatDo", :as => "info_what_do"
  get "/info_pages/infoBefore" => "info_pages#infoBefore", :as => "info_before"
  get "/info_pages/infoDuring" => "info_pages#infoDuring", :as => "info_during"
  get "/info_pages/infoAfter" => "info_pages#infoAfter", :as => "info_after"
  get "/info_pages/infoContact" => "info_pages#infoContact", :as => "info_contact"
  get "/info_pages/infoLicenses" => "info_pages#infoLicenses", :as => "info_licenses"
  get "/info_pages/infoAssignLicense" => "info_pages#infoAssignLicense", :as => "info_assign_license"
  get "/info_pages/infoTypes" => "info_pages#infoTypes", :as => "info_types"
  get "/info_pages/infoCompatibility" => "info_pages#infoCompatibility", :as => "info_compatibility"
  get "/info_pages/infoParadata" => "info_pages#infoParadata", :as => "info_paradata"
  get "/info_pages/infoGeneral" => "info_pages#infoGeneral", :as => "info_general"
  get "/info_pages/infoUses" => "info_pages#infoUses", :as => "info_uses"
  get "/info_pages/infoComments" => "info_pages#infoComments", :as => "info_comments"
  get "/info_pages/infoFaq" => "info_pages#infoFaq", :as => "info_faq"
  get "/info_pages/infoVideos" => "info_pages#infoVideos", :as => "info_videos"
  get "/info_pages/infoNewsletter" => "info_pages#infoNewsletter", :as => "info_newsletter"
  
  
  ##################################################################
  ##                                                              ## 
  ##                        EXPERIENCES                           ##
  ##                                                              ##
  ##################################################################
  post "/experiences/:id/sort/:type" => "experiences#sortElements"
  post "/experiences/:id/addFastElement" => "experiences#addFastElement"
  get "/courses" => "experiences#index", :as => "courses"
  get "/courses/:state" => "experiences#index", :as => "show_courses"
  get "/experiences/getInfo" => "experiences#getInfo"
  get "/experiences/getRelevanceInfo" => "experiences#getRelevanceInfo"
  get "/experiences/search" => "experiences#search", :as => "experience_search"
  post "/experiences/create" => "experiences#create", :as => "create_experience"
  post "/experiences/duplicate" => "experiences#duplicate"
  post "/experiences/filter" => "experiences#filter"
  post "/experiences/useCode" => "experiences#useCode"
  get "/experiences/:id/getCodeToShare" => "experiences#getCodeToShare"
  get "/experiences/:id/getSections" => "experiences#getSections"
  get "/experiences/:id/getComments" => "experiences#getComments"
  post "/experiences/:id/setComments" => "experiences#setComments"
  get "/experiences/:id" => "experiences#getWholeView", :as => "show_experience"
  get "/experiences/:id/mini" => "experiences#getMiniView"
  get "/experiences/:id/small" => "experiences#getSmallView"
  get "/experiences/:id/full" => "experiences#getFullView"
  delete "/experiences/:id/deleteRecord" => "experiences#destroyRecord"
  post "/experiences/:id/share" => "experiences#shareExperience"
  post "/experiences/:id/shareByEmail" => "experiences#shareByEmail"
  delete "/experiences/:id/deleteSelectedElements" => "experiences#deleteSelectedElements"
  get "/experiences/:id/getElementList" => "experiences#getElementList"
  post "/experiences/:id/addSubmission" => "experiences#addSubmission"
  
  ##################################################################
  ##                                                              ## 
  ##                        SUBMISSIONS                           ##
  ##                                                              ##
  ##################################################################
  #get  "/submissions/:id" => "submissions#show", :as => "submission"
  patch "/submissions/:id" => "submissions#update"
  get "/submissions/:id/getRecords" => "submissions#getRecords"
  post "/submissions/:id/addRecord" => "submissions#add_records"
  delete "/submissions/:id/deleteRecord" => "submissions#destroyRecord"
  get "/submissions/:id" => "submissions#getWholeView", :as => "show_submission"
  get "/submissions/:id/showRecord/:who" => "submissions#showRecord"
   
   
   
  ##################################################################
  ##                                                              ## 
  ##               RUTAS PARA TODOS LOS ELEMENTS                  ##
  ##                                                              ##
  ##################################################################
  
  get "/getChannel" => "elements#getChannel" #Creamos el nombre de canal codificado con el id de sessión del usuario para el servicio push Faye
  
  ##################################################################
    ##                                                              ##
    ##             ACCOUNTS && OPERATIONS && IMAGES                 ##
    ##                                                              ##
    ##################################################################

    get "/accounts/new" => "accounts#new", :as => "accounts_new"
    get "/oauth2callback" => "accounts#create", :as => "accounts_create"
    get "/accounts/index/:type" => "accounts#index", :as => "accounts"
    delete "/accounts/:id" => "accounts#destroy", :as => "delete_account"
    
    get "/operations/download_pdf" => "operations#download_pdf", :as => "download_pdf"
    get "/operations/download_evidences/" => "operations#download_evidences", :as => "download_evidences"
    # get "/public/" => "operations#download_evidences", :as => "download_evidences"
    get "/operations/download_evidences_pre" => "operations#download_evidences_pre", :as => "download_evidences_pre"
    get "/operations/up_evidences_pre" => "operations#up_evidences_pre", :as => "up_evidences_pre"
    get "/operations/:idExperience" => "operations#index", :as => "operations"
    get "/operations/save_experience_pdf/:id" => "operations#save_experience_pdf", :as => "operations_save_experience_pdf"
    get "/operations/up_evidences/:id" => "operations#up_evidences", :as => "operations_up_evidences"
    # get "/public/exports_files" => "operations#download_pdf", :as => "download_pdf"
     
    get "/images/edit_image/:id&:operation" => "images#edit_image", :as => "edit_image"
    get "/images/nivel_adjust" => "images#nivel_adjust", :as => "nivel_adjust"
    get "/images/undo_changes" => "images#undo_changes", :as => "undo_changes"
    get "/images/contrast" => "images#contrast", :as => "contrast"
    get "/images/del_contrast" => "images#del_contrast", :as => "del_contrast"
    get "/images/brightness" => "images#brightness", :as => "brightness"
    get "/images/del_brightness" => "images#del_brightness", :as => "del_brightness"
    get "/images/save_image" => "images#save_image", :as => "save_image"
    get "/images/out" => "images#out", :as => "out"
    get "/images/adjust_image/:type" => "images#adjust_image", :as => "adjust_image"
    get "/images/recover_image" => "images#recover_image", :as => "recover_image"
  
  resources :resources
  resources :activities
  resources :contents
  resources :devices
  resources :applications
  resources :collaborators
  resources :events
  resources :users
  resources :usages 
  resources :boxes
  resources :lesson_plans
  resources :subjects
  resources :templates
  resources :data_boxes
  resources :boards
  resources :technical_settings
  resources :educational_settings
  resources :experiences
  resources :submissions
  #resources :activity_templates
  #resources :lesson_plan_templates
   
 end
end
