# How to start

```
docker build -t test  .
docker run --name test --rm -v dist:/app/dist test
```

## Launch the REST API
- `git clone git@github.build.ge.com:223051946/ibtool-be.git`
- `cd ib-tool-be`
- `npm install`
- `npm run build`
- `npm run start`
	- you should see in the command line that application is listening to the dedicated port 8080

## Testing with Postman
- Open postman and send a GET request to localhost:8080
	- You should receive the html page of the app as response
- Open postman and send a POST request to the endpoint localhost:8080/insert/testName/testFamilyName
	- you should receive *Insert to db successful* in the response
	- Open MongoDB Compass and check that in *test-db* new document inserted to the collection *test-collection*

## Known issues
#### git pull fails and complains about permission
- you may need to generate a ssh key (if you don't have already one) in your home folder and add it to your github account as follows:
	- `ssh-keygen -t rsa`
	- copy your public key content from: `cat ~/.ssh/id_rsa/pub`
	in your github account setting got to "SSH and GPG keys" --> New SSH key. Give a name to the key and paste your public key.
Hi! I'm your first Markdown file in **StackEdit**. If you want to learn about StackEdit, you can read me. If you want to play with Markdown, you can edit me. Once you have finished with me, you can create new files by opening the **file explorer** on the left corner of the navigation bar.
