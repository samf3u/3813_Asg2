# Milestone 2 

## GIT:

### Layout:

The layout for the Git repository used in the second assignment is two seperate files. The Angular file consists of everything that is created by Angular when initiating a project. The server folder was created manually inside the Angular project. Once created, an express project was initiated. The reason for this is to separate the server and angular projects to make each part of the project by themselves.

### Version Control Approach: 

The approach that I took for version control is that everytime I would stop working on the project or whenever I would take a small break, I made a commit with a message of what has been changed. 

### Git Log:

 
1. **Date:** Friday 04/10/20 9:15AM  
**Command:** Git remote add orgin https://github.com/samf3u/Milestone1.git  
**Description:** Sets the remote name to origin for the remote repository  

2. **Date:** Friday 04/10/20 9:20AM  
**Command:** Git clone origin  
**Description:** Copy the content of the remote repository

3. **Date:** Friday 04/10/20 10:10AM  
**Command:** Copy and paste  
**Description:** Copy new files into the local repository 

4. **Date:** Friday 04/10/20 10:11AM  
**Command:** Git add .  
**Description:** Adds the files that were just copied 

5. **Date:** Friday 04/10/20 10:14AM  
**Command:** Git commit -m 'First Commit'   
**Description:** Commit the changes 

6. **Date:** Friday 04/10/20 10:16AM  
**Command:** Git push origin master   
**Description:** Pushes the changes to the remote repository

Following this, every time a change was made, step 4, 5 and 6 was repeated with a different commit message.

## DATA STRUCTURES:

        USER {  
          _id : String;		// User ID  
          username: String;	  
          email: String;  
          password: String;  
          role: String;		// Admin, Super, User  
	  img: String; 		// Base64 string of image
        }

        GROUP {  
          _id : String;		//Group ID  
          name: String;  
          admin: String;  
          assis: String;  
          users: [String];		// Users in group  
          rooms: [Room];		// List of rooms with room type  
        }

        ROOM{  
          name: String;  
          users: [String];		// Users in room  
          history: [message];		// Chat history  
        }
	
	MESSAGE{  
          message: String;  
          username: String;		// Username of message sent  
          img: String;			// Base64 string of image (null if no image)
        }

## REST API:

ROUTE | REQUEST BODY | RESPONSE | DESCRIPTION
----|-----|-----|----
**Login**||
usersAuth|username and password|logged in user | checks if user exists
usersCreate|username and email| status and statusMessage | create a new user
usersDelete|username|status and statusMessage | delete existing user
usersUpdate|user_id and update|status and statusMessage | update existing user
**Groups**||
groupsForUser|user ID|groups for this user | get groups for logged in user
groupsCreate|group name, admin and assis| status and statusMessage | create new group
groupsDelete| group ID| status and statusMessage | delete existing group
groupsUpdate| group_id and update| status and statusMessage| update existing group


## ANGULAR ARCHITECTURE:

### Models:
The models used for the angular architecture are provided in the 'Data Structures' section. 

### Components:
* **Login Component:** User can enter username and password
* **Groups Component:** If user logs in successfully, the user's groups are displayed
* **Rooms Component:** When a group is clicked, the rooms for this group are displayed
* **Chat Component:** When a room is clicked, the chat for this room is displayed
* **Profile Component:** When profile is clicked from the nav bar, the profile page for the logged in user is displayed

### Services:
* **Login Service:** Consists of the loginAuth, getAllUsers, createUser, deleteUser and updateUser functions which calls the web apis
* **Groups Service:** Consists of the getUserGroups, createGroup, deleteGroup and updateGroup functions which calls the web apis






>>>>>>> 1a69ee176cd1be249edc26a6ff3f2dde53ac2a3d