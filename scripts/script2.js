// video.html

// Get reference do DOM elements
const head = document.getElementById("head"); // Reference to header
const outputDIV = document.getElementById("output"); // Reference to the output container
const v1 = document.getElementById("movie-link"); // Reference to the movie link section


// Function to retrieve the series id from the URL
function getQueryParam(name) {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(name);
};

// Gets series id
const seriesID = getQueryParam("seriesID");

// Modifies the header to match the series name
head.innerHTML = `<h1>${seriesID}</h1>`;

// Calls the add_buttons function
add_buttons();

let z = '';
// add_buttons function
async function add_buttons() {
	const infoUrl = `https://dramalama-api.vercel.app/movies/dramacool/info?id=${seriesID}`;
	const { data: infoData } = await axios.get(infoUrl);

	if (infoData.episodes && infoData.episodes.length > 0) { // getting number of episodes and their respective links
		z += "</ul>";

		infoData.episodes.forEach((episode) => {
			const episodeTitle = episode.title;
			const episodeID = episode.id;

			z +=
				`<button class="watch-button" data-episode-id="${episodeID}">${episodeTitle}</button>`;
		});
		z += "</ul>";
	}

	outputDIV.innerHTML = z;
}

// Function to detect clicks + update video player with the required link
let epiID;
document.addEventListener("click", async function (event) {
	if (event.target.classList.contains("watch-button")) {
		const button = event.target;
		epiID = button.getAttribute("data-episode-id");
	
		const watchUrl = `https://dramalama-api.vercel.app/movies/dramacool/watch?episodeId=${epiID}&mediaId=${seriesID}`;
		try {

			const { data: Links } = await axios.get(watchUrl);
			const videoURL = Links.sources[0].url;
			v1.innerHTML = videoURL;
			v1.style.color = "white";
			v1.style.textAlign = "center";
			v1.style.marginTop = "10px";

		// making the video player work
			if (Hls.isSupported()) {
				var video = document.getElementById('video');
				var hls = new Hls();
				hls.loadSource(videoURL);
				hls.attachMedia(video);
			}

		} catch (error) {
			console.log(error)
		};
}
})