class AccountsController < ApplicationController
  include GoogleHelper

  before_action :set_account, only: :destroy
  before_action :set_account_service, only: [:new,:create]
  def index
    @accounts = Account.where(:user_id => current_user.id.to_s)
    @tipo = params[:type]
    p params
    respond_with do |format|
      format.html {render :partial => "/accounts/html/index", :layout => "/html/popup", :locals => {:student => params[:student]}}
    end
  end

  def new
    # Redirect to the Google URL
    # login_url está referenciado en GoogleHelper (google_helper.rb)

    redirect_to login_url(
      @accountService['redirect_url'],
      @accountService['client_id'],
      @accountService['scopes']).to_s
  end

  def create
    # Get user tokens from GoogleHelper
    # get_tokens está referenciado en GoogleHelper (google_helper.rb)
    user_tokens = get_tokens(
      params[:code],
      @accountService['redirect_url'],
      @accountService['client_id'],
      @accountService['client_secret'])

    # recuperamos el email para despues comprovar si ya estaba registrado
    account_info = call_api(user_tokens['access_token'])
    account = Account.where("email = ? AND tipo = ?", account_info['email'], 'GoogleDrive').first
    send = true
    # Crea la cuenta si no estaba registrado el email
    if(account == nil)
      account = Account.create(
      :tipo => "GoogleDrive",
      :email => account_info['email'],
      :user_id => account_info['id'],
      :refresh_token => user_tokens['refresh_token'],
      :access_token => user_tokens['access_token'],
      :expires => user_tokens['expires_in'],
      :user_id => current_user.id.to_s)
    else
      account.refresh_token = user_tokens['refresh_token']
      account.access_token = user_tokens['access_token']
      account.expires = user_tokens['expires']
      account.save
      send = false
    end
    p "estoy en er create!"
    begin
      #Aqui va el servicio push!
      channel = '/'+ Digest::MD5.hexdigest(request.session_options[:id]).to_s
      client = Faye::Client.new('http://edu-area.com:9292/faye')
      client.subscribe(channel)
      if(send)
        client.publish(channel, {row: render_to_string(:partial => "accounts/html/row", :object => account, :as => "account", :locals => {:student => current_user.type == "Student" ? "true" : "false"})})
      end
    rescue
      p "Se ha producido un error en el callback"
    end
    respond_with do |format|
      format.html{ render "accounts/html/closeTab"}
    end
  end

  def destroy
    @account.destroy
    respond_to do |format|
      format.html { head :ok, notice: 'La cuenta de almacenamiento fue eliminada.' }
      format.json { head :no_content }
    end
  end

  private

  def set_account
    @account = Account.find(params[:id])
  end

  def set_account_service
    @accountService = Accounts_Service.where(:servicio => "GoogleDrive").first
  end

end
