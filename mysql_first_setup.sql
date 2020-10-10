DROP DATABASE IF EXISTS aws_abex;
CREATE DATABASE aws_abex;

USE aws_abex;

DROP TABLE IF EXISTS PROJECTS;
CREATE TABLE PROJECTS (
	project_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	title VARCHAR(100) NOT NULL,
	url VARCHAR(512) NOT NULL,
	description MEDIUMTEXT NOT NULL,
	status VARCHAR(25) NOT NULL,
	last_modified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS PROJECT_TODOS;
CREATE TABLE PROJECT_TODOS (
	id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	project_id INT NOT NULL,
	title VARCHAR(100) NOT NULL,
	subtitle VARCHAR(200),
	text MEDIUMTEXT,
	status TINYINT(1) NOT NULL DEFAULT '0',
	last_modified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (project_id) REFERENCES PROJECTS(project_id) ON DELETE CASCADE
);

INSERT INTO PROJECTS (title, url, description, status) VALUES ('Image Merger', 'imagemerger.abex.dev', 'Get all images from given url and merge them to an image. (React)', 'Done..?');
INSERT INTO PROJECTS (title, url, description, status) VALUES ('Online Hex Editor', 'hexeditor.abex.dev', 'Online Hex Editor with hexadecimal-decimal-binary-ascii converter. (Vue)', 'On progress');
INSERT INTO PROJECTS (title, url, description, status) VALUES ('Exif Analyzer', 'exifanalyzer.abex.dev', 'Extract exif data from given jpeg file and update it. (Vue)', 'On progress');
INSERT INTO PROJECTS (title, url, description, status) VALUES ('blog..?', 'api.abex.dev/ms', 'My laravel application. Kind of community site.', 'Done');
