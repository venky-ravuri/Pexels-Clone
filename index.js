const searchBtn = document.querySelector('button[type="submit"]');
const imageContainer = document.querySelector('.image-container');

// creates the query for API request
let query;

searchBtn.addEventListener("click", function() {
    if (document.querySelector("input[type='text']").value) {
        query = `search?query=${encodeURIComponent(document.querySelector("input[type='text']").value.trim())}&per_page=20`;
        sessionStorage.clear();
        sessionStorage.setItem('query', query);
    }
});

// query = sessionStorage.getItem('query') ? sessionStorage.getItem('query') : 'curated?per_page=20';
if (sessionStorage.getItem("query")) {
    query = sessionStorage.getItem("query");
    document.querySelector('input[type="text"]').value = query.match(/=(\w+)/)[1];
} else {
    query = 'curated?per_page=20';
}

// first AJAX request content(for main content)
const xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

        // second AJAX request content
        const xhttp2 = new XMLHttpRequest();
        xhttp2.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            const innerResponse = JSON.parse(this.responseText);
            const bgImage = innerResponse.photos[0].src.landscape;

            document.querySelector('#hero-section').style.cssText = `
                background-image: url(${bgImage});
                background-position: center;
                background-repeat: no-repeat;
                background-size: cover;
            `;
            }
        };

        // sending second AJAX request(for bg img)
        xhttp2.open("GET", `https://api.pexels.com/v1/search?query=nature&per_page=1`, true);
        xhttp2.setRequestHeader('Authorization', '563492ad6f91700001000001b46f9ab50aaf48e0863eb7502b4b9948');
        xhttp2.send();

        const response = JSON.parse(this.responseText);
        const photos = response.photos;

        const photosColumn1 = document.createElement('div');
        photosColumn1.classList.add("photos-column-1");
        imageContainer.appendChild(photosColumn1);
        const photosColumn2 = document.createElement('div');
        photosColumn2.classList.add("photos-column-2");
        imageContainer.appendChild(photosColumn2);

        for (let i=0; i<photos.length; i++) {
            if (i<photos.length/2) {
                photosColumn1.insertAdjacentHTML("beforeend", `
                <a class=image href=${photos[i].url}>
                    <img src=${photos[i].src.large} class="content-img">
                </a>
                `);
            } else {
                photosColumn2.insertAdjacentHTML("beforeend", `
                <a class=image href=${photos[i].url}>
                    <img src=${photos[i].src.large} class="content-img">
                </a>
                `);
            }
        }
    }
};

// sending the first AJAX request
xhttp.open("GET", `https://api.pexels.com/v1/${query}`, true);
xhttp.setRequestHeader("Authorization", "563492ad6f91700001000001b46f9ab50aaf48e0863eb7502b4b9948")
xhttp.send();