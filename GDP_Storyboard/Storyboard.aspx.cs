using System;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Configuration;
using MySql.Data.MySqlClient;
using System.Net.Mail;
using System.Web.UI.HtmlControls;
using System.Configuration;
using System.Net;
using context = System.Web.HttpContext;
using System.Web.Services;

namespace GDP_Storyboard
{
    public partial class Storyboard : Page
    {
        public static string conString = WebConfigurationManager.ConnectionStrings["dbconString"].ConnectionString;
        private static String ErrorlineNo, Errormsg, ErrorLocation, extype, exurl, Frommail, ToMail, name, word, Sub, HostAdd, EmailHead, EmailSing;

        protected void sb_selector_SelectedIndexChanged(object sender, EventArgs e)
        {
        }

        Timer hideError;

        protected void Page_Load(object sender, EventArgs e)
        {
            Load_SB_List();
        }

        protected void Load_SB_List()
        {
            //Globals
            int defaultSB = 0;

            MySqlConnection GetSBList = new MySqlConnection();
            GetSBList.ConnectionString = conString;
            try
            {
                GetSBList.Open();

                string getList = string.Format("SELECT `sb_name`, `sb_default`, `sb_num` FROM storyboardinfo");

                MySqlCommand get = new MySqlCommand(getList, GetSBList);
                MySqlDataReader getSBList = get.ExecuteReader();

                while (getSBList.Read())
                {
                    if ((int)getSBList["sb_default"] == 0)
                    {
                        var name = getSBList["sb_name"].ToString();
                        var num = getSBList["sb_num"].ToString();
                        sb_selector.Items.Add(new ListItem(name, num));
                    } else if ((int) getSBList["sb_default"] == 1)
                    {
                        defaultSB = (int)getSBList["sb_num"];
                        var name = getSBList["sb_name"].ToString();
                        var num = getSBList["sb_num"].ToString();
                        sbname.InnerHtml = name;
                        sb_selector.Items.Add(new ListItem(name, num));
                    }
                }
                ListItem li = sb_selector.Items.FindByValue(defaultSB.ToString());
                li.Selected = true;
            }
            catch (Exception ex)
            {
                SendErrorTomail(ex);
                ShowError();
            }
            GetSBList.Close();
            Load_Storyboard(defaultSB);
        }

        [WebMethod]
        public static void ReLoad_Storyboard(string value)
        {
            Storyboard thisone = new Storyboard();
            thisone.Load_Storyboard(int.Parse(value));
        }

        protected void Load_Storyboard(int activeSB)
        {
            //Global variables
            int currentScene = 0;
            int currentShot = 0;
            int currentPanel = 0;

            if (container.InnerHtml != "")
            {
                container.InnerHtml = "";
            }

            //Create a new MysqlConnection
            MySqlConnection con = new MySqlConnection();
            con.ConnectionString = conString;

            try
            {
                con.Open();

                //Get default storyboard number query string
                string query1 = string.Format("SELECT `scene_num`, `shot_num`, `panel_num`, `img_data` FROM storyboards WHERE `sb_id` = '{0}' ORDER BY `scene_num`, `shot_num`, `panel_num`", activeSB);

                HtmlGenericControl sbMainUL = new HtmlGenericControl("ul");
                sbMainUL.ID = activeSB.ToString();
                sbMainUL.Attributes.Add("class", "storyboard");
                sbMainUL.Attributes.Add("runat", "server");
                container.Controls.Add(sbMainUL);

                MySqlCommand cmd = new MySqlCommand(query1, con);
                MySqlDataReader rd = cmd.ExecuteReader();

                while (rd.Read())
                {
                    if((int)rd["scene_num"] != currentScene)
                    {
                        currentPanel = 0;
                        currentShot = 0;
                        HtmlGenericControl img = new HtmlGenericControl("IMG");
                        img.Attributes.Add("class", "image");
                        img.Attributes.Add("runat", "server");
                        img.Attributes.Add("src", rd["img_data"].ToString());

                        HtmlGenericControl pan = new HtmlGenericControl("li");
                        pan.ID = activeSB + "_" + rd["scene_num"].ToString() + "_" + rd["shot_num"].ToString() + "_" + rd["panel_num"].ToString();
                        pan.Attributes.Add("class", "panel");
                        pan.Attributes.Add("runat", "server");
                        HtmlGenericControl movepan = new HtmlGenericControl("i");
                        movepan.Attributes.Add("class", "fa fa-arrows move");
                        HtmlGenericControl editpan = new HtmlGenericControl("i");
                        editpan.Attributes.Add("class", "fa fa-pencil-square-o edit");
                        HtmlGenericControl delpan1 = new HtmlGenericControl("i");
                        delpan1.Attributes.Add("class", "fa fa-trash delete");
                        pan.Controls.Add(movepan);
                        pan.Controls.Add(editpan);
                        pan.Controls.Add(delpan1);

                        HtmlGenericControl sh = new HtmlGenericControl("ul");
                        sh.ID = activeSB + "_" + rd["scene_num"].ToString() + "_" + rd["shot_num"].ToString();
                        sh.Attributes.Add("class", "shot");
                        sh.Attributes.Add("runat", "server");
                        HtmlGenericControl movesh = new HtmlGenericControl("i");
                        movesh.Attributes.Add("class", "fa fa-arrows move");
                        HtmlGenericControl addpan = new HtmlGenericControl("i");
                        addpan.Attributes.Add("class", "fa fa-plus add");
                        HtmlGenericControl delpan = new HtmlGenericControl("i");
                        delpan.Attributes.Add("class", "fa fa-trash delete");
                        sh.Controls.Add(movesh);
                        sh.Controls.Add(addpan);
                        sh.Controls.Add(delpan);

                        HtmlGenericControl sc = new HtmlGenericControl("li");
                        sc.ID = activeSB + "_" + rd["scene_num"].ToString();
                        sc.Attributes.Add("class", "scene");
                        sc.Attributes.Add("runat", "server");
                        HtmlGenericControl movesc = new HtmlGenericControl("i");
                        movesc.Attributes.Add("class", "fa fa-arrows move");
                        HtmlGenericControl addsh = new HtmlGenericControl("i");
                        addsh.Attributes.Add("class", "fa fa-plus add");
                        HtmlGenericControl delsh = new HtmlGenericControl("i");
                        delsh.Attributes.Add("class", "fa fa-trash delete");
                        sc.Controls.Add(movesc);
                        sc.Controls.Add(addsh);
                        sc.Controls.Add(delsh);

                        pan.Controls.Add(img);
                        sh.Controls.Add(pan);
                        sc.Controls.Add(sh);

                        HtmlGenericControl a = (HtmlGenericControl)container.FindControl(activeSB.ToString());
                        a.Controls.Add(sc);

                        currentScene++;
                        currentShot++;
                        currentPanel++;

                    } else if((int)rd["shot_num"] != currentShot)
                    {
                        currentPanel = 0;

                        HtmlGenericControl img = new HtmlGenericControl("IMG");
                        img.Attributes.Add("class", "image");
                        img.Attributes.Add("runat", "server");
                        img.Attributes.Add("src", rd["img_data"].ToString());

                        HtmlGenericControl pan = new HtmlGenericControl("li");
                        pan.ID = activeSB + "_" + rd["scene_num"].ToString() + "_" + rd["shot_num"].ToString() + "_" + rd["panel_num"].ToString();
                        pan.Attributes.Add("class", "panel");
                        pan.Attributes.Add("runat", "server");
                        HtmlGenericControl movepan = new HtmlGenericControl("i");
                        movepan.Attributes.Add("class", "fa fa-arrows move");
                        HtmlGenericControl editpan = new HtmlGenericControl("i");
                        editpan.Attributes.Add("class", "fa fa-pencil-square-o edit");
                        HtmlGenericControl delpan1 = new HtmlGenericControl("i");
                        delpan1.Attributes.Add("class", "fa fa-trash delete");
                        pan.Controls.Add(movepan);
                        pan.Controls.Add(editpan);
                        pan.Controls.Add(delpan1);

                        HtmlGenericControl sh = new HtmlGenericControl("ul");
                        sh.ID = activeSB + "_" + rd["scene_num"].ToString() + "_" + rd["shot_num"].ToString();
                        sh.Attributes.Add("class", "shot");
                        sh.Attributes.Add("runat", "server");
                        HtmlGenericControl movesh = new HtmlGenericControl("i");
                        movesh.Attributes.Add("class", "fa fa-arrows move");
                        HtmlGenericControl addpan = new HtmlGenericControl("i");
                        addpan.Attributes.Add("class", "fa fa-plus add");
                        HtmlGenericControl delpan = new HtmlGenericControl("i");
                        delpan.Attributes.Add("class", "fa fa-trash delete");
                        sh.Controls.Add(movesh);
                        sh.Controls.Add(addpan);
                        sh.Controls.Add(delpan);

                        pan.Controls.Add(img);
                        sh.Controls.Add(pan);

                        HtmlGenericControl a = (HtmlGenericControl)container.FindControl(activeSB + "_" + rd["scene_num"].ToString());
                        a.Controls.Add(sh);

                        currentShot++;
                        currentPanel++;

                    } else if ((int)rd["panel_num"] != currentPanel)
                    {
                        HtmlGenericControl img = new HtmlGenericControl("IMG");
                        img.Attributes.Add("class", "image");
                        img.Attributes.Add("runat", "server");
                        img.Attributes.Add("src", rd["img_data"].ToString());

                        HtmlGenericControl pan = new HtmlGenericControl("li");
                        pan.ID = activeSB + "_" + rd["scene_num"].ToString() + "_" + rd["shot_num"].ToString() + "_" + rd["panel_num"].ToString();
                        pan.Attributes.Add("class", "panel");
                        pan.Attributes.Add("runat", "server");
                        HtmlGenericControl movepan = new HtmlGenericControl("i");
                        movepan.Attributes.Add("class", "fa fa-arrows move");
                        HtmlGenericControl editpan = new HtmlGenericControl("i");
                        editpan.Attributes.Add("class", "fa fa-pencil-square-o edit");
                        HtmlGenericControl delpan1 = new HtmlGenericControl("i");
                        delpan1.Attributes.Add("class", "fa fa-trash delete");
                        pan.Controls.Add(movepan);
                        pan.Controls.Add(editpan);
                        pan.Controls.Add(delpan1);

                        pan.Controls.Add(img);

                        HtmlGenericControl a = (HtmlGenericControl)container.FindControl(activeSB + "_" + rd["scene_num"].ToString() + "_" + rd["shot_num"].ToString());
                        a.Controls.Add(pan);

                        currentPanel++;
                    }
                }
            }
            catch (Exception ex)
            {
                SendErrorTomail(ex);
                ShowError();
            }
            con.Close();
        }

        protected void ShowError()
        {
            HtmlGenericControl errorMsgA = new HtmlGenericControl("a");
            errorMsgA.ID = "error_message";
            errorMsgA.InnerHtml = "There was an error saving the storyboard, please try saving again in a few minutes.";
            errorMsgA.Attributes.Add("style", "position: absolute; top: 0px; right: 0px; color: red; background-color:yellow;");
            errorMsgA.Attributes.Add("runat", "server");
            container.Controls.Add(errorMsgA);
            hideError = new Timer() { Interval = 5000, Enabled = true };
            hideError.Tick += (s, e) => Delete_Error();
        }

        protected void Delete_Error()
        {
            HtmlGenericControl err = (HtmlGenericControl)container.FindControl("error_message");
            hideError.Enabled = false;
            container.Controls.Remove(err);
        }

        public static void SendErrorTomail(Exception exmail)
        {

            try
            {
                var newline = "<br/>";
                ErrorlineNo = exmail.StackTrace.Substring(exmail.StackTrace.Length - 7, 7);
                Errormsg = exmail.GetType().Name.ToString();
                extype = exmail.GetType().ToString();
                exurl = context.Current.Request.Url.ToString();
                ErrorLocation = exmail.Message.ToString();
                EmailHead = "<b>Dear Team,</b>" + "<br/>" + "An exception occurred in a Application Url" + " " + exurl + " " + "With following Details" + "<br/>" + "<br/>";
                EmailSing = newline + "Thanks and Regards" + newline + "    " + "     " + "<b>Application Admin </b>" + "</br>";
                Sub = "Exception occurred" + " " + "in Application" + " " + exurl;
                HostAdd = ConfigurationManager.AppSettings["Host"].ToString();
                string errortomail = EmailHead + "<b>Log Written Date: </b>" + " " + DateTime.Now.ToString() + newline + "<b>Error Line No :</b>" + " " + ErrorlineNo + "\t\n" + " " + newline + "<b>Error Message:</b>" + " " + Errormsg + newline + "<b>Exception Type:</b>" + " " + extype + newline + "<b> Error Details :</b>" + " " + ErrorLocation + newline + "<b>Error Page Url:</b>" + " " + exurl + newline + newline + newline + newline + EmailSing;

                using (MailMessage mailMessage = new MailMessage())
                {
                    Frommail = ConfigurationManager.AppSettings["FromMail"].ToString();
                    ToMail = ConfigurationManager.AppSettings["ToMail"].ToString();
                    word = ConfigurationManager.AppSettings["word"].ToString();
                    name = ConfigurationManager.AppSettings["name"].ToString();

                    mailMessage.From = new MailAddress(Frommail);
                    mailMessage.Subject = Sub;
                    mailMessage.Body = errortomail;
                    mailMessage.IsBodyHtml = true;

                    string[] MultiEmailId = ToMail.Split(',');
                    foreach (string userEmails in MultiEmailId)
                    {
                        mailMessage.To.Add(new MailAddress(userEmails));
                    }

                    SmtpClient smtp = new SmtpClient();  // creating object of smptpclient  
                    smtp.Host = HostAdd;              //host of emailaddress for example smtp.gmail.com etc  
                    smtp.EnableSsl = true;
                    smtp.UseDefaultCredentials = false;
                    smtp.Credentials = new NetworkCredential(name, word);
                    smtp.Port = 25;
                    smtp.Send(mailMessage); //sending Email  

                }
            }
            catch (Exception em)
            {
                em.ToString();

            }
        }
    }
}