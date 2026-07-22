


// حالت روز/شب

const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {
    themeToggle.addEventListener("click", function(){
        const active = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
        const next = active === "light" ? "dark" : "light";

        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
    });
}


// ===================================================================
// منوی همبرگری
// قبلاً دکمه در HTML وجود داشت اما هیچ رویدادی برایش تعریف نشده بود،
// برای همین با کلیک هیچ اتفاقی نمی‌افتاد. این بخش آن را فعال می‌کند.
// ===================================================================

const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");

function closeMenu(){
    if(!menuToggle || !mainNav) return;
    menuToggle.classList.remove("open");
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
}

function openMenu(){
    if(!menuToggle || !mainNav) return;
    menuToggle.classList.add("open");
    mainNav.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
}

if(menuToggle && mainNav){

    menuToggle.addEventListener("click", function(e){
        e.stopPropagation();
        const isOpen = mainNav.classList.contains("open");
        isOpen ? closeMenu() : openMenu();
    });

    // با کلیک روی هر لینک، منو بسته شود (مخصوصاً در موبایل)
    mainNav.querySelectorAll("a").forEach(function(link){
        link.addEventListener("click", closeMenu);
    });

    // کلیک بیرون از منو، آن را می‌بندد
    document.addEventListener("click", function(e){
        if(!mainNav.classList.contains("open")) return;
        if(mainNav.contains(e.target) || menuToggle.contains(e.target)) return;
        closeMenu();
    });

    // بستن منو با کلید Escape
    document.addEventListener("keydown", function(e){
        if(e.key === "Escape") closeMenu();
    });

}


// ===================================================================
// پارالاکس پس‌زمینه
// هر حباب (orb) یک ویژگی data-speed دارد؛ هرچه عدد بزرگ‌تر باشد،
// آن لایه سریع‌تر از اسکرول صفحه جابه‌جا می‌شود و همین اختلاف سرعت
// بین لایه‌ها حس عمق (parallax) را می‌سازد. برای کسانی که حرکت کم
// را ترجیح می‌دهند (prefers-reduced-motion) این جلوه غیرفعال می‌شود.
// ===================================================================

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const parallaxLayers = document.querySelectorAll(".orb");
let ticking = false;

function updateParallax(){
    const scrollY = window.scrollY;

    parallaxLayers.forEach(function(layer){
        const speed = parseFloat(layer.dataset.speed) || 0.1;
        layer.style.transform = "translateY(" + (scrollY * speed) + "px)";
    });

    ticking = false;
}

if(parallaxLayers.length && !prefersReducedMotion){
    window.addEventListener("scroll", function(){
        if(!ticking){
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}


// ===================================================================
// نمایان‌شدن بخش‌ها هنگام اسکرول
// ===================================================================

const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll(){

    revealElements.forEach(element => {

        const position = element.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;
        
if(position < screenHeight - 80){
            element.classList.add("show");
        } 
        else {
            element.classList.remove("show");
        }

    });

}

window.addEventListener("scroll", revealOnScroll);

revealOnScroll();


const typing = document.getElementById("typing");

if(typing){

const text = "Front-end Developer";

let index = 0;
let deleting = false;


function typeEffect(){

    if(!deleting){

        typing.textContent = text.substring(0,index);
        index++;

        if(index > text.length){

            deleting = true;
            setTimeout(typeEffect,1800);
            return;

        }

    }else{

        typing.textContent = text.substring(0,index);
        index--;

        if(index < 0){

            deleting = false;
            index = 0;

        }

    }


    setTimeout(
        typeEffect,
        deleting ? 70 : 120
    );

}


setTimeout(typeEffect,1200);


            }

