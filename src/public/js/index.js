const dashboard= document.querySelector(".dash-btn");
const contain1= document.querySelector("#container-fluid1");
const menu= document.querySelector("#barra-menu");
const header = document.querySelector("header");
const route=document.querySelector(".route");
const bot=document.querySelector(".option-box ul");

menu.onclick = () => {
    console.log(contain1.className);
    contain1.className=="col s12 m6 l4 hide"? contain1.classList.remove("hide"):contain1.classList.add("hide");
}

route.onclick = () => {
    console.log(bot.className);
    bot.className=="nav__ul hidden"? bot.classList.remove("hidden"):bot.classList.add("hidden");
}

dashboard.onclick = () => {
    console.log(contain1.className);
    contain1.className=="col s12 m6 l4 hide"? contain1.classList.remove("hide"):contain1.classList.add("hide");
  };
  
if (window.location.pathname=="/") {
    header.classList.add("hide");
}


