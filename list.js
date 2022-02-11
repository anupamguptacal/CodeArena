/**
	Javascript file linked to list_problems.html. This file handles the following operations: 

	1. Populating the list of all available problems in the initial page
	2. Fetching individual question details when a user clicks on a particular question
	3. Rendering of Online Editor when user clicks on the online editor
	4. Fetching Backed-up Code if any for that particular user and code question and rendering it on the online editor
	5. Submission of Code when the user wants to submit their final code
	6. Display of result to user post computation of submitted code
	7. Auto-saving of any code submitted by the user regardless of final computed output 
	8. Automated Testing for questions that support automated testing
	9. Updation of a user's score when their code output is correct based on automated testing
	10. Supports navigation between pages
	11. Hiding/Unhiding/Creation/Removal of elements as necessary between different flows.

	All compiler computation is performed on Judge0 (https://rapidapi.com/judge0-official/api/judge0-ce)
	All Code-Backup is saved on AWS using assymmetric encryption moderated through AWS APIGW.

	@author - Anupam Gupta (anupamguptacal@gmail.com)
	All personalizable URLs and data have been stripped from this file.

**/
window.onload = fetch_list_of_problems;

console.log("Arriving");

let QUESTION_NUMBER = 0;
let USER_NAME = "";

/**
	Function to fetch the complete list of available code problems and populate the elements as needed
**/
function fetch_list_of_problems() {
	document.getElementById("notification").addEventListener("click",hide_notification);
	let user_name = window.location.search.substr(1).split("=")[1];
	USER_NAME = user_name;
	console.log(user_name);
	document.getElementById("banner-name").innerText = "Welcome " + user_name;
    var editor = ace.edit("editor");
    editor.setOptions({
    	fontSize: "12pt"
    })
    editor.setTheme("ace/theme/dracula");
    editor.session.setMode("ace/mode/c_cpp"); 
    editor.resize();
    editor.setValue("#include <stdio.h>\n\n\nint main() {\n    // Complete the code.\n    return 0;\n}\n");
	editor.clearSelection();



	document.getElementById("code-challenges").classList.remove("hidden");
	document.getElementById("individual-challenge").classList.add("hidden");
	document.getElementById("outer-editor").classList.add("hidden");
	document.getElementById("arena-heading").classList.add("hidden");
	document.getElementById("editor").classList.add("hidden");
	document.getElementById("submit-button").classList.add("hidden");
	document.getElementById("home").classList.add("hidden");
	document.getElementById("second-outer-div").classList.add("hidden");

	document.getElementById("submit-button").addEventListener("click", submit_code);
	fetch("problem_list.php")
	.then(response => response.json())
	.then(response => {
		console.log(response.length);
		document.getElementById("individual-challenge").innerHTML = "";
		for(let i = 0; i < response.length; i++) {  
			console.log(i);
			let table = document.getElementById("challenges");
			if(i == 0) {
				let tr = document.createElement("tr");
				let th_first = document.createElement("th");
				th_first.innerText = "Index"
				let th_second = document.createElement("th");
				th_second.innerText = "Question";
				let th_third = document.createElement("th");
				th_third.innerText = "Topic";
				let th_fourth =document.createElement("th");
				th_fourth.innerText = "Difficulty Level";
				table.appendChild(tr);
				tr.appendChild(th_first);
				tr.appendChild(th_second);
				tr.appendChild(th_third);	
   				tr.appendChild(th_fourth);
			}

			let tr = document.createElement("tr");
			tr.id = response[i]['index'];

			let td_first = document.createElement("td");
			td_first.addEventListener("click", function() {
				get_problem(tr.id, response[i]['question']);
			});
			let a = document.createElement("a");
			a.innerText = response[i]['index'];
			//a.href = "individual_question.php?qn=" + tr.id;
			td_first.appendChild(a);

			let td_second = document.createElement("td");
			td_second.addEventListener("click", function() {
				get_problem(tr.id, response[i]['question']);
			});
			a = document.createElement("a");
			a.innerText = response[i]['question'];
			
			//a.href = "individual_question.php?qn=" + tr.id;
			td_second.appendChild(a);

			let td_third = document.createElement("td");
			td_third.addEventListener("click", function() {
				get_problem(tr.id, response[i]['question']);
			});
			a = document.createElement("a");
			a.innerText = response[i]['topic']
			td_third.appendChild(a);	

			let td_fourth =document.createElement("td");
			td_fourth.addEventListener("click", function() {
				get_problem(tr.id, response[i]['question']);
			});
			a = document.createElement("a");
			a.innerText = response[i]['difficulty'];
			//a.href = "individual_question.php?qn=" + tr.id;
			td_fourth.appendChild(a);
   
			table.appendChild(tr);
			tr.appendChild(td_first);
			tr.appendChild(td_second);
			tr.appendChild(td_third);
			tr.appendChild(td_fourth);
			td_second.classList.add("question-id");
		}
		
	})
	.catch(error => {
		console.log("Some error while fetching");
	})

	/*
		Function to hide the Chacha Chaudhary Notification
	*/
	function hide_notification() {
		document.getElementById("notification").classList.add("hidden");
	}

	/*
		Function to fetch the details of a specific problem and populate the elements as needed

		@param - index -> Index of problem to fetch
		@param - problem_name -> Problem_name of the selected problem.
	*/
	function get_problem(index, problem_name) {
		QUESTION_NUMBER = index;
		fetch_backed_up_code();
		document.getElementById("code-challenges").classList.add("hidden");
		document.getElementById("individual-challenge").classList.remove("hidden");
		document.getElementById("outer-editor").classList.remove("hidden");
		document.getElementById("arena-heading").classList.remove("hidden");
		document.getElementById("editor").classList.remove("hidden");
		document.getElementById("submit-button").classList.remove("hidden");
		document.getElementById("home").classList.remove("hidden");
		document.getElementById("second-outer-div").classList.remove("hidden");
		document.getElementById("challenges").innerHTML = "";
		document.getElementById("individual-challenge").innerHTML = "";
		document.getElementById("notification").classList.remove("hidden");
		let heading = document.createElement("h2");
		heading.innerText = "Problem Description";
		document.getElementById("individual-challenge").appendChild(heading);
		fetch("individual_question.php?qn=" + index)
		.then(response=> response.json())
		.then(response => {
			let program = response['problem'];
			let tests = response["tests"];

			let spacing = document.getElementById("individual-challenge");
			let heading = document.createElement("h3");
			heading.id = "individual-q-heading";
			heading.innerText = problem_name;

			let div = document.createElement("div");

			spacing.appendChild(heading);
			spacing.appendChild(div);

			div.id = "program-desc-div";
			let p = document.createElement("p");
			p.id = "program-desc";
			p.innerText = program;
			div.appendChild(p);

			let test_cases = document.createElement("div");
			div.appendChild(test_cases);
			test_cases.id = "test-case-div";
			for(let i = 0; i < tests.length; i++) {
				let test = tests[i];

				let div_test = document.createElement("div");
				let p = document.createElement("p");
				p.classList.add("test-case-p");
				p.innerText = "Test Case: " + (i + 1);

				let p_input = document.createElement("p");
				p_input.classList.add("test-case-input-p");
				p_input.innerText = "Input: " + test["Input"];

				let p_output = document.createElement("p");
				p_output.classList.add("test-case-output-p");
				p_output.innerText = "Output: " + test["Output"];

				div_test.append(p);
				div_test.append(p_input);
				div_test.append(p_output);

				test_cases.append(div_test);
			}
		}).catch(error => {
		console.log("Some error while fetching");
	})
	}
}

/*
	Function to fetch backed up code, if any, for the specific user and the question 
	and populate the editor if any such code exists.

*/
function fetch_backed_up_code() {
	console.log("Fetching Backed Up Code");
	var xhr_second = new XMLHttpRequest();
	xhr_second.open("GET", "<PERSONAL_AWS_API_GW_URL>" + USER_NAME + "&question_number=" + QUESTION_NUMBER , true);
	xhr_second.setRequestHeader('Content-Type', 'application/json');
	xhr_second.send(JSON.stringify( {
			user_name: USER_NAME,
			question_number: QUESTION_NUMBER
		}));
	xhr_second.onload = function() {
		console.log(atob(this.responseText));
		if(this.responseText != '') {
			console.log("written code");
				var editor = ace.edit("editor");
		    editor.setOptions({
		    	fontSize: "12pt"
		    })
		    editor.setTheme("ace/theme/dracula");
		    editor.session.setMode("ace/mode/c_cpp"); 
		    editor.resize();
		    editor.setValue(atob(this.responseText));
			editor.clearSelection();
		}
	}
}

/*
	Function to submit user code to Judge0, and to code-storage encoded in base-64 encoded format.



*/
function submit_code() {
	//alert("Submitting Code");
	document.getElementById("spinning").classList.remove("hidden");
	var editor = ace.edit("editor");
	let code = btoa(editor.getValue());
	console.log(editor.getValue());
	console.log("Code");
	console.log(code);
	//alert("Submitting Code");
	let input = btoa(document.getElementById("input-area").value);
	console.log("input");
	console.log(input);

	var xhr = new XMLHttpRequest();
	xhr.open("POST", "<PERSONAL_RAPID_API_URL>", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify( {
			language_id: 75,
			source_code: code,
			stdin: input
		}));
	xhr.onload = function() {
	  console.log("HELLO")
	  console.log(this.responseText);
	  var data = JSON.parse(this.responseText);
	  console.log("Data is " + data['token']);
	  console.log(data);
	  get_status_and_test_program(data['token']);
	}

	console.log("Backing up Code");
	var xhr_second = new XMLHttpRequest();
	xhr_second.open("POST", "<PERSONAL_AWS_API_GW_URL>", true);
	xhr_second.setRequestHeader('Content-Type', 'application/json');
	xhr_second.send(JSON.stringify( {
			code: code,
			user_name: USER_NAME,
			question_number: QUESTION_NUMBER
		}));
	xhr_second.onload = function() {
	  console.log("Code is backed up");
	  console.log(this);
	}
}

/**
	Function to keep querying the Judge0 API for computation output and updating the output components of the webpage 
	with the computed result.
	
	@param - token - RAPID_API token to establish a secure connection

*/
function get_status_and_test_program(token) {
	console.log(QUESTION_NUMBER);
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "<PERSONAL_RAPID_API_URL>", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send();
	xhr.onload = function() {
	  console.log("HELLO")
	  console.log(this.responseText);
	  var data = JSON.parse(this.responseText);
	  var output = data['stdout'];
	  var error = data['compile_output'];
	  if(error == null) {
	  	let decoded = atob(output);
	  	document.getElementById("spinning").classList.add("hidden");
	  	document.getElementById("output-area").innerText = decoded;
	  	document.getElementById("output-area").readOnly = true;
	  	compare_test_output(output);
	  } else {
	  	show_error_on_screen(error);
	  }
	}
}

/**
	Function to display code compilation errors to the user
*/
function show_error_on_screen(error) {
	document.getElementById("spinning").classList.add("hidden");
	document.getElementById("output-area").innerText=atob(error.replace("\n", ""));
	document.getElementById("output-area").readOnly = true;
}

/**

	Function to perform automated testing on questions that have automated testing enabled
	The Function takes the computed output and makes a back-end call to the compare_outputs.php 
	script to get the final result of the automated testing for each question.

	@param - output - The compilation output from submission of the user's code.

*/
function compare_test_output(output) {
	console.log("Comparing Test output");
	console.log("Question Number " + QUESTION_NUMBER)
	console.log("Output = " + output);
	fetch("compare_outputs.php?qn=" + QUESTION_NUMBER + "&output=" + output)
	/*	
	"Status": "Success|Failure",
	"Error": "String"
	*/
	.then(response => response.json())
	.then(response => {
		console.log("Response = ");
		console.log(response);
		if(response["Status"] == "Success") {
			// mark_test_as_done
			console.log("Test Successful");
		} else {
			show_error(response['error']);
		}
	}).catch(error => {
		console.log("Some error while fetching");
	})
}

/*
	Generic function to capture errors during fetching or posting code.
*/
function show_error(error) {
	console.log("Some error");
}