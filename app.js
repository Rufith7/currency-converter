const BASE_URL = "https://api.exchangerate-api.com/v4/latest";

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = '';
    
    // Find the country code from the currency code
    for (let code in countryList) {
        if (countryList[code] === currCode || code === currCode) {
            countryCode = countryList[code];
            break;
        }
    }
    
    let newSrc = `https://flagcdn.com/48x36/${countryCode.toLowerCase()}.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

const dropdownns = document.querySelectorAll(".dropdown select");


for (let select of dropdownns) {
     for (code in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = code;
        newOption.value = code;
        if (select.name === "from"  && code === "USD") {
            newOption.selected = "selected";
       } else if (select.name === "to" && code === "EUR") {
            newOption.selected = "selected";
       }
      select.append(newOption);
   }

   select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
   });
}

// Update flags on page load
updateFlag(dropdownns[0]);
updateFlag(dropdownns[1]);

// Get exchange rate button handler
const btn = document.querySelector("button");
const fromCurr = document.querySelector("select[name='from']");
const toCurr = document.querySelector("select[name='to']");
const msg = document.querySelector(".msg");

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    getExchangeRate();
});

const getExchangeRate = async () => {
    const amount = document.querySelector(".amount input").value;
    const fromCode = fromCurr.value;
    const toCode = toCurr.value;

    if (amount === "" || amount === "0") {
        msg.innerText = "Please enter a valid amount";
        return;
    }

    msg.innerText = "Fetching exchange rate...";

    try {
        const URL = `${BASE_URL}/${fromCode}`;
        const response = await fetch(URL);
        const data = await response.json();

        if (data && data.rates && data.rates[toCode]) {
            const rate = data.rates[toCode];
            const convertedAmount = (amount * rate).toFixed(2);
            msg.innerText = `${amount} ${fromCode} = ${convertedAmount} ${toCode}`;
        } else {
            msg.innerText = "Error fetching exchange rate";
        }
    } catch (error) {
        msg.innerText = "Error: Unable to fetch exchange rate";
        console.error("Error:", error);
    }
};