let items = document.querySelectorAll('.slider .list .item');
let next = document.getElementById('next');
let prev = document.getElementById('prev');
let thumbnails = document.querySelectorAll('.thumbnail .item');

// config param
let countItem = items.length;
let itemActive = 0;

// event next click
next.onclick = function () {
    itemActive = (itemActive + 1) % countItem;
    showSlider();
}

// event prev click
prev.onclick = function () {
    itemActive = (itemActive - 1 + countItem) % countItem;
    showSlider();
}

// auto run slider
let refreshInterval = setInterval(() => {
    next.click();
}, 50000);

document.addEventListener('DOMContentLoaded', function() {
    // Inicia con la clase `start`
    let thumbnailContainer = document.querySelector('.thumbnail');
    thumbnailContainer.classList.add('start');
});

function showSlider() {
    // remove item active old
    let itemActiveOld = document.querySelector('.slider .list .item.active');
    let thumbnailActiveOld = document.querySelector('.thumbnail .item.active');
    itemActiveOld.classList.remove('active');
    thumbnailActiveOld.classList.remove('active');

    // active new item
    items[itemActive].classList.add('active');
    thumbnails[itemActive].classList.add('active');

    // adjust thumbnail position
    thumbnails[itemActive].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

    // clear auto time run slider
    clearInterval(refreshInterval);
    refreshInterval = setInterval(() => {
        next.click();
    }, 15000);

    // Update the mask based on the position
    let thumbnailContainer = document.querySelector('.thumbnail');
    thumbnailContainer.classList.remove('start', 'middle', 'end');

    if (itemActive === 0) {
        thumbnailContainer.classList.add('start');
    } else if (itemActive === countItem - 1) {
        thumbnailContainer.classList.add('end');
    } else {
        thumbnailContainer.classList.add('middle');
    }
}

// click thumbnail
thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
        itemActive = index;
        showSlider();
    })
});
