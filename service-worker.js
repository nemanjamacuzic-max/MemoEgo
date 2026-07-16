/* =====================================================
   MemoEgo 2.7 FIX
   service-worker.js
   PWA + NOTIFIKACIJE
===================================================== */

"use strict";


const CACHE_NAME =

"memoego-2.7-notification-v1";



const FILES_TO_CACHE = [


"index.html",

"style.css",

"script.js",

"manifest.json",


"icons/icon-192.png",

"icons/icon-512.png"


];



let reminders = [];






/* =========================
   INSTALACIJA
========================= */


self.addEventListener(

"install",

event=>{


event.waitUntil(


caches.open(

CACHE_NAME

)

.then(cache=>{


return cache.addAll(

FILES_TO_CACHE

);


})


);



self.skipWaiting();



}

);







/* =========================
   AKTIVACIJA
========================= */


self.addEventListener(

"activate",

event=>{


event.waitUntil(


caches.keys()

.then(keys=>{


return Promise.all(


keys.map(key=>{


if(key!==CACHE_NAME){


return caches.delete(key);


}



})


);


})


);



self.clients.claim();



}

);







/* =========================
   PRIJEM PODATAKA
========================= */


self.addEventListener(

"message",

event=>{


if(

event.data &&

event.data.type ===

"UPDATE_REMINDERS"

){



reminders =

event.data.reminders || [];





console.log(

"MemoEgo SW podsetnici:",

reminders.length

);



}



});
/* =========================
   PROVERA PODSETNIKA
========================= */


function checkReminders(){



const now =

new Date();





reminders.forEach(item=>{



if(item.completed){

return;

}





if(!item.date || !item.time){

return;

}






const reminderTime =

new Date(

item.date +

"T" +

item.time

);






const before =

Number(

item.reminderBefore || 0

);






reminderTime.setMinutes(

reminderTime.getMinutes()

-

before

);






const difference =

(reminderTime - now) / 60000;







if(

difference >=0 &&

difference <=1

){





self.registration.showNotification(

"MemoEgo podsetnik",

{


body:

item.title,



icon:

"icons/icon-192.png",



badge:

"icons/icon-192.png",



vibrate:

[300,100,300],



tag:

"memoego-"+item.id



}

);




}



});



}







/* =========================
   PERIODIČNA PROVERA
========================= */


/*
Napomena:
Service Worker ne garantuje
stalni interval u pozadini.

Ovaj interval radi dok je SW aktivan.
Glavna sigurnost dolazi iz
event-based buđenja sistema.
*/



setInterval(()=>{


checkReminders();



},60000);








/* =========================
   PUSH PRIPREMA
========================= */


self.addEventListener(

"push",

event=>{



const data =

event.data

?

event.data.text()

:

"Nova obaveza";






event.waitUntil(



self.registration.showNotification(

"MemoEgo",

{


body:data,


icon:

"icons/icon-192.png"



}


)



);



});
/* =========================
   KLIK NA OBAVEŠTENJE
========================= */


self.addEventListener(

"notificationclick",

event=>{


event.notification.close();





event.waitUntil(


clients.matchAll({

type:"window",

includeUncontrolled:true

})


.then(clientList=>{



if(clientList.length>0){


return clientList[0].focus();



}



return clients.openWindow(

"index.html"

);



})


);



}

);








/* =========================
   OFFLINE PODRŠKA
========================= */


self.addEventListener(

"fetch",

event=>{



event.respondWith(



fetch(event.request)

.catch(()=>{


return caches.match(

event.request

);



})



);



}

);







console.log(

"MemoEgo 2.7 Service Worker aktivan"

);
