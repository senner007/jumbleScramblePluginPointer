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
	<div class="container">
		<div class="jMyPuzzle" id="jMyPuzzleId0">
			<ul class="splitList">
				<li class='listItem'>1st Element. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla placerat neque nec diam tempor, id tristique arcu viverra. Morbi eget massa posuere, bibendum erat a, interdum dolor. </li>
				<li class='listItem'>2nd Element. </br><button class="liButton">Shuffle elements</button></br> It has a nested button.</li>
				<li class='listItem'>3rd Element. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla placerat neque nec diam tempor, id tristique arcu viverra. Morbi eget massa posuere, bibendum erat a, interdum dolor. </li>
				<li class='listItem'>4th Element. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla placerat neque nec diam tempor, id tristique arcu viverra. Morbi eget massa posuere, bibendum erat a, interdum dolor.</li>
        <li class='listItem'>5th Element. Lorem ipsum dolor sit amet, consectetur adipiscing elit. </li>
			</ul>
		</div>
		<div class="jMyPuzzle" id="jMyPuzzleId1">
			<ul class="splitList">
				<li class='listItem'>6th Element. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla placerat neque nec diam tempor, id tristique arcu viverra. Morbi eget massa posuere, bibendum erat a, interdum dolor. </li>
				<li class='listItem'>7th Element. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
				<li class='listItem'>8th Element. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla placerat neque nec diam tempor, id tristique arcu viverra. </li>
				<li class='listItem'>9th Element. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla placerat neque nec diam tempor, id tristique arcu viverra. Morbi eget massa posuere, bibendum erat a, interdum dolor.</li>
				<li class='listItem'>10th Element. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
			</ul>
		</div>
		<div class="jMyPuzzle" id="jMyPuzzleId2">
			<ul touch-action="none" class="splitList-horizontal">
				<li class='listItem-horizontal'>1st Element<button class="liButton">Shuffle elements</button><span>This text is in span<span></li>
				<li class='listItem-horizontal'>2nd Element</li>
				<li class='listItem-horizontal'>3rd Element</li>
				<li class='listItem-horizontal'>4th Element</li>
				<li class='listItem-horizontal'>5th Element</li>
			</ul>
		</div>
		<div class="jMyPuzzle" id="jMyPuzzleId3">
			<ul touch-action="none" class="splitList-horizontal">
				<li class='listItem-horizontal'>6th Element</li>
				<li class='listItem-horizontal'>7th Element</li>
				<li class='listItem-horizontal'>8th Element</li>
				<li class='listItem-horizontal'>9th Element</li>
				<li class='listItem-horizontal'>10th Element</li>
			</ul>
		</div>
	</div>
 <button class="bodyButton" id="button1">vertical</button>
 <button class="bodyButton" id="button2">horizontal</button>
	<script type="text/javascript" src="_jquery/jquery-3.2.1.slim.min.js"></script>
	<!-- <script src="https://code.jquery.com/pep/0.4.3/pep.js"></script> -->
	<script type='module' src='examples_js/main.js'></script>
</body>
</html>
