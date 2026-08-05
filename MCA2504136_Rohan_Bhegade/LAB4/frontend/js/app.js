// ================================
// Attendance Management System
// Landing Page JavaScript
// ================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("Attendance Management System Loaded");

    // Navbar Scroll Effect
    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 80) {
            navbar.classList.add("active");
        } else {
            navbar.classList.remove("active");
        }
    });

    // Smooth Scroll
    const links = document.querySelectorAll("a[href^='#']");

    links.forEach(link => {
        link.addEventListener("click", function(e) {

            e.preventDefault();

            const target = document.querySelector(this.getAttribute("href"));

            if(target){
                target.scrollIntoView({
                    behavior:"smooth"
                });
            }

        });
    });

    // Animated Counter

    const counters = document.querySelectorAll(".counter");

    counters.forEach(counter=>{

        counter.innerText="0";

        const updateCounter=()=>{

            const target=+counter.getAttribute("data-target");
            const count=+counter.innerText;

            const increment=target/100;

            if(count<target){

                counter.innerText=Math.ceil(count+increment);

                setTimeout(updateCounter,20);

            }else{

                counter.innerText=target;

            }

        };

        updateCounter();

    });

});