import firebase from 'firebase/app'
import 'firebase/storage'
import {upload} from './upload.js'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAOV9B9DyHdwFrsxfGaBmjiuE6-47Dx5q0",
    authDomain: "pics-upload-c871f.firebaseapp.com",
    projectId: "pics-upload-c871f",
    storageBucket: "pics-upload-c871f.appspot.com",
    messagingSenderId: "991330809337",
    appId: "1:991330809337:web:c204664a9b72935730f928"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

upload('#file', {
    multiLoad: true,
    accept: ['.png', '.jpg', '.jpeg', '.gif'],
    onUpload(files, blocks) {

        files.forEach((file, index) => {
            const ref = storage.ref(`image/${file.name}`);
            const task = ref.put(file);

            task.on('state_changed' , snapshot => {
                const persentage = ((snapshot.bytesTransferred / snapshot.totalBytes)*100).toFixed(0) + '%';
                const block = blocks[index].querySelector('.preview-info-progress');
                block.textContent = persentage;
                block.style.width = persentage;

            }, error => {
                console.log(error);
            }, () => {
                task.snapshot.ref.getDownloadURL().then(url => {
                    console.log('Download URL = ', url);
                });
            });


        })
    }
});
