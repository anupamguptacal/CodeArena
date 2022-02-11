<?php
	/**
		This file exposes a single private API. It returns the user_name and score of all registered users.
		This is currently not in use and will be put into use once login safeguards are in place.
	*/
	$myfile = fopen("score_list.csv", "r");
	while(!feof($myfile)) {
		echo fgets($mfile)."<br />";
	}
?>
