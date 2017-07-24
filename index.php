<?php
//  only set var if its not empty or 0 in length. E.g when loading the base url
$server = 'examples';
if(isset($_GET['p']) && strlen($_GET['p'])>0)
{
	//Sanitize the string
	$server = filter_var($_GET['p'],FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH);
}
?>
<!DOCTYPE HTML>
<html>
<head>
	<meta charset="UTF-8">
	<title>Smooth sortable</title>
	<link rel="stylesheet" href="css/sortCss.css" title="ios">
	<link rel="stylesheet" href="css/vertical.css" title="ios">
	<link rel="stylesheet" href="css/horizontal.css" title="ios">
	<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no" />
	<!-- 	to prevent zoom on drag move to edge on ipad -->
</head>
<body>
	<div id="getPHP"><?php echo $server; ?></div>
	<div class="container">
	  <?php include 'examples_js/examples/vertical.php';?>
  <?php include 'examples_js/examples/horizontal.php';?>
	</div>
 <button class="bodyButton" id="button1">vertical</button>
 <button class="bodyButton" id="button2">horizontal</button>
	<script type="text/javascript" src="../_jquery/jquery-3.2.1.slim.min.js"></script>
	<!-- <script src="https://code.jquery.com/pep/0.4.3/pep.js"></script> -->
	<script type='module' src='examples_js/main.js'></script>
</body>
</html>
