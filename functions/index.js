const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const app = express();
const firebase = require('firebase');
const googleStorage = require('@google-cloud/storage');
const Multer = require('multer');
admin.initializeApp(functions.config().firebase);
var stream = require('stream');



exports.helloWorld = functions.https.onRequest((request, response) => {
    console.log('bla');

var Base64 = {
    characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" ,

    encode: function( string )
    {
        var characters = Base64.characters;
        var result     = '';

        var i = 0;
        do {
            var a = string.charCodeAt(i++);
            var b = string.charCodeAt(i++);
            var c = string.charCodeAt(i++);

            a = a ? a : 0;
            b = b ? b : 0;
            c = c ? c : 0;

            var b1 = ( a >> 2 ) & 0x3F;
            var b2 = ( ( a & 0x3 ) << 4 ) | ( ( b >> 4 ) & 0xF );
            var b3 = ( ( b & 0xF ) << 2 ) | ( ( c >> 6 ) & 0x3 );
            var b4 = c & 0x3F;

            if( ! b ) {
                b3 = b4 = 64;
            } else if( ! c ) {
                b4 = 64;
            }

            result += Base64.characters.charAt( b1 ) + Base64.characters.charAt( b2 ) + Base64.characters.charAt( b3 ) + Base64.characters.charAt( b4 );

        } while ( i < string.length );

        return result;
    } ,

    decode: function( string )
    {
        var characters = Base64.characters;
        var result     = '';

        var i = 0;
        do {
            var b1 = Base64.characters.indexOf( string.charAt(i++) );
            var b2 = Base64.characters.indexOf( string.charAt(i++) );
            var b3 = Base64.characters.indexOf( string.charAt(i++) );
            var b4 = Base64.characters.indexOf( string.charAt(i++) );

            var a = ( ( b1 & 0x3F ) << 2 ) | ( ( b2 >> 4 ) & 0x3 );
            var b = ( ( b2 & 0xF  ) << 4 ) | ( ( b3 >> 2 ) & 0xF );
            var c = ( ( b3 & 0x3  ) << 6 ) | ( b4 & 0x3F );

            result += String.fromCharCode(a) + (b?String.fromCharCode(b):'') + (c?String.fromCharCode(c):'');

        } while( i < string.length );

        return result;
    }
};
//     const storage = googleStorage({
//         projectId: "faq-wlwnhq",
//         keyFilename: "./FAQ-wlwnhq-497f10ea035e.json"
//     });
//
// const bucket = storage.bucket("<Firebase Storage Bucket URL");

//////////
//try {
// Imports the Google Cloud client library
  //  const Storage = require('@google-cloud/storage');

// // Your Google Cloud Platform project ID
//     const projectId = 'faq-wlwnhq';
//
// // Creates a client
//     const storage = new Storage({
//         projectId: projectId
//     });
//
// // The name for the new bucket
//     const bucketName = 'faq-bucket';
//
// // Creates the new bucket
//     storage.createBucket(bucketName);
// }
// catch(er){
//     response.send(er.message);
// }



const Storage = require('@google-cloud/storage');
const storage = new Storage();

var dataUriImage = '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15UJjlgJ93k6BEwgp1syD3gjBHJZHBzq1IJzntBGYLvZayBgArnGOnoW6yBASK/MWWc5F2admbsVIzADARPIDND8yGURIAT8Zd3sTCCXXWZPbC0ETCBrIel2roIATnTV0mqx8sJVcPY8LoCACeQCi+gpGAEjYASOQMAEcgTq7tMIGAEjcAEETCAXWERPwQgYASNwBAImkCNQd59GwAgYgQsgYAK5wCJ6CkbACBiBIxAwgRyBuvs0AkbACFwAARPIBRbRUzACRsAIHIGACeQI1N2nETACRuACCJhALrCInoIRMAJG4AgETCBHoO4+jYARMAIXQMAEcoFF9BSMgBEwAkcgYAI5AnX3aQSMgBG4AAImkAssoqdgBIyAETgCARPIEai7TyNgBIzABRAwgVxgET0FI2AEjMARCJhAjkDdfRoBI2AELoCACeQCi+gpGAEjYASOQMAEcgTq7tMIGAEjcAEETCAXWERPwQgYASNwBAImkCNQd59GwAgYgQsgYAK5wCJ6CkbACBiBIxAwgRyBuvs0AkbACFwAARPIBRbRUzACRsAIHIGACeQI1N2nETACRuACCJhALrCInoIRMAJG4AgETCBHoO4+jYARMAIXQMAEcoFF9BSMgBEwAkcgYAI5AnX3aQSMgBG4AAImkAssoqdgBIyAETgCARPIEai7TyNgBIzABRAwgVxgET0FI2AEjMARCPw/NbZ+bp5PLR4AAAAASUVORK5CYII=';

var bufferStream = new stream.PassThrough();
bufferStream.end(new Buffer(Base64.decode(request.query.dataImageUri), 'base64'));
var myBucket = storage.bucket('faq-bucket');
var file = myBucket.file('danidemo.png');

bufferStream.pipe(file.createWriteStream({
    metadata: {
        contentType: 'image/png',
        metadata: {
            custom: 'metadata'
        }
    },
    public: true
    // validation: "md5"
}))
    .on('error', function(err) {response.send(err.message());})
    .on('finish', function(res) {
        // The file upload is complete.
        response.send("file upload complete-" + Base64.decode(request.query.dataImageUri));
    });

// Uploads a local file to the bucket
// var fileResponse = storage.bucket(myBucket).upload()  (file);
// [END storage_upload_file]
/////////
//
// try {
// // Create a root reference
// // var storageRef = admin.firebase.storage().ref();
//     var defaultStorage = admin.storage();
// // Create a reference to 'mountains.jpg'
// // var mountainsRef = defaultStorage.child('mountains.jpg');
// //
// // // Create a reference to 'images/mountains.jpg'
// // var mountainImagesRef = defaultStorage.child('images/mountains.jpg');
// //
// // // While the file names are the same, the references point to different files
// //  mountainsRef.name === mountainImagesRef.name            // true
// //  mountainsRef.fullPath === mountainImagesRef.fullPath    // false
//
//     var message = 'data:text/plain;base64,5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB';
//
//     defaultStorage.putString(message, 'data_url');
// }
// catch (ex) {
//     response.send(ex.message + ' 1stor: ' + defaultStorage);
// }
// response.send(fileResponse);
})

