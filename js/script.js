document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        searchBooks();
    });
});

async function searchBooks() {
    const searchInput = document.getElementById('searchInput').value.trim();
    const resultsContainer = document.getElementById('results');
    const loader = document.getElementById('loader');
    const categoryResults = document.getElementById("category-results");

    if (!isValidInput(searchInput)) {
        displayErrorMessage(resultsContainer, 'Please enter a valid search term.');
        return;
    }

    resultsContainer.innerHTML = '';

    categoryResults.innerHTML = `Results for "<span>${searchInput}</span>":`;
    categoryResults.style.display = "none";
    
    try {
        loader.style.display = 'block'; 
        const works = await fetchBooks(searchInput);

        if (works && works.length > 0) {
            displayBooks(resultsContainer, works);
        } else {
            displayErrorMessage(resultsContainer, 'No books found for this subject.');
        }
    } catch (error) {
        console.error('Error:', error);
        displayErrorMessage(resultsContainer, 'Error fetching data. Please try again.');
    } finally {
        loader.style.display = 'none';
    }
}

function isValidInput(input) {
    if (input !== '' && /^[a-zA-Z0-9\s]*$/.test(input)) {
        return true;
    } else {
        return false;
    }
}

function displayErrorMessage(container, message) {
    container.textContent = message;
}

async function fetchBooks(searchInput) {
    const response = await fetch(`https://openlibrary.org/subjects/${searchInput}.json`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.works;
}

function displayBooks(container, works) {
    works.forEach(work => {
        const title = work.title;
        const authors = work.authors ? work.authors.map(author => author.name).join(', ') : 'Unknown';

        const description = work.description ? `Description: ${work.description.value || work.description}` : 'No Description Available';

        const listItem = document.createElement('ul');
        listItem.innerHTML = `<li><strong>Title:</strong> <button class="title">${title}</button><br>
                         <strong>Author(s):</strong> <span>${authors}</span>
                            <div class="description" style="display:none;">${description}<br></div></li>`;
        listItem.classList.toggle("results-list");
        container.appendChild(listItem);

        const titleButton = listItem.querySelector('.title');
        titleButton.addEventListener('click', async function() {
            const descriptionDiv = listItem.querySelector('.description');
            if (descriptionDiv.style.display === 'none') {
                descriptionDiv.style.display = 'block';
                try {
                    await showDescription(work, descriptionDiv);
                } catch (error) {
                    console.error(error);
                    descriptionDiv.innerHTML = 'Error fetching description.';
                }
            } else {
                descriptionDiv.style.display = 'none';
            }
        });
    });
}

async function showDescription(work, descriptionDiv) {
    try {
        const key = work.key;
        const responseKey = await fetch(`https://openlibrary.org${key}.json`);

        if (!responseKey.ok) {
            throw new Error("Could not fetch resource");
        }
        const dataKey = await responseKey.json();

        const detailedDescription = dataKey.description ? dataKey.description.value || dataKey.description : 'No Description Available';
        descriptionDiv.innerHTML = `Description: ${detailedDescription}`;
        
    } catch (error) {
        throw new Error('Error fetching detailed description.');
    }
}

