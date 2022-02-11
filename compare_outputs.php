<?php
/*
 	The file is responsible for the automated testing section of the webpage.
 	Given an output and a specific question, the API performs checks to see if the expected output matches the computed output 
 	and returns Success or Failure in a JSON format.

 	1. API Type: GET
 		Route: /compare_outputs.php

 		A. Required: qn - Question Number
 				 output - Computed Output for any question

 				A 5xx error is thrown if any of the above are missing when the API is called.

 		B. Output: 
 			{
				"Status": "Success|Failure",
				"Error": "None|Error"
 			}

 	Currently this file just supports exact string comparison but this will be expanded in the future.
 	Expected Test outputs are stored in the Tests sub-folder on the server.
*/

 if(!isset($_GET["qn"]) || !isset($_GET["output"])) {
 	header('HTTP/1.1 500 Internal Server Error');
	exit(0);
 }
 $qn = $_GET["qn"];
 $output = $_GET["output"];
 $j_entry = new stdClass();
 $j_entry->Status = "Success";
 $j_entry->Error = "None";
 header('Content-Type: application/json');


$file_name = "Tests/test_".$qn.".txt";

 $myfile = fopen("Tests/test_".$qn.".txt", "r") or die("Unable to open file!");
 $total_file = file_get_contents($myfile);
 $test_cases = explode("---", $total_file);
 //$myfile = fopen("Tests/test_".$qn.".txt", "r")
 foreach($test_cases as $test_case) {
 	$line = fgets($myfile);
 	if(strcmp(trim($line), "str") == 0) {
 		/*
			str
			Include
			words;to;include
			---
 		*/
 		deal_with_strings($myfile);
	}
	/*
		TBD
	*/	
 }

/**
	Function to deal with automated testing specifically of string outputs
*/
function deal_with_strings($myfile) {
	$line = fgets($myfile);
	if(strcmp(trim($line),"Include" == 0)) {
		$next_line = fgets($myfile);
		// Different words must be separated by ;, in-order check is not performed
		$strings_to_exist = explode(";", $next_line);
		$count = 0;
		$output = $_GET["output"];
		$value = trim(base64_decode($output));
		foreach($strings_to_exist as $to_compare) {
			if(mb_strpos($value, trim($to_compare)) !== false) {
				$count++;
			} 
		}
		if($count != count($strings_to_exist)) {
			$j_entry = new stdClass();
			$j_entry->Status = "Failure";
			$j_entry->Error = $to_compare. " does not exist in program output";
		}			
	}
}

echo json_encode($j_entry);
exit();
?>