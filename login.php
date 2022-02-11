<?php 
/*
	This file exposes a single public API to verify the authenticity of a previously registered user. 

	1. API type: POST (this is POST instead of GET since the original plan planned for storing last access time as well)
		Route: /login.php
		
		Required: 
		1. user_name - the User name of the user
		2. Password - the password of the user

		A 5xx error is thrown if either of the following are not present while calling this API.

	All Data is stored securely in a MySQL server as specified by the variables defined in the code.
	For the purpose of public publishing, the details for the website have been replaced with dummy variables.
	On registration success, the user is re-directed directly to the list_problems.html page.
*/
session_start();
if(!isset($_POST['user_name']) || !isset($_POST['password'])) {
	header('HTTP/1.1 500 Internal Server Error');
	exit(0);
}

$user_name = $_POST['user_name'];
$password = $_POST['password'];

$db_host =  '<DB_HOST>';  
$db_username =  '<USER>';
$db_pass =  '<PASS>';
$db_name =  '<DB_LOGIN>'; 
$db_port = '<PORT>';
$dsn = "mysql:host=$db_host;dbname=$db_name";
$options    = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
];

$conn = new mysqli($db_host,$db_username,$db_pass,$db_name);
if ($conn->connect_error) {
    die('connect_error '. $conn->connect_error. mysqli_connect_error());
}
$result = $conn->query("SELECT * FROM <TABLE_NAME> WHERE name='$user_name'");

$results = $result->fetch_all(MYSQLI_ASSOC);

if (count($results) !== 1){
header('Location: login.html');
exit();
} else {

$_SESSION['user_name'] = $user_name;
header('Location: list_problems.html?user_name='.$user_name.&);
exit();
}
?>