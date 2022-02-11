<?php
/*
	This file returns a JSON formatted list of all available problems.

	1. API type: GET
		Route: /problem_list.php
		
		Required: N/A

		Output Format: 
		[
			{
				"index": 1,
				"question": "Write a Program ....",
				"topic": "2-D Arrays",
				"difficulty": "Easy"
			},
			{
				"index": 2,
				"question": "Write a Program ....",
				"topic": "Logic",
				"difficulty": "Medium"
			}
		]

	All questions are read from a local file named problem_list.csv which must contain each question in an individual line in a csv file: 
	index,question,topic,difficulty
*/
	$myfile = fopen("problem_list.csv", "r");
	header('Content-Type: application/json');
	$myobj = array();
	 while(! feof($myfile)) {
		$line = fgetcsv($myfile);
		if(count($line) > 0) {
	       $j_entry = new stdClass();
			$j_entry->index = $line[0];
			$j_entry->question = $line[1];
			$j_entry->topic = $line[2];
			$j_entry->difficulty = $line[3];
			array_push($myobj, $j_entry);
		}
	}
	fclose($myfile);
	$myJSON = json_encode($myobj);
	echo $myJSON;
?>