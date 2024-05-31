// script.js

let currentIndex = 0;
const images = document.querySelectorAll('.carousel img');
const totalImages = images.length;

function showNextImage() {
    currentIndex = (currentIndex + 1) % totalImages;
    updateCarousel();
    if (currentIndex === totalImages - 1) {
        setTimeout(() => {
            currentIndex = 0;
            updateCarousel();
        }, 0); // 延迟一段时间以确保用户能够看到最后一张图
    }
}

function updateCarousel() {
    const carousel = document.querySelector('.carousel');
    const offset = -currentIndex * 100;
    carousel.style.transform = `translateX(${offset}%)`;
}

// 自动轮播
setInterval(showNextImage, 3000);
