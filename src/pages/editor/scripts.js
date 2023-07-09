const { ipcRenderer} = require('electron');

//ELEMENTOS
const textarea = document.getElementById('text');
const title = document.getElementById('title');

//SETFILE

ipcRenderer.on('set-file', function(event,data){
  textarea.value = data.content;
  title.innerHTML = data.name+' | PADUA DEV';
});