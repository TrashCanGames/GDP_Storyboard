﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Storyboard.aspx.cs" Inherits="GDP_Storyboard.Storyboard" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link type="text/css" href="css/Storyboard.css" rel="stylesheet" />
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js"></script>
    <script src="https://use.fontawesome.com/d5b9c78a22.js"></script>
</head>
<body>
    <div id="MenuBar" runat="server">
        <select>
            <option>StoryboardName1</option>
            <option>StoryboardName2</option>
        </select>
    </div>
    <form id="sb_form" runat="server">
        <div>
        </div>
    </form>
    <script type="text/javascript">
        $('select').select2();
    </script>
</body>
</html>