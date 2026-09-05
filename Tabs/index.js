const tabItems = document.querySelectorAll('.tab-item');
const tabContents = document.querySelectorAll('.tab-content');

const defaultActiveIndex = 0; // Set the default active tab index

// Set the default active tab and content
tabItems[defaultActiveIndex].classList.add('active');
tabContents[defaultActiveIndex].classList.add('active');

tabItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        // Remove active class from all tab items and contents
        tabItems.forEach(tab => tab.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        // Add active class to the clicked tab item and corresponding content
        item.classList.add('active');
        tabContents[index].classList.add('active');
    });
});


