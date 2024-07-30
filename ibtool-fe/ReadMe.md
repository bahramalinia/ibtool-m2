# How to deploy
## in windows
```
cd IBTool 
docker rm -f ibtool
docker build -t ibtool . 
cd ibtool-be  
docker rm -f ibtoolbe
docker build -t ibtoolbe . 
```
- check images are built
```
docker images
```
- zip images to move to server
```
docker save -o ibtool.zip ibtool  
docker save -o ibtoolbe.zip ibtoolbe 
```
- then copy zip files to server 
## in server 
- go into the directory that you have docker-compose.yml file and stop the service. This is the directory that you will find a folder callded "db" which is a docker volume name specified in docker-compose.yml file and contains the database files. If you do deployment in another directory, you will have an empty database. Currently, this directory is located in /root/ibtool.
```
cd /root/ibtool
docker-compose down
docker rmi -f ibtool ibtoolbe
```

- go into directory that you copied zip files of images:
```
docker load -i ibtool.zip  
docker load -i ibtoolbe.zip 
```
- check if images are loaded: 
```
docker images 
```

- go into the directory that you have docker-compose.yml file (i.e., /root/NEW-IB-TOOL/IBApp) run: 
```
docker-compose up -d 
``` 
- check if containers are running 
```
docker ps 
```
- to stop (you should be in direcotry of docker-compose.yml file) 
```
docker-compose down 
```


## Backup database 
### Prerequisites

Before performing database backup and restore operations for the IBTool project, ensure that you have the following tools installed:

- `mongodump`: A tool for creating backups of MongoDB databases.
- `mongorestore`: A tool for restoring backups created by `mongodump`.

### Backup Database

To create a backup of the IBTool database, follow these steps:

1. Open PowerShell in the Windows environment.
2. Run the following command to create a backup:
   - If the database is password-protected:
     ```
     mongodump --uri="mongodb://<username>:<password>@10.135.254.11:27017/?authSource=ibtool" --out ibtooldump_19_03_2023_staging
     ```
     Replace `<username>` and `<password>` with the actual credentials for accessing the MongoDB database. This command will create a snapshot of all collections in a folder called "ibtooldump_19_03_2023_staging".
   - If the database is not password-protected:
     ```
     mongodump --uri="mongodb://3.213.71.116:27017" --out ibtooldump_19_03_2023_prod
     ```
     This command will create a snapshot of all collections in a folder called "ibtooldump_19_03_2023_prod".

### Restore Backup

To restore a backup of the IBTool database, follow these steps:

1. Open PowerShell or a terminal window.
2. Run the following command to restore the backup:
   ```
   mongorestore --port=<port number> <path to the backup>
   ```
   Replace `<port number>` with the MongoDB server's port number, and `<path to the backup>` with the path to the backup folder. For example:
   ```
   mongorestore --port=27017 dump-2013-10-25/
   ```
   This command will import the database backup located in the "dump-2013-10-25" directory to the MongoDB instance running on the default port 27017 of the local machine.

### Restore Local Dump on Remote Database

To restore a local database dump on a remote MongoDB database, follow these steps:

1. Open PowerShell or a terminal window.
2. Run the following command, replacing the placeholders with appropriate values:
   ```
   mongorestore --host=$HOST --port=$PORT -u $ADMIN_USER -p $PSWD --db <your-db> <absolute-path-to-restore-db>
   ```
   For example:
   ```
   mongorestore --host=10.135.254.11 --port=27017 --db ibtool dump_2023_01_08\ibtool --verbose
   ```
   This command will restore the database dump located at the specified absolute path to the remote MongoDB database.

### Create Text Index for Searching

To enable searching on all fields in the IBTool database, you can create a text index using the `mongosh` shell:

1. Open the `mongosh` shell by running the following command:
   ```
   mongosh <Connection String> // e.g., mongodb://localhost:27017/
   ```
   Replace `<Connection String>` with the connection string for your MongoDB instance.
2. Switch to the IBTool database by running the following command within the `mongosh` shell:
   ```
   use ibtool
   ```
3. Create the text index for all fields using the following command:
   ```
   db.recordtest.createIndex({ "$**": "text" }, { name: "TextIndex" })
   ```
   This command will create a text index named "TextIndex