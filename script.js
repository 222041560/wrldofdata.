const WHATSAPP_NUMBER = "27791770119";

// DATA PACKAGES AND PRICES

const packages = {
  eSIM: [
    { name: "100GB", price: 350 },
    { name: "60GB", price: 200 },
    { name: "40GB", price: 150 },
    { name: "20GB", price: 100 },
    { name: "10GB", price: 50 }
  ],

  MTN: [
    { name: "20GB", price: 160 },
    { name: "10GB", price: 85 },
    { name: "5GB", price: 55 },
    { name: "3GB", price: 40 },
    { name: "1GB", price: 15 }
  ],

  Vodacom: [
    { name: "15GB", price: 150 },
    { name: "20GB", price: 200 },
    { name: "30GB", price: 220 },
    { name: "60GB", price: 300 },
    { name: "150GB", price: 450 }
  ]
};


// GET WEBSITE ELEMENTS

const service = document.getElementById("service");
const packageSelect = document.getElementById("package");

const numberField = document.getElementById("numberField");
const phoneField = document.getElementById("phoneField");

const recipient = document.getElementById("recipient");
const phoneModel = document.getElementById("phoneModel");

const payment = document.getElementById("payment");
const paymentInfo = document.getElementById("paymentInfo");
const proofField = document.getElementById("proofField");
const proof = document.getElementById("proof");


// UPDATE PACKAGES WHEN CUSTOMER SELECTS A SERVICE

function updatePackages() {

  const selectedService = service.value;

  packageSelect.innerHTML =
    '<option value="">Select package</option>';

  if (!packages[selectedService]) {
    updateFields();
    return;
  }

  packages[selectedService].forEach(item => {

    const option = document.createElement("option");

    option.value = item.name;
    option.textContent =
      `${item.name} - R${item.price}`;

    option.dataset.price = item.price;

    packageSelect.appendChild(option);

  });

  updateFields();
}


// SHOW THE CORRECT CUSTOMER DETAILS

function updateFields() {

  const selectedService = service.value;

  const isEsim = selectedService === "eSIM";

  const needsNumber =
    selectedService === "MTN" ||
    selectedService === "Vodacom";

  numberField.classList.toggle("hidden", !needsNumber);

  phoneField.classList.toggle("hidden", !isEsim);

  recipient.required = needsNumber;

  phoneModel.required = isEsim;

  if (!needsNumber) recipient.value = "";

  if (!isEsim) phoneModel.value = "";
}


// SELECT PACKAGE FROM A PACKAGE CARD

function choosePackage(selectedService, selectedPackage) {

  service.value = selectedService;

  updatePackages();

  packageSelect.value = selectedPackage;

  document.getElementById("order").scrollIntoView({
    behavior: "smooth"
  });

}


// PAYMENT OPTIONS

function updatePayment() {

  const selectedPayment = payment.value;

  proofField.classList.add("hidden");

  paymentInfo.classList.add("hidden");

  proof.required = false;

  if (selectedPayment === "Capitec payment") {

    proofField.classList.remove("hidden");

    paymentInfo.classList.remove("hidden");

    proof.required = true;

    paymentInfo.innerHTML =
      "<strong>Capitec Payment Details</strong><br>" +
      "Account name: <strong>Mr Tsanwani</strong><br>" +
      "Account number: <strong>2072260260</strong><br>" +
      "Capitec phone number: <strong>0791770119</strong><br><br>" +
      "Please make your payment and upload your proof of payment below. " +
      "You must also attach the proof in WhatsApp before sending your order.";

  }

  else if (selectedPayment === "Pay in person") {

    paymentInfo.classList.remove("hidden");

    paymentInfo.textContent =
      "You have selected Pay in Person. Please contact the seller on WhatsApp to arrange payment.";

  }

}


// CONNECT SERVICE SELECTOR

service.addEventListener("change", updatePackages);


// CONNECT PAYMENT SELECTOR

payment.addEventListener("change", updatePayment);


// SEND CUSTOMER ORDER TO WHATSAPP

document.getElementById("orderForm").addEventListener(
  "submit",
  function(event) {

    event.preventDefault();

    const customer =
      document.getElementById("customer").value.trim();

    const selectedService = service.value;

    const selectedPackage = packageSelect.value;

    const selectedOption =
      packageSelect.options[packageSelect.selectedIndex];

    const price = selectedOption.dataset.price;

    const recipientNumber = recipient.value.trim();

    const selectedPhone = phoneModel.value.trim();

    const selectedPayment = payment.value;

    const selectedProof = proof.files[0];


    // CHECK REQUIRED DETAILS

    if (!customer || !selectedService ||
        !selectedPackage || !selectedPayment) {

      alert("Please complete all required details.");

      return;
    }

    if (
      (selectedService === "MTN" ||
       selectedService === "Vodacom") &&
      !recipientNumber
    ) {

      alert("Please enter the number receiving the data.");

      recipient.focus();

      return;
    }

    if (selectedService === "eSIM" && !selectedPhone) {

      alert("Please enter your phone model.");

      phoneModel.focus();

      return;
    }

    if (selectedPayment === "Capitec payment" && !selectedProof) {

      alert("Please select your proof of payment.");

      proof.focus();

      return;
    }


    // BUILD WHATSAPP ORDER MESSAGE

    let message =
      "HELLO WRLD OF DATA! I WOULD LIKE TO PLACE AN ORDER.\n\n" +

      "CUSTOMER DETAILS\n" +
      "Name: " + customer + "\n\n" +

      "ORDER DETAILS\n" +
      "Service: " + selectedService + "\n" +
      "Package: " + selectedPackage + "\n" +
      "Price: R" + price + "\n";


    if (selectedService === "eSIM") {

      message +=
        "Phone model: " + selectedPhone + "\n" +
        "Request: Please register a new eSIM number with data.\n";

    } else {

      message +=
        "Network: " + selectedService + "\n" +
        "Number receiving data: " + recipientNumber + "\n";

    }


    message +=
      "\nPAYMENT DETAILS\n" +
      "Payment method: " + selectedPayment + "\n";


    if (selectedPayment === "Capitec payment") {

      message +=
        "Account name: Mr Tsanwani\n" +
        "Account number: 2072260260\n" +
        "Capitec phone number: 0791770119\n" +
        "Proof of payment file selected: " +
        selectedProof.name + "\n" +
        "I will attach my proof of payment in WhatsApp.\n";

    }


    message +=
      "\nThank you!";


    // OPEN WHATSAPP

    const whatsappURL =
      "https://wa.me/" +
      WHATSAPP_NUMBER +
      "?text=" +
      encodeURIComponent(message);


    window.open(whatsappURL, "_blank");


    if (selectedPayment === "Capitec payment") {

      alert(
        "Your WhatsApp order is ready. Please attach your proof of payment before sending the message."
      );

    }

  }
);
