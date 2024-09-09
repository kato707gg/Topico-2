// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    const imageContainers = document.querySelectorAll('.image-container');
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const modalText = document.getElementById('modal-text');

    imageContainers.forEach(container => {
        container.addEventListener('click', () => {
            const img = container.querySelector('img');
            const title = container.getAttribute('data-title');
            const description = container.getAttribute('data-description');

            modalImg.src = img.src;
            modalText.textContent = description;

            modal.classList.add('show');
        });
    });

    modal.addEventListener('click', () => {
        modal.classList.remove('show');
    });
});
