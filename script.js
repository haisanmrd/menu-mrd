document.addEventListener('DOMContentLoaded', function () {

    setTimeout(function () {
        const loadingScreen = document.querySelector('.loading-screen');
        const content = document.querySelector('.content');

        loadingScreen.style.opacity = '0';
        setTimeout(function () {
            loadingScreen.style.display = 'none';
            content.style.opacity = '1';
            content.classList.remove('hidden');
        });
    }, 2000);

    gsap.delayedCall(2, function () {
        gsap.from(".gallery", { opacity: 0, y: 100, duration: 1 });
    });

    const gallery = document.querySelector('.gallery');
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const captionText = document.getElementById('caption');
    let touchStartX = 0;
    let allowSwipe = true; // Biến kiểm soát vuốt
    let numberOfElements = 0

    fetch('./images.json')
        .then(response => response.json())
        .then(data => {
            numberOfElements = data.length;
        })
        .catch(error => console.error('Lỗi khi tải tệp JSON:', error));
    // Lấy danh sách các ảnh từ thư mục "images"
    fetch('./images.json')
        .then(response => response.json())
        .then(data => {
            data.forEach((img, index) => {
                const imgElement = document.createElement('img');
                imgElement.src = `images/${img}`;
                imgElement.alt = img;
                imgElement.addEventListener('click', () => openModal(img, index, numberOfElements));
                gallery.appendChild(imgElement);
            });
        });

    let currentIndex = 0;

    function openModal(imgName, index, totalImages) {
        gsap.fromTo(modalImg, { opacity: 0.7 }, { opacity: 1, duration: 0.5, ease: 'power2.inOut' });
        modal.style.display = 'block';
        modalImg.src = `images/${imgName}`;
        captionText.innerHTML = `${index + 1}/${totalImages}`;
        currentIndex = index;
        allowSwipe = true; // Đặt lại biến kiểm soát khi mở modal

        // Thêm hiệu ứng chuyển đổi
    }

    const closeModal = document.getElementById('close');
    closeModal.addEventListener('click', () => modal.style.display = 'none');

    document.addEventListener('keydown', function (event) {
        if (modal.style.display === 'block') {
            if (event.key === 'ArrowLeft') {
                showPrevious();
            } else if (event.key === 'ArrowRight') {
                showNext();
            }
        }
    });

    function showPrevious() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = gallery.children.length - 1;
        }
        const img = gallery.children[currentIndex];
        openModal(img.alt, currentIndex, numberOfElements);
    }

    function showNext() {
        if (currentIndex < gallery.children.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        const img = gallery.children[currentIndex];
        openModal(img.alt, currentIndex, numberOfElements);
    }

    modal.addEventListener('touchstart', function (event) {
        touchStartX = event.touches[0].clientX;
        allowSwipe = true; // Bắt đầu cuộc vuốt
    });

    modal.addEventListener('touchmove', function (event) {
        event.preventDefault();
        if (!allowSwipe) return; // Nếu không được phép vuốt, thoát
        let touchEndX = event.touches[0].clientX;
        if (touchStartX - touchEndX > 50) {
            showNext();
            allowSwipe = false; // Chỉ cho phép vuốt một lần
        } else if (touchEndX - touchStartX > 50) {
            showPrevious();
            allowSwipe = false; // Chỉ cho phép vuốt một lần
        }
    });
});
