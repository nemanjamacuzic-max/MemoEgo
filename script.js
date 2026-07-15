/* =====================================================
   MemoEgo 2.6 FIX
   script.js
   Deo 1/8
===================================================== */

"use strict";

console.log("MemoEgo 2.6 FIX učitan");



/* =========================
   ELEMENTI PODSETNIKA
========================= */


const titleInput =
document.getElementById("title");

const descriptionInput =
document.getElementById("description");

const dateInput =
document.getElementById("date");

const timeInput =
document.getElementById("time");

const categoryInput =
document.getElementById("category");

const priorityInput =
document.getElementById("priority");

const notificationType =
document.getElementById("notificationType");

const reminderBefore =
document.getElementById("reminderBefore");

const importance =
document.getElementById("importance");

const personSelect =
document.getElementById("personSelect");


const addReminderButton =
document.getElementById("addReminder");


const reminderList =
document.getElementById("reminderList");


const emptyState =
document.getElementById("emptyState");


const searchInput =
document.getElementById("searchInput");


const filterCategory =
document.getElementById("filterCategory");




/* =========================
   MOJ DAN
========================= */


const greeting =
document.getElementById("greeting");


const currentDate =
document.getElementById("currentDate");


const assistantMessage =
document.getElementById("assistantMessage");


const todayPreview =
document.getElementById("todayPreview");


const todayCount =
document.getElementById("todayCount");


const activeCount =
document.getElementById("activeCount");


const completedCount =
document.getElementById("completedCount");





/* =========================
   MEMORIJA
========================= */


const REMINDER_KEY =
"memoego_26_reminders";


const PEOPLE_KEY =
"memoego_26_people";



let reminders = [];

let people = [];

let editingReminderId = null;





/* =========================
   ID
========================= */


function generateId(){

return Date.now();

}





/* =========================
   SAVE
========================= */


function saveReminders(){

localStorage.setItem(
REMINDER_KEY,
JSON.stringify(reminders)
);

}



function savePeople(){

localStorage.setItem(
PEOPLE_KEY,
JSON.stringify(people)
);

}





/* =========================
   LOAD
========================= */


function loadData(){


try{


const savedReminders =
localStorage.getItem(REMINDER_KEY);


const savedPeople =
localStorage.getItem(PEOPLE_KEY);



reminders =
savedReminders
?
JSON.parse(savedReminders)
:
[];



people =
savedPeople
?
JSON.parse(savedPeople)
:
[];




}

catch(error){


console.error(
"Greška učitavanja:",
error
);


reminders=[];

people=[];


}





reminders.forEach(item=>{


if(item.completed===undefined){

item.completed=false;

}



if(item.favorite===undefined){

item.favorite=false;

}



if(!item.notificationType){

item.notificationType="none";

}



if(!item.reminderBefore){

item.reminderBefore="0";

}



if(!item.importance){

item.importance="normal";

}



});



}





/* =========================
   DODAJ PODSETNIK
========================= */


function addReminder(){



if(!titleInput){

return;

}



const title =
titleInput.value.trim();




if(!title){


alert(
"Unesite naslov podsetnika."
);


return;

}




const reminder={


id:generateId(),


title:title,


description:
descriptionInput.value.trim(),


date:
dateInput.value,


time:
timeInput.value,


category:
categoryInput.value,


priority:
priorityInput.value,


notificationType:
notificationType.value,


reminderBefore:
reminderBefore.value,


importance:
importance.value,


person:
personSelect.value,


favorite:false,


completed:false,


created:
new Date().toISOString()



};




reminders.push(reminder);



saveReminders();



clearReminderForm();



renderReminders();



updateAll();



}







/* =========================
   DUGME DODAJ
========================= */


if(addReminderButton){


addReminderButton.addEventListener(
"click",
addReminder
);


}







/* =========================
   ČIŠĆENJE FORME
========================= */


function clearReminderForm(){


titleInput.value="";


descriptionInput.value="";


dateInput.value="";


timeInput.value="";


categoryInput.value="Posao";


priorityInput.value="Srednji";


notificationType.value="none";


reminderBefore.value="0";


importance.value="normal";


personSelect.value="";


}



console.log("MemoEgo 2.6 Deo 1/8 spreman");
/* =========================
   PRIKAZ PODSETNIKA
========================= */


function renderReminders(list = reminders){


if(!reminderList){

return;

}



reminderList.innerHTML="";



if(list.length===0){


if(emptyState){

emptyState.style.display="block";

}


return;


}



if(emptyState){

emptyState.style.display="none";

}





list.forEach(item=>{


const card =
document.createElement("div");



card.className =
"reminder-card";





let notificationIcon="";



switch(item.notificationType){


case "visual":

notificationIcon="👁️";

break;


case "vibration":

notificationIcon="📳";

break;


case "sound":

notificationIcon="🔊";

break;


case "both":

notificationIcon="📳🔊";

break;


default:

notificationIcon="";

}




let importanceText =
"⚪ Normalno";



if(item.importance==="important"){

importanceText =
"🟡 Važno";

}


if(item.importance==="urgent"){

importanceText =
"🔴 Hitno";

}




card.innerHTML = `


<h3>
${item.title}
</h3>



<p>
${item.description || "Bez opisa"}
</p>



<p>
📅 ${item.date || "Bez datuma"}
${item.time ? " • "+item.time : ""}
</p>



<p>
🏷️ ${item.category || "Ostalo"}
</p>



<p>
⭐ Prioritet: ${item.priority || "Srednji"}
</p>



<p>
${notificationIcon}

${
item.reminderBefore==="0"
?
"U vreme obaveze"
:
item.reminderBefore+" minuta ranije"
}

</p>



<p>
${importanceText}
</p>



${
item.person
?
"<p>👤 "+item.person+"</p>"
:
""
}



<p>

${
item.completed
?
"✅ Završeno"
:
"⏳ Aktivno"
}

</p>




<button

class="complete-btn"

data-id="${item.id}">

${
item.completed
?
"↩️ Vrati"
:
"✅ Završi"
}

</button>




<button

class="edit-btn"

data-id="${item.id}">

✏️ Izmeni

</button>





<button

class="delete-btn"

data-id="${item.id}">

🗑️ Obriši

</button>



`;




reminderList.appendChild(card);



});



}





/* =========================
   AKCIJE NA LISTI
========================= */


if(reminderList){


reminderList.addEventListener(

"click",

event=>{


const id =
Number(event.target.dataset.id);



if(!id){

return;

}




if(event.target.classList.contains("complete-btn")){


toggleComplete(id);


}



if(event.target.classList.contains("delete-btn")){


deleteReminder(id);


}



if(event.target.classList.contains("edit-btn")){


openEditModal(id);


}



}


);


}







/* =========================
   ZAVRŠI PODSETNIK
========================= */


function toggleComplete(id){



const reminder =
reminders.find(
item=>item.id===id
);



if(!reminder){

return;

}



reminder.completed =
!reminder.completed;



saveReminders();


renderReminders();


updateAll();



}







/* =========================
   OBRIŠI PODSETNIK
========================= */


function deleteReminder(id){



if(!confirm(
"Obrisati podsetnik?"
)){


return;


}



reminders =

reminders.filter(

item=>item.id!==id

);




saveReminders();



renderReminders();



updateAll();



}





console.log("MemoEgo 2.6 Deo 2/8 spreman");
/* =========================
   PRETRAGA I FILTERI
========================= */


if(searchInput){

searchInput.addEventListener(
"input",
applyFilters
);

}



if(filterCategory){

filterCategory.addEventListener(
"change",
applyFilters
);

}





function applyFilters(){


if(!searchInput || !filterCategory){

return;

}



const text =
searchInput.value
.toLowerCase()
.trim();



const filter =
filterCategory.value;





const result =

reminders.filter(item=>{


const title =
(item.title || "")
.toLowerCase();



const description =
(item.description || "")
.toLowerCase();




const textOK =

title.includes(text)

||

description.includes(text);





let filterOK=true;



switch(filter){



case "Aktivno":

filterOK =
!item.completed;

break;




case "Završeno":

filterOK =
item.completed;

break;




case "Visok":

filterOK =
item.priority==="Visok";

break;




case "Favoriti":

filterOK =
item.favorite===true;

break;



}




return textOK && filterOK;



});





renderReminders(result);



}








/* =========================
   IZMENA PODSETNIKA
========================= */


const editModal =
document.getElementById("editModal");



const editTitle =
document.getElementById("editTitle");



const editDescription =
document.getElementById("editDescription");



const editDate =
document.getElementById("editDate");



const editTime =
document.getElementById("editTime");



const editCategory =
document.getElementById("editCategory");



const editPriority =
document.getElementById("editPriority");



const editPerson =
document.getElementById("editPerson");



const saveEdit =
document.getElementById("saveEdit");



const cancelEdit =
document.getElementById("cancelEdit");







function openEditModal(id){



const reminder =

reminders.find(

item=>item.id===id

);




if(!reminder){

return;

}





editingReminderId=id;



if(editTitle)

editTitle.value =
reminder.title || "";



if(editDescription)

editDescription.value =
reminder.description || "";



if(editDate)

editDate.value =
reminder.date || "";



if(editTime)

editTime.value =
reminder.time || "";



if(editCategory)

editCategory.value =
reminder.category || "Posao";



if(editPriority)

editPriority.value =
reminder.priority || "Srednji";



if(editPerson)

editPerson.value =
reminder.person || "";





if(editModal){

editModal.style.display="block";

}



}







if(saveEdit){


saveEdit.addEventListener(

"click",

()=>{


const reminder =

reminders.find(

item=>item.id===editingReminderId

);



if(!reminder){

return;

}





reminder.title =
editTitle.value.trim();



reminder.description =
editDescription.value.trim();



reminder.date =
editDate.value;



reminder.time =
editTime.value;



reminder.category =
editCategory.value;



reminder.priority =
editPriority.value;



reminder.person =
editPerson.value;





saveReminders();



if(editModal){

editModal.style.display="none";

}



renderReminders();



updateAll();



}


);


}







if(cancelEdit){


cancelEdit.addEventListener(

"click",

()=>{


if(editModal){

editModal.style.display="none";

}


}


);


}






console.log("MemoEgo 2.6 Deo 3/8 spreman");
/* =========================
   VAŽNE OSOBE
========================= */


const personName =
document.getElementById("personName");


const personBirthday =
document.getElementById("personBirthday");


const personImportantDate =
document.getElementById("personImportantDate");


const personInterest =
document.getElementById("personInterest");


const personGift =
document.getElementById("personGift");


const personNote =
document.getElementById("personNote");


const addPersonButton =
document.getElementById("addPerson");


const peopleList =
document.getElementById("peopleList");


const peopleTotal =
document.getElementById("peopleTotal");







function addPerson(){



if(!personName){

return;

}




const name =
personName.value.trim();





if(!name){


alert(
"Unesite ime osobe."
);


return;

}




const person = {


id:generateId(),


name:name,


birthday:
personBirthday.value,


importantDate:
personImportantDate.value,


interest:
personInterest.value.trim(),


gift:
personGift.value.trim(),


note:
personNote.value.trim()


};





people.push(person);



savePeople();



clearPersonForm();



renderPeople();



updatePersonSelect();



updateAll();



}








function clearPersonForm(){



if(personName)
personName.value="";



if(personBirthday)
personBirthday.value="";



if(personImportantDate)
personImportantDate.value="";



if(personInterest)
personInterest.value="";



if(personGift)
personGift.value="";



if(personNote)
personNote.value="";



}







if(addPersonButton){


addPersonButton.addEventListener(

"click",

addPerson

);


}







function renderPeople(){



if(!peopleList){

return;

}



peopleList.innerHTML="";





if(people.length===0){


peopleList.innerHTML=

"<p>Nema dodatih osoba.</p>";


return;

}





people.forEach(person=>{



const div =
document.createElement("div");



div.className =
"person-card";




div.innerHTML = `


<h3>
👤 ${person.name}
</h3>



<p>
🎂 ${person.birthday || "Nema rođendana"}
</p>



<p>
📅 ${person.importantDate || "Nema važnog datuma"}
</p>



<p>
❤️ ${person.interest || ""}
</p>



<p>
🎁 ${person.gift || ""}
</p>



<p>
${person.note || ""}
</p>




<button

class="delete-person"

data-id="${person.id}">

🗑️ Obriši osobu

</button>



`;




peopleList.appendChild(div);



});



}





if(peopleList){


peopleList.addEventListener(

"click",

event=>{



if(event.target.classList.contains("delete-person")){


const id =
Number(event.target.dataset.id);




people =

people.filter(

person=>person.id!==id

);




savePeople();



renderPeople();



updatePersonSelect();



updateAll();



}



}


);


}






console.log("MemoEgo 2.6 Deo 4/8 spreman");
/* =========================
   OSOBE U PODSETNIKU
========================= */


function updatePersonSelect(){



if(!personSelect){

return;

}




personSelect.innerHTML = `

<option value="">

👤 Bez osobe

</option>

`;





people.forEach(person=>{


const option =
document.createElement("option");



option.value =
person.name;



option.textContent =
"👤 " + person.name;



personSelect.appendChild(option);



});



}







/* =========================
   VAŽNI DATUMI
========================= */


const importantDates =
document.getElementById("importantDates");






function renderImportantDates(){



if(!importantDates){

return;

}




importantDates.innerHTML="";



let dates=[];





people.forEach(person=>{



if(person.birthday){


dates.push({

date:person.birthday,

text:
"🎂 "+person.name+" - rođendan"

});


}





if(person.importantDate){


dates.push({

date:person.importantDate,

text:
"📅 "+person.name+" - važan datum"

});


}



});







if(dates.length===0){


importantDates.innerHTML =

"<p>Nema važnih datuma.</p>";


return;

}





dates.sort(

(a,b)=>

new Date(a.date)-new Date(b.date)

);






dates.forEach(item=>{


const p =
document.createElement("p");



p.textContent =

item.text +

" (" +

item.date +

")";



importantDates.appendChild(p);



});



}






/* =========================
   PRETRAGA OSOBA
========================= */


const peopleSearch =
document.getElementById("peopleSearch");





if(peopleSearch){


peopleSearch.addEventListener(

"input",

()=>{


const value =

peopleSearch.value

.toLowerCase()

.trim();





const cards =

document.querySelectorAll(

".person-card"

);





cards.forEach(card=>{


const text =

card.innerText

.toLowerCase();





if(text.includes(value)){


card.style.display="block";


}

else{


card.style.display="none";


}



});



}


);


}






console.log("MemoEgo 2.6 Deo 5/8 spreman");
/* =====================================================
   MemoEgo 2.6 FIX
   Deo 6/8
   SISTEM OBAVEŠTENJA
===================================================== */


/* =========================
   CENTAR OBAVEŠTENJA
========================= */


const notificationCenter =
document.getElementById("notificationCenter");





/* =========================
   PROVERA PODSETNIKA
========================= */


function checkImportantNotifications(){


const now = new Date();




const upcoming = reminders.filter(item=>{


if(item.completed){

return false;

}



if(!item.date || !item.time){

return false;

}




const reminderTime = new Date(

item.date + "T" + item.time

);





const before = Number(

item.reminderBefore || 0

);





reminderTime.setMinutes(

reminderTime.getMinutes() - before

);





const difference =

(reminderTime - now) / 60000;





return difference >= 0 && difference <= 60;



});






if(!notificationCenter){

return;

}





notificationCenter.innerHTML="";





if(upcoming.length===0){


notificationCenter.innerHTML=

"<p>🔕 Nema novih obaveštenja.</p>";


return;


}







upcoming.forEach(item=>{



const p =
document.createElement("p");



let icon="🔔";



if(item.notificationType==="visual"){

icon="👁️";

}



if(item.notificationType==="vibration"){

icon="📳";

}



if(item.notificationType==="sound"){

icon="🔊";

}



if(item.notificationType==="both"){

icon="📳🔊";

}





p.textContent =

icon + " " + item.title;



notificationCenter.appendChild(p);





/* =========================
   VIBRACIJA
========================= */


if(

(item.notificationType==="vibration" ||

item.notificationType==="both")

&&

navigator.vibrate

){


navigator.vibrate(500);


}







/* =========================
   ZVUK
========================= */


if(

item.notificationType==="sound" ||

item.notificationType==="both"

){


playNotificationSound();


}





/* =========================
   SISTEMSKA NOTIFIKACIJA
========================= */


if(

"Notification" in window

&&

Notification.permission==="granted"

){



new Notification(

"MemoEgo podsetnik",

{

body:item.title

}

);



}



});



}







/* =========================
   ZVUK OBAVEŠTENJA
========================= */


function playNotificationSound(){


try{


const audio = new Audio(

"notification.mp3"

);


audio.play();



}

catch(error){


console.log(

"Zvuk nije dostupan."

);


}



}







/* =========================
   DOZVOLA ZA NOTIFIKACIJE
========================= */


function requestNotificationPermission(){



if(

"Notification" in window

){



Notification.requestPermission();



}



}







/* =========================
   AUTOMATSKA PROVERA
========================= */


setInterval(()=>{


checkImportantNotifications();



},60000);






console.log(

"MemoEgo 2.6 Deo 6/8 spreman"

);
/* =====================================================
   MemoEgo 2.6 FIX
   Deo 7/8
   STATISTIKA + MOJ DAN + BACKUP
===================================================== */



/* =========================
   STATISTIKA
========================= */


const totalCount =
document.getElementById("totalCount");


const activeCountStat =
document.getElementById("activeCountStat");


const completedCountStat =
document.getElementById("completedCountStat");






function updateStats(){


const total =

reminders.length;




const completed =

reminders.filter(

item=>item.completed

).length;




const active =

total - completed;






if(totalCount){

totalCount.textContent = total;

}



if(activeCountStat){

activeCountStat.textContent = active;

}



if(completedCountStat){

completedCountStat.textContent = completed;

}



if(peopleTotal){

peopleTotal.textContent = people.length;

}



}









/* =========================
   MOJ DAN
========================= */


function updateMyDay(){



const today =

new Date()

.toISOString()

.split("T")[0];






const todayReminders =

reminders.filter(

item=>

item.date===today

);






if(todayCount){


todayCount.textContent =

todayReminders.length;


}







if(activeCount){


activeCount.textContent =

reminders.filter(

item=>!item.completed

).length;


}







if(completedCount){


completedCount.textContent =

reminders.filter(

item=>item.completed

).length;


}








if(todayPreview){


todayPreview.innerHTML="";





if(todayReminders.length===0){


todayPreview.innerHTML=

"<p>Nema obaveza za danas.</p>";



}





todayReminders.forEach(item=>{



const p =

document.createElement("p");



p.textContent =

"⏰ " + item.title;



todayPreview.appendChild(p);



});



}





}









/* =========================
   POZDRAV ASISTENTA
========================= */


function updateGreeting(){



if(!greeting){

return;

}



const hour =

new Date()

.getHours();





if(hour < 12){


greeting.textContent=

"Dobro jutro 👋";


}

else if(hour < 18){


greeting.textContent=

"Dobar dan 👋";


}

else{


greeting.textContent=

"Dobro veče 👋";


}






if(currentDate){



currentDate.textContent =

new Date()

.toLocaleDateString(

"sr-RS"

);



}






if(assistantMessage){


assistantMessage.textContent=

"Vaš digitalni asistent je spreman.";

}



}









/* =========================
   BACKUP IZVOZ
========================= */


const exportDataButton =

document.getElementById("exportData");



const importFile =

document.getElementById("importFile");



const importDataButton =

document.getElementById("importData");








if(exportDataButton){


exportDataButton.addEventListener(

"click",

()=>{



const backup = {


version:"MemoEgo 2.6 FIX",


date:new Date().toISOString(),


reminders:reminders,


people:people



};







const blob = new Blob(

[

JSON.stringify(

backup,

null,

2

)

],

{

type:"application/json"

}

);







const url =

URL.createObjectURL(blob);







const link =

document.createElement("a");



link.href=url;



link.download=

"MemoEgo_backup.json";





link.click();






URL.revokeObjectURL(url);





}

);


}








/* =========================
   BACKUP UVOZ
========================= */


if(importDataButton){


importDataButton.addEventListener(

"click",

()=>{



if(!importFile.files[0]){



alert(

"Izaberite backup fajl."

);



return;



}







const reader =

new FileReader();







reader.onload=function(e){



try{



const data =

JSON.parse(

e.target.result

);







reminders =

data.reminders || [];






people =

data.people || [];







saveReminders();



savePeople();






renderReminders();



renderPeople();



updatePersonSelect();



updateAll();






alert(

"Backup uspešno učitan."

);





}

catch(error){



alert(

"Greška u backup fajlu."

);



}



};






reader.readAsText(

importFile.files[0]

);




}

);


}






console.log(

"MemoEgo 2.6 Deo 7/8 spreman"

);/* =====================================================
   MemoEgo 2.6 FIX
   Deo 8/8
   ZAVRŠNA INICIJALIZACIJA
===================================================== */



/* =========================
   TAMNA TEMA
========================= */


const darkModeToggle =

document.getElementById("darkModeToggle");





if(darkModeToggle){


darkModeToggle.addEventListener(

"change",

()=>{


document.body.classList.toggle(

"dark",

darkModeToggle.checked

);




localStorage.setItem(

"memoego_dark",

darkModeToggle.checked

);



}

);


}







function loadTheme(){



const dark =

localStorage.getItem(

"memoego_dark"

);





if(

dark==="true"

){



document.body.classList.add(

"dark"

);



if(darkModeToggle){

darkModeToggle.checked=true;

}



}



}







/* =========================
   OSVEŽAVANJE SVIH FUNKCIJA
========================= */


function updateAll(){



updateStats();



updateMyDay();



updateGreeting();



renderImportantDates();



checkImportantNotifications();



}







/* =========================
   POKRETANJE APLIKACIJE
========================= */


window.addEventListener(

"load",

()=>{



loadData();



loadTheme();



renderReminders();



renderPeople();



renderImportantDates();



updatePersonSelect();



updateAll();
sendRemindersToServiceWorker();




requestNotificationPermission();
/* =========================
   SLANJE PODSETNIKA
   SERVICE WORKERU
========================= */


function sendRemindersToServiceWorker(){


if(
"serviceWorker" in navigator
){


navigator.serviceWorker.ready.then(
registration=>{


registration.active.postMessage({

type:"UPDATE_REMINDERS",

reminders:reminders

});


});


}


}




console.log(

"✅ MemoEgo 2.6 FIX potpuno aktivan"

);



navigator.serviceWorker.ready.then(()=>{


console.log(

"SERVICE WORKER AKTIVAN"

);


});



}

);