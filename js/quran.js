document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn").addEventListener("click", fetchRandomAyah);
});

async function fetchRandomAyah() {
  try {
    let randomAyahNumber = Math.floor(Math.random() * 6236) + 1;
    let response = await fetch(
      `https://api.alquran.cloud/v1/ayah/${randomAyahNumber}/editions/quran-uthmani,en.sahih`
    );
    let data = await response.json();

    if (data.data) {
      let arabicAyah = data.data[0].text;
      document.getElementById("ayah").innerText = `" ${arabicAyah} "`;
    } else {
      console.error("Error getting data");
    }
  } catch (error) {
    console.error("Error getting ayah", error);
  }
}

fetchRandomAyah();
