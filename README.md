# Markdown Note-taking App
Markdown Note-taking App that can upload .md files, check their grammar and parse them to .html.
Sample project for [Markdown Note-taking App](https://roadmap.sh/projects/markdown-note-taking-app) from [roadmap.sh](https://roadmap.sh/)

## Usage:
First go to [Sapling AI](https://sapling.ai/) and get your SAPLING_API_KEY and paste it into the .env file.
Go to terminal inside the root of the project and run:
```bash
node index.js
```

For test example using `test.md` in the root of the project, in terminal, position yourself again to the project route.
Then you can just copy the following commands:
`/upload` - Upload the file
example:
```bash
curl -X POST -F "file=@test.md" http://localhost:3000/upload
```

`/notes` - List all uploaded files
example:
```bash
curl -X GET http://localhost:3000/notes
```

`/notes/html/:filename` - Get the html content of the file
example:
```bash
curl -X GET http://localhost:3000/notes/html/1735160320712-735080291-test.md
```

`/notes/tone/:filename` - Get the tone analysis of the file (inspect grammar)
example:
```bash
curl -X GET http://localhost:3000/notes/tone/1735160320712-735080291-test.md
```

In the supplied arguments `file` matches `file` from `upload.single('file')` which is necessary to for the endpoint to upload the file as is the naming for `test.md` (file prepared for testing puropses).
Since `test.md` is in the root of the project (where we are positioned in terminal, or at least shoud be 😉) path to the file is not required.
If you want to upload other files from other directories just supply their path prefixing the name.

For html content and tone analysis you can only use the files listed by `/notes` endpoint (files that are already uploaded to the repo).
