// YouTube API Configuration
const YOUTUBE_API_KEY = "AIzaSyD8heZVSO1xWWmrLNbGHQfRyfqA32bSGQM";
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";

// Fetch YouTube Videos
async function fetchYouTubeVideos(query = "AI", maxResults = 8) {
    try {
        const response = await fetch(`${YOUTUBE_API_URL}?key=${YOUTUBE_API_KEY}&q=${query}&part=snippet&type=video&maxResults=${maxResults}&order=viewCount`);
        const data = await response.json();
        return data.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url,
            channel: item.snippet.channelTitle,
            publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString()
        }));
    } catch (error) {
        console.error("YouTube API Error:", error);
        return [];
    }
}

// Display Videos in Grid
async function displayVideos() {
    const trendingVideos = await fetchYouTubeVideos("AI technology");
    const newsVideos = await fetchYouTubeVideos("AI news");

    const trendingContainer = document.getElementById('trendingVideos');
    const newsContainer = document.getElementById('newsVideos');

    trendingVideos.forEach(video => {
        trendingContainer.appendChild(createVideoCard(video));
    });

    newsVideos.forEach(video => {
        newsContainer.appendChild(createVideoCard(video));
    });
}

// Create Video Card Element
function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'video-card bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300';
    card.innerHTML = `
        <div class="relative">
            <img src="${video.thumbnail}" alt="${video.title}" class="w-full h-48 object-cover">
            <div class="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 text-sm rounded">
                <i class="fas fa-play mr-1"></i> Watch
            </div>
        </div>
        <div class="p-4">
            <h3 class="font-bold mb-1 line-clamp-2">${video.title}</h3>
            <p class="text-gray-400 text-sm">${video.channel}</p>
            <p class="text-gray-500 text-xs mt-2">${video.publishedAt}</p>
        </div>
    `;
    
    card.addEventListener('click', () => {
        openVideoModal(video.id);
    });

    return card;
}

// Open Video in Modal
function openVideoModal(videoId) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="w-full max-w-4xl">
            <div class="relative" style="padding-bottom: 56.25%">
                <iframe 
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                    class="absolute top-0 left-0 w-full h-full"
                ></iframe>
            </div>
            <button class="absolute top-4 right-4 text-white text-2xl" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', displayVideos);