<?php
/*
 	The file updates the score of a particular user. It exposes a singular API:

 	1. API Type: POST
 		Route: /update_score.php

 		A. Required: score - final updated score of the user
 				 user_name - user_name of the user

 				A 5xx error is thrown if any of the above are missing when the API is called.

 		B. Details -  The final score is stored in the file "score_list.csv" in CSV formatted as such: 
					name, score. If no such file exists locally, a file with the name is created and 
					the new score is stored.

	The APIs exposed by get_score.php can be used to access a user's specific score
*/
	if(!isset[$_POST['score']] || !isset[$_POST['user_name']]) {
		header('HTTP/1.1 500 Internal Server Error');
    	exit(0);
	} else {
		$myfile = fopen("score_list.csv", "r");
		$replace_file = fopen("score_list_replace.csv", "w");
		while(!feof($myfile)) {
			$line = fgets($mfile);
			if(strcmp(explode(",", $line)[0], $_POST['user_name']) {
				$score = explode(",", $line)[1];
				$name = explode(",", $line)[0];
				fwrite($replace_file, $name.",".$_POST['score']);
			} else {
				fwrite($replace_file, $line);
			}
		}
		fclose($myfile);
		unlink("score_list.csv");
		rename("score_list_replace.csv", "score_list.csv");
	}
?>