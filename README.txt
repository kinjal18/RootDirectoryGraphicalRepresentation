# Project Title

File Manager

## Getting Started

main.js
index.js
loadFiles.js
mainWindow.html
loading.html
loading.css


## Installing and Use

npm install electron
npm install url
npm install path
npm install fs
npm install rimraf
npm install vis
npm install os


##Getting Started
Open a terminal window
Navigate to where the project is saved

Run this command: "npm start"

The program will begin at the C:\User\(username)\Videos where username will be 
dynamically generated to recreate the user's 'Videos' folder. The user can 
navigate to other directories using the "View Another Directory" button. Upon
selecting another directory, the application will refresh and represent the new
folder along with the 'Videos' folder

## Functionality

  *Create Empty Files
	* Click "File" in the menu
	* Click "Create File or Folder"
	* Create a file anywhere on the computer 
	* The application will refresh to show the new file
		*If the file was created in a folder that is not currently being 
		 'viewed', you will NOT see the file on the application
  *Remove Files
	* Double click any file to delete it
	* The application will refresh to reflect the change

  *Create Empty Directories
	* Click "File" in the menu
	* Click "Create File or Folder"
	* Click "New Folder" 
	* Create a folder anywhere on the computer 
	* The application will create the new folder on the computer but the
	  folder will NOT show up until it has at least one file in it
	
  *Remove Directories
	* Click "Directory" in the menu
	* Click "Delete Directory"
	* Select the folder you would like to delete
	* The folder and everything in it will be deleted on the computer
	* Refresh the application to view the change
	
  *Copy Files Anywhere
	* Not implemented

  *Move Files Anywhere
	* Not implemented

  *Information About Files 
	* Not implemented

  *Navigating to other directories
	* Click "View Another Directory" 
	* Select the folder you would like to view
		* Large folders will take a long time to load

  *Additional Feature
	* There is a loading screen implemented that will show while the
	  application loads
	* The 'Cluster by hubsize' button will cluster the files
		* This will be particularly useful if the user is viewing a lot
		  of files
	
  