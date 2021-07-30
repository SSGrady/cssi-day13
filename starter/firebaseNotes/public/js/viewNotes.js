let googleUser;
let googleUserId;
window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUser = user;
      googleUserId = user.uid;
      getNotes(googleUserId);
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html'; 
    };
  });
};

const getNotes = (userId) => {
  const notesRef = firebase.database().ref(`users/${userId}`);
  notesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    renderData(data);
  });
};

const renderData = (data) => {
    const destination = document.querySelector('#app');
    destination.innerHTML = "";
    for (let key in data) {
        const note = data[key];
        destination.innerHTML += createCard(note, key);
    }
};

const createCard = (note, noteId) => {
    return `<div class="column is-one-quarter">
                <div class="card"> 
                    <header class="card-header"> 
                        <p class="card-header-title"> 
                            ${note.title} 
                        </p> 
                    </header> 
                    <div class="card-content"> 
                        <div class="content">
                            ${note.text} 
                        </div>
                    </div> 
                    <footer class="card-footer">
                    <a 
                    href="#" 
                    class="card-footer-item" 
                    onclick="editNote('${noteId}')"> 
                    Edit </a>
                    <a 
                    href="#" 
                    class="card-footer-item" 
                    onclick="deleteNote('${noteId}')"> 
                    Delete </a>
                    </footer>
                </div>
            </div>`;
};

const deleteNote = (noteId) =>{
    console.log("Delete Note")
    const noteToDeleteRef = firebase.database().ref(`users/${googleUser.uid}/${noteId}`);
    noteToDeleteRef.remove()
}

const editNote = (noteId) =>{
    console.log(`Note (${noteId}) edited`);
    const noteToEditRef = firebase.database().ref(`users/${googleUser.uid}/${noteId}`);
    noteToEditRef.once('value', (snapshot) => {
    const note = snapshot.val();
    const editNoteModal = document.querySelector("#editNoteModal");
    const editNoteTitleInput = document.querySelector('#editTitleInput');
    editNoteTitleInput.value = note.title;

    const editNoteTextInput = document.querySelector('#editTextInput');
    editNoteTextInput.value = note.text;

    editNoteModal.classList.add('is-active');
    });
    
};

const closeModal = () =>{
     const editNoteModal = document.querySelector("#editNoteModal");
     editNoteModal.classList.remove('is-active');
};

const saveChanges = () =>{
   console.log("Save changes");
    const noteTitle = document.querySelector("#editTitleInput").value;
    const noteText = document.querySelector("#editTextInput").value;
    const noteId = document.querySelector("#editNoteId").value;
    
    firebase.database().ref(`users/${googleUserId}/${noteId}`).update({
        title: notetitle,
        text: notetext,        
    });

    closeModal();
};