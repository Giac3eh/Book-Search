const searchForm = document.getElementById("search-form");
const searchResult = document.getElementById("search-result");
const resultsList = document.getElementById("results-list");
const resultPlaceholder = document.getElementById("result-placeholder");
const categoryResults = document.getElementById("category-results");

async function fetchData(){
    try{
        const bookCategory = document.getElementById("search-box").value.toLowerCase();
        if(bookCategory === ""){
            categoryResults.innerHTML = `Search a category first`;
            categoryResults.style.display = "block";
        }else{
            categoryResults.innerHTML = `Results for "<span>${bookCategory}</span>":`;
            categoryResults.style.display = "block";
            const responseSubject = await fetch(`https://openlibrary.org/subjects/${bookCategory}.json`);

            if(!responseSubject.ok){
            throw new Error("Could not fetch resource");
            }
            const data = await responseSubject.json();

            for(let i = 0; i < data.works.length; i++) {
            const bookLi = document.createElement("li");
            const bookBtn = document.createElement("button");
            const bookSpan = document.createElement("span");
            const bookDesc = document.createElement("div");

            bookBtn.innerHTML = `${data.works[i].title}`;
            bookSpan.innerHTML = ` - ${data.works[i].authors[0].name}`;

            bookLi.appendChild(bookBtn);
            bookLi.appendChild(bookSpan);
            bookLi.appendChild(bookDesc);
            resultsList.appendChild(bookLi);

            bookBtn.classList.toggle("titleBtn");
            bookDesc.classList.toggle("description");

            async function showDescription(){
                try{
                    if(bookDesc.style.display  === "block"){
                        bookDesc.style.display = "none";
                    }else{
                       bookDesc.style.display = "block";
                    }
    
                    const key = data.works[i].key;
                    const responseKey = await fetch(`https://openlibrary.org${key}.json`);
    
                    if(!responseKey.ok){
                        throw new Error("Could not fetch resource");
                    }
                    const dataKey = await responseKey.json();

                    if(dataKey.description === "" || dataKey.description == undefined){
                        bookDesc.innerHTML = '"No Description Available"';
                    }else{
                        bookDesc.innerHTML = `"Description: ${dataKey.description.value}"`;
                    }
                    
    
                    console.log(`niente = ${dataKey}`);
                    console.log(`description = ${dataKey.description}`);
                    console.log(`value = ${dataKey.value}`);
                    console.log(`description e value = ${dataKey.description.value}`);
                }
                catch(error){
                        console.error(error);
                }}
            bookBtn.addEventListener("click", ()=>{
                showDescription();
            })
            }
        }
    }
    catch(error){
        console.error(error);
    }
}

searchForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    fetchData();
    resultPlaceholder.style.display = "none";
    searchForm.reset();  
})

