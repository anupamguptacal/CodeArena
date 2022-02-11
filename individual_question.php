<?php
/*
	This file exposes a single public API to get details of a specific question 

	1. API type: GET 
		Route: /individual_question.php
		
		Required Parmeters: 
		1. qn - the Question Number for which the details are requested

		A 5xx error is thrown if either of the following are not present while calling this API.

		Output Format - 
		{
			"problem": "Write a Program ..."
			"tests": [
				{
					"Input": 1,
					"Output": 2
				}, 
				{
					"Input": 3,
					Output: 4
				}
			]
		}

	Question specific data is pulled from the Questions Folder in the server. One file should be specified for each question.
*/
	if(!isset($_GET['qn'])) {
		header('HTTP/1.1 500 Internal Server Error');
    	exit(0);
	}
	header('Content-Type: application/json');
	$question_number = $_GET['qn'];
	if(file_exists("Questions/question_".$question_number.".txt")) {
		$myfile = "Questions/question_".$question_number.".txt";
		$line = file_get_contents($myfile);
		$exploded = explode("---", $line);
		$j_entry = new stdClass();
		$j_entry->problem = str_replace("\r\n", "", $exploded[0]);
		$myobj = array();
		for($i = 1; $i < count($exploded); $i++) {
			$test_entry_line = $exploded[$i];
			$test_entry = new stdClass();
			$input = str_replace("\r\n", "", explode("Input", explode("Output", $test_entry_line)[0])[1]);
			$output = str_replace("\r\n", "", explode("Output", $test_entry_line)[1]);
			$test_entry->Input = $input;
			$test_entry->Output = $output;
			array_push($myobj, $test_entry);
		}
		$j_entry->tests = $myobj;
		echo json_encode($j_entry);
	} else {
		header("HTTP/1.0 404 Not Found");
		exit(0);
	}
?>