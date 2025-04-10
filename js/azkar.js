// loader
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".loader").style.transition = "opacity 1s";
  document.querySelector(".loader").style.opacity = "0";

  setTimeout(() => {
    document.querySelector(".loader").style.display = "none";
  }, 1000);
});

let azkarSabah = document.getElementById("sabah");
let azkarMasa = document.getElementById("masa");
let azkarPrayer = document.getElementById("prayer");
let zekrContainer = document.getElementById("zekrContainer");

// Azkar fetching
async function fetchAzkar(jsonFile) {
  zekrContainer.classList.remove("d-none");
  zekrContainer.classList.add("d-block");

  try {
    let response = await fetch(`../API/${jsonFile}`);
    let data = await response.json();
    let azkarData = data.content;
    let currentIndex = 0;

    if (!azkarData || azkarData.length === 0) return;

    function updateZekr() {
      zekrContainer.innerHTML = `
      <div class="row inner">
        <div class="header col-12">
          <h3>${data.title}</h3>
          <img id="closeBtn" class="closeBtn" src="img/circle-x.svg" />
        </div>
        <div class="content row col-12">
          <div class="nav col-2">
            <img id="previousZekr" src="img/circle-arrow-left.svg" />
          </div>
          <p class="col-8">${azkarData[currentIndex].zekr}</p>
          <div class="nav col-2">
            <img id="nextZekr" src="img/circle-arrow-right.svg" />
          </div>
          <p class="col-10">${azkarData[currentIndex].repeat} مرات</p>
          <p class="col-10">${azkarData[currentIndex].bless || ""}</p>
        </div>
      </div>
      `;

      //  navigations
      document
        .getElementById("previousZekr")
        .addEventListener("click", function () {
          currentIndex =
            (currentIndex - 1 + azkarData.length) % azkarData.length;
          updateZekr();
        });

      document
        .getElementById("nextZekr")
        .addEventListener("click", function () {
          currentIndex = (currentIndex + 1) % azkarData.length;
          updateZekr();
        });
      // close button
      document
        .getElementById("closeBtn")
        .addEventListener("click", function () {
          zekrContainer.classList.add("d-none");
        });
    }

    updateZekr();
  } catch (error) {
    console.error("Error fetching Azkar:", error);
  }
}

// azkar type detection
azkarSabah.addEventListener("click", () => fetchAzkar("azkar-sabah.json"));
azkarMasa.addEventListener("click", () => fetchAzkar("azkar-masa.json"));
azkarPrayer.addEventListener("click", () => fetchAzkar("azkar-prayers.json"));
