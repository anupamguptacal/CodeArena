# KGP Code Arena
---
This code repository supports a publicly accesible website aimed at creating an online platform that provides students with a list of questions sorted by Difficulty Level and Topic Type and allows the students to attempt any question they might be interested in. This website is built around the **Programming and Datastructure Course offered at Indian Institute of Technology, Kharagpur** which currently supports the C language. The website offers the following features: 

- Topic and Difficulty Segregated Online Coding Question Bank For Begineer and Mid-level C Programmers
- Online Code-Highlighted Editor and Compiler support for over 50+ C programs
- Cloud Supported Code Backup for every question once a user has attempted a question
- Automated Testing on selected questions

The website makes use of the **Judge0** as the supported Compiler and utilizes a custom **AWS APIGW->Serverless Lambda Compute-> S3** setup for automated code-backup and retreival.

The following HTML files are of importance: 
- **login.html** - Allows the user to login
- **register_user.html** - Allows a new user to register into the website
- **list_problems.html** - Displays the available questions to the user and allows the user to navigate the question bank

The Website relies on a **vanilla HTML/CSS/Javascript front-end depending on XHR and Fetch APIs to make over the network calls to a PHP backed server**. The details of each of the APIs exposed by the PHP server is specified in each of the php files as comments. The PHP back-end relies on **2 databases**: 
- An encrypted MySQL database for customer login information
- A local file database containing questions, details about each question and automated test outputs, if enabled per question

**For the purpose of publishing, all personalizable data and URLs are replaced with dummy variables but the working website can be found at: https://anupamguptacalcom.ipage.com/KGPCodeArena/login.html**

---