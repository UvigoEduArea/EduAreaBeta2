class ActionCorreo < ActionMailer::Base
  default from: "eduareauvigo@gmail.com"
  
  def share_url_email(user, url, share_email)
    @user = user
    @url = url
    @share_email = share_email
    mail(to: @share_email, subject: t("Mail"))
  end
  
  def contact_by_email(user, url, suggestions)
    @user = user
    @url = url
    @suggestion = suggestions
    mail(to: "eduareauvigo@gmail.com", subject: t("Mail_suggestions"))
  end
  
end
