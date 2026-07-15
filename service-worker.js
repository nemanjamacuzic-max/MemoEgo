/* =====================================================
   MemoEgo 2.6
   service-worker.js
   PWA keš + notifikacije
===================================================== */

"use strict";


const CACHE_NAME = "memoego-2.6-notification-v3";


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
event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

        .then(cache => {

            return cache.addAll(FILES_TO_CACHE);

        })

    );


    self.skipWaiting();

});







/* =========================
   AKTIVACIJA
========================= */


self.addEventListener(
"activate",
event => {


    event.waitUntil(

        caches.keys()

        .then(keys => {

            return Promise.all(

                keys.map(key => {

                    if(key !== CACHE_NAME){

                        return caches.delete(key);

                    }

                })

            );

        })

    );


    self.clients.claim();


});







/* =========================
   PRIJEM PODATAKA
========================= */


self.addEventListener(
"message",
event => {


    if(event.data && event.data.type === "UPDATE_REMINDERS"){


        reminders = event.data.reminders || [];


        console.log(
        "MemoEgo podsetnici:",
        reminders.length
        );


    }


});







/* =========================
   PROVERA PODSETNIKA
========================= */


function checkReminders(){


    const now = new Date();


    reminders.forEach(item => {


        if(item.completed){

            return;

        }


        if(!item.date || !item.time){

            return;

        }



        const reminderTime = new Date(

            item.date +
            "T" +
            item.time

        );



        const difference =

        (reminderTime - now) / 60000;



        if(
            difference >= 0 &&
            difference <= 1
        ){


            self.registration.showNotification(

                "MemoEgo podsetnik",

                {

                    body: item.title,


                    icon:
                    "icons/icon-192.png",


                    badge:
                    "icons/icon-192.png",


                    vibrate:
                    [300,100,300],


                    tag:
                    "memoego-" + item.id

                }

            );


        }


    });


}







/* =========================
   PERIODIČNA PROVERA
========================= */


setInterval(

    () => {

        checkReminders();

    },

    60000

);







/* =========================
   KLIK NA OBAVEŠTENJE
========================= */


self.addEventListener(

"notificationclick",

event => {


    event.notification.close();



    event.waitUntil(


        clients.matchAll({

            type:"window"

        })

        .then(clientList => {


            if(clientList.length > 0){

                return clientList[0].focus();

            }



            return clients.openWindow(

                "index.html"

            );


        })

    );


});







/* =========================
   UČITAVANJE
========================= */


self.addEventListener(

"fetch",

event => {


    event.respondWith(

        fetch(event.request)

        .catch(() => {

            return caches.match(event.request);

        })

    );


});