const dashboard= document.querySelector(".dash-btn");
const navMenu= document.querySelector(".nav__container__bar-menu");
const barMenu= document.querySelector(".nav__container-bar-dropdown");
const header = document.querySelector("header");
const route=document.querySelector(".route");
const bot=document.querySelector(".option-box ul");

barMenu.onclick = () => {
    console.log(navMenu.className);
    navMenu.className=="nav__container__bar-menu keep"? navMenu.classList.remove("keep"):navMenu.classList.add("keep");
}

route.onclick = () => {
    console.log(bot.className);
    bot.className=="nav__ul hidden"? bot.classList.remove("hidden"):bot.classList.add("hidden");
}

dashboard.onclick = () => {
    console.log(navMenu.className);
    navMenu.className=="nav__container__bar-menu keep"? navMenu.classList.remove("keep"):navMenu.classList.add("keep");
  };
  
if (window.location.pathname=="/") {
    header.classList.add("hidden");
}


