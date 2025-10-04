// -- Data for area codes and prefixes is loaded from area_codes.js --

const firstNames = ["John", "Michael", "David", "Ashley", "Jessica", "Emily", "Sarah", "Olivia", "Emma", "Sophia", "Ava", "Mia", "Abigail", "Charlotte", "Madison", "Ella", "Grace", "Chloe", "Lily", "James", "William", "Benjamin", "Lucas", "Henry", "Alexander", "Ethan", "Jacob", "Mason", "Elijah", "Logan", "Wyatt", "Jack", "Owen", "Gabriel", "Julian", "Leo", "Nathan", "Isaac", "Sebastian", "Aaron", "Hunter", "Dominic", "Connor"];
const lastNames = ["Smith", "Johnson", "Brown", "Lee", "Davis", "Martinez", "Taylor", "Thomas", "White", "Harris", "Lewis", "Young", "Hall", "Allen", "Wright", "Hill", "Green", "Adams", "Baker", "Clark", "Nelson", "Carter", "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Evans", "Edwards", "Rivera", "Brooks", "Wood", "Morgan", "Bailey", "Reed", "Kelly", "Cooper", "Richardson", "Cox", "Howard", "Ward", "Torres", "Peterson", "Gray", "Ramirez", "James", "Watson", "Bryant"];

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomName() {
  return `${pickRandom(firstNames)} ${pickRandom(lastNames)}`;
}

function generateNumbers(areaCode, prefix, quantity) {
  const numbers = new Set();
  while (numbers.size < quantity) {
    let line = String(Math.floor(Math.random() * 9999 + 1)).padStart(4, "0");
    numbers.add(`+1${areaCode}${prefix}${line}`);
  }
  return Array.from(numbers);
}

function buildCSV(numbers) {
  let csv = "Name,Phone\n";
  numbers.forEach(num => {
    csv += `${randomName()},${num}\n`;
  });
  return csv;
}

function buildVCard(numbers) {
  let vcard = "";
  numbers.forEach((num, idx) => {
    vcard += `BEGIN:VCARD
VERSION:3.0
FN:${randomName()}
TEL;TYPE=CELL:${num}
END:VCARD
`;
  });
  return vcard;
}

function downloadFile(contents, filename, mime) {
  const blob = new Blob([contents], {type: mime});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

window.onload = function() {
  const areaCodeSelect = document.getElementById("areaCode");
  Object.keys(AREA_CODES).forEach(code => {
    const option = document.createElement("option");
    option.value = code;
    option.text = `${code} (${AREA_CODES[code].city})`;
    areaCodeSelect.appendChild(option);
  });

  areaCodeSelect.onchange = function() {
    const prefixSelect = document.getElementById("prefix");
    prefixSelect.innerHTML = "";
    const code = areaCodeSelect.value;
    AREA_CODES[code].prefixes.forEach(pre => {
      const option = document.createElement("option");
      option.value = pre;
      option.text = pre;
      prefixSelect.appendChild(option);
    });
  };

  areaCodeSelect.onchange(); // Load default prefixes

  document.getElementById("generateBtn").onclick = function() {
    const areaCode = areaCodeSelect.value;
    const prefix = document.getElementById("prefix").value;
    const quantity = parseInt(document.getElementById("quantity").value, 10);
    if (!areaCode || !prefix || isNaN(quantity) || quantity < 1 || quantity > 10000) {
      alert("Please select an area code, prefix, and a quantity between 1 and 10,000.");
      return;
    }
    const numbers = generateNumbers(areaCode, prefix, quantity);
    window.generatedNumbers = numbers;
    document.getElementById("output").textContent = numbers.join("\n");
    document.getElementById("csvBtn").style.display = "inline-block";
    document.getElementById("vcfBtn").style.display = "inline-block";
  };

  document.getElementById("csvBtn").onclick = function() {
    if (!window.generatedNumbers) return;
    downloadFile(buildCSV(window.generatedNumbers), "contacts.csv", "text/csv");
  };
  document.getElementById("vcfBtn").onclick = function() {
    if (!window.generatedNumbers) return;
    downloadFile(buildVCard(window.generatedNumbers), "contacts.vcf", "text/vcard");
  };
};
