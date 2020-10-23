# project-bbqed
project-bbqed created by GitHub Classroom

Upon cloning the sportcred folder
There are dependencies that are required to be installed
Follow the steps carefully to ensure the code runs correctly on your respective devices

1. Ensure that node is installed
To check,
Open up your command prompt
cd to the sportcred folder and type in
     Node -v

If a version shows, then node is installed on your system. Otherwise, you would need to install it 
https://nodejs.org/en/

After installation, type the line below in the terminal of Visual studio code
     Node -v 

If it's not being recognized then add the nodeJS folder path to the environment variable: PATH

**Steps following from here assume lines are typed into the terminal of Visual Studio Code**

2. From the project-bbqed directory, run the following command:
     npm install

3. Test that everything related to backend is working by typing the following in 'project-bbqed/backend':
     nodemon server
     
If successful, the server would open and the database can be accessed. 
In terminal, you should see:
     "Server is running on port: 5000
      MongoDB database connection established successfully"

4. Test that everything related to frontend is working by typing the following in 'project-bbqed':
     npm start 
     
If configured correctly, the code would redirect to a localhost where frontend code is visible
