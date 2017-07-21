<!DOCTYPE HTML>
<html>

<head>
	<meta charset="UTF-8">
	<title>Smooth sortable</title>
	<link rel="stylesheet" href="css/sortCss.css" title="ios">
	<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no" />
	<!-- 	to prevent zoom on drag move to edge on ipad -->
</head>

<body>
	<div class="container">

		<div class="jMyPuzzle" id="jMyPuzzleId0">
			<ul class="splitList">
				<li class='listItem'>1st Element. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla placerat neque nec diam tempor, id tristique arcu viverra. Morbi eget massa posuere, bibendum erat a, interdum dolor. </li>
				<li class='listItem'>2nd Element.  </br><button class="liButton">Shuffle</button></br> It has a nested button</li>
				<li class='listItem'>3rd Element. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla placerat neque nec diam tempor, id tristique arcu viverra. Morbi eget massa posuere, bibendum erat a, interdum dolor. </li>
				<li class='listItem'>4th Element.</li>

			</ul>
		</div>

		<div class="jMyPuzzle" id="jMyPuzzleId1">
			<ul class="splitList">
				<li class='listItem'>5th Element. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla placerat neque nec diam tempor, id tristique arcu viverra. Morbi eget massa posuere, bibendum erat a, interdum dolor. </li>
				<li class='listItem'>6th Element.</li>
				<li class='listItem'>7th Element. <span>This text is in a span element.</span></li>
				<li class='listItem'>8th Element.</li>

			</ul>
		</div>

		<div class="jMyPuzzle" id="jMyPuzzleId2">
			<ul touch-action="none" class="splitList-horizontal">
				<li class='listItem-horizontal'>Loremffffff</li>
				<li class='listItem-horizontal'>ipsumffffffffffffffffffff</li>
				<li class='listItem-horizontal'>dolor.</li>
				<li class='listItem-horizontal'>Lorem ipssasaum sdolor sit ametfffffffffffffffff</li>
				<li class='listItem-horizontal'>sit</li>
				<li class='listItem-horizontal'>amet</li>
			</ul>
		</div>

		<div class="jMyPuzzle" id="jMyPuzzleId3">
			<ul touch-action="none" class="splitList-horizontal">
				<li class='listItem-horizontal'>Lorem</li>
				<li class='listItem-horizontal'>ipsum</li>
				<li class='listItem-horizontal'>dolor.</li>
				<li class='listItem-horizontal'>Lorem ipssasaum sdolor sit amet</li>
				<li class='listItem-horizontal'>sit</li>
				<li class='listItem-horizontal'>amet</li>
			</ul>
		</div>

	</div>
 <button class="bodyButton" id="button1">vertical</button>
 <button class="bodyButton" id="button2">horizontal</button>

	<script type="text/javascript" src="js/jquery-3.2.1.slim.min.js"></script>
	<!-- <script src="https://code.jquery.com/pep/0.4.3/pep.js"></script> -->
	<script type='module' src='jsQuiz/main.js'></script>

</body>

</html>
