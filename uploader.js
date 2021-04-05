const admin = require('firebase-admin');

const serviceAccount = require('./service_key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();
const path = require('path');
const fs = require('fs');
const directoryPath = path.join(__dirname, 'files');

async function deleteCollection(path) {
  firestore
    .collection(path)
    .listDocuments()
    .then((val) => {
      val.map((val) => {
        val.delete();
      });
    });
}

fs.readdir(directoryPath, function (err, files) {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }

  files.forEach(async function (file) {
    var lastDotIndex = file.lastIndexOf('.');

    var menu = require('./files/' + file);

    await deleteCollection(file.substring(0, lastDotIndex));

    menu.forEach(function (obj) {
      firestore
        .collection(file.substring(0, lastDotIndex))
        .add(obj)
        .then(function (docRef) {
          console.log('Document written');
        })
        .catch(function (error) {
          console.error('Error adding document: ', error);
        });
    });
  });
});
