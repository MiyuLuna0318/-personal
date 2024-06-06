// 訂閱按鈕
document.addEventListener('DOMContentLoaded', function () {
    const subscribeBtn = document.getElementById('subscribeBtn');

    // 檢查 localStorage 中的訂閱狀態
    if (localStorage.getItem('subscribed') === 'true') {
        subscribeBtn.classList.add('subscribed');
        subscribeBtn.textContent = '已訂閱';
    }

    subscribeBtn.addEventListener('click', function () {
        if (subscribeBtn.classList.contains('subscribed')) {
            const confirmUnsubscribe = confirm('你要取消訂閱嗎?');
            if (confirmUnsubscribe) {
                subscribeBtn.classList.remove('subscribed');
                subscribeBtn.textContent = '訂閱';
                localStorage.setItem('subscribed', 'false');
            }
        } else {
            subscribeBtn.classList.toggle('subscribed');
            if (subscribeBtn.classList.contains('subscribed')) {
                subscribeBtn.textContent = '已訂閱';
                alert('你已經訂閱此網站的消息！');
                localStorage.setItem('subscribed', 'true');
            }
        }
    });
});

// 相關資訊-輪播效果
document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.querySelector('.carousel');
    const carouselImages = document.querySelectorAll('.carousel img');
    const prevButton = document.querySelector('.carousel-button-left');
    const nextButton = document.querySelector('.carousel-button-right');
    let currentIndex = 0;
    const imageWidth = carouselImages[0].clientWidth;
    const totalImages = carouselImages.length;

    function showImage(index) {
        carousel.style.transform = `translateX(${-index * imageWidth}px)`;
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % totalImages;
        showImage(currentIndex);
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        showImage(currentIndex);
    }

    nextButton.addEventListener('click', nextImage);
    prevButton.addEventListener('click', prevImage);

    setInterval(nextImage, 3000); // 每3秒自動輪播一次
});

// 海洋汙染-手刻燈箱效果
document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.card');
    const lightbox = document.getElementById('lightbox');
    const close = document.querySelector('.close');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxDescription = document.querySelector('.lightbox-description');

    cards.forEach(card => {
        card.addEventListener('click', function () {
            const image = card.getAttribute('data-image');
            const title = card.getAttribute('data-title');
            const description = card.getAttribute('data-description');

            lightboxImage.src = image;
            lightboxTitle.textContent = title;
            lightboxDescription.textContent = description;

            lightbox.style.display = 'block';
        });
    });

    close.addEventListener('click', function () {
        lightbox.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });
});

// 近期活動-日曆&活動切換。
document.addEventListener('DOMContentLoaded', function () {
    const calendarBody = document.getElementById('calendar-body');
    const monthYear = document.getElementById('calendar-month-year');
    const prevMonth = document.getElementById('prev-month');
    const nextMonth = document.getElementById('next-month');
    const eventContainer = document.getElementById('event-container');
    const moreActivities = document.querySelector('.more-activities');

    let currentDate = new Date();
    let lastClickedDate = null;

    // 日曆
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
        const lastDayOfLastMonth = month === 0 ? new Date(year - 1, 11, 0).getDate() : new Date(year, month, 0).getDate();

        monthYear.textContent = `${year}年${month + 1}月`;

        let days = "";
        let cells = "";

        // 上個月的日期填充
        for (let i = firstDayOfMonth; i > 0; i--) {
            cells += `<td class="prev-month" data-date="${year}-${month}-${lastDayOfLastMonth - i + 1}">${lastDayOfLastMonth - i + 1}</td>`;
        }

        // 當月的日期填充
        for (let i = 1; i <= lastDateOfMonth; i++) {
            const fullDate = `${year}-${month + 1}-${i}`;
            if (i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
                cells += `<td class="today" data-date="${fullDate}">${i}</td>`;
            } else {
                cells += `<td data-date="${fullDate}">${i}</td>`;
            }

            if ((cells.split('</td>').length - 1) % 7 === 0) {
                days += `<tr>${cells}</tr>`;
                cells = "";
            }
        }

        // 下個月的日期填充
        let nextDays = 1;
        while ((cells.split('</td>').length - 1) % 7 !== 0) {
            cells += `<td class="next-month" data-date="${year}-${month + 2}-${nextDays}">${nextDays}</td>`;
            nextDays++;
        }

        if (cells !== "") {
            days += `<tr>${cells}</tr>`;
        }

        calendarBody.innerHTML = days;

        // 活動顯示
        const dateCells = calendarBody.querySelectorAll('td[data-date]');
        dateCells.forEach(cell => {
            cell.addEventListener('click', (event) => {
                const selectedDate = event.target.getAttribute('data-date');
                shuffleEvents(selectedDate);
            });
        });
    }

    function shuffleEvents(selectedDate) {
        if (selectedDate === lastClickedDate) {
            return; // If the selected date is the same as the last clicked date, do nothing.
        }

        lastClickedDate = selectedDate;
        const events = Array.from(eventContainer.getElementsByClassName('event'));
        events.forEach(event => event.classList.add('hidden'));

        setTimeout(() => {
            shuffleArray(events);
            const shuffledEventsFragment = document.createDocumentFragment();
            events.forEach(event => {
                event.classList.remove('hidden');
                shuffledEventsFragment.appendChild(event);
            });
            eventContainer.innerHTML = '';
            eventContainer.appendChild(shuffledEventsFragment);
            eventContainer.appendChild(moreActivities);
        }, 500);
    }

    prevMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    nextMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    renderCalendar(currentDate);

    
});

// 獲取所有日期格子
const calendarCells = document.querySelectorAll('.calendar-table td');

// 添加點擊事件監聽器到每個日期格子上
calendarCells.forEach(cell => {
    cell.addEventListener('click', function() {
        // 移除所有日期格子上的active類
        calendarCells.forEach(cell => {
            cell.classList.remove('active');
        });
        // 添加點擊的日期格子上的active類
        this.classList.add('active');
        // 更改按鈕樣式
        subscribeBtn.classList.add('active');
    });
});


// 捐款頁面JS
document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.radio-group button');
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const activeButton = document.querySelector('.radio-group button.clicked');
            if (activeButton) {
                activeButton.classList.remove('clicked');
            }
            button.classList.add('clicked');
        });
    });
});

document.querySelector('.btn-next').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('initialBox').classList.add('hidden');
    document.getElementById('newFormContent').classList.remove('hidden');
});