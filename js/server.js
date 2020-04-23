// Require express
var express = require("express");
// require path to find html file location
var path = require("path");
// require fs
var fs = require("fs")

// Sets up the Express App
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


// display notes.html when at /notes
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname,'public', "notes.html"));
});


// API GET Request
// Returns contents of notes array
app.get("/api/notes", function(req, res) {
  fs.readFile('db/db.json', "utf8", function(err, data){
    if (err){
      return console.log(err)
    }
    else {
      var notes = JSON.parse(data);
      res.json(notes);
    }
  });
});

// API Post 
// Adds new note from user to the array
app.post("/api/notes", function(req, res) {
  var newNote = req.body;
  var notes = [];

  fs.readFile('db/db.json', "utf8", function(err, data){
    if(err){
      return console.log(err)
    }
    notes = JSON.parse(data);

    var ids = [];
    for(var i = 0; i < notes.length; i++){
      ids.push(notes[i].id)
    };

    var highId = Math.max.apply(null, ids);

    newNote.id = highId + 1;

    notes.push(newNote);

    fs.writeFile('db/db.json', JSON.stringify(notes), "UTF-8", function (err){
      if (err){
        return console.log(err);
      }
      res.json(newNote);
    })
  })
});

// API Delete 
// Deletes a note from the array
app.delete('/api/notes/:id', function(req, res){
  var idDelete = req.params.id;
  var notes = [];

  fs.readFile('db/db.json', "utf8", function(err, data){
    if(err){
      return console.log(err);
    }
    
      notes = JSON.parse(data);

      for (var i = 0; i < notes.length; i++){
        if(notes[i].id == idDelete) {
          notes.splice(i,1);
        }
      }
      fs.writeFile('db/db.json', JSON.stringify(notes), "UTF-8", function (err){
        if(err){
          return console.log(err);
        }
        res.json(notes);
      })
  })
})


// Default to home page if no matching route is found
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname,'public', "index.html"));
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
  
