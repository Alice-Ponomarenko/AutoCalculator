function changeTab(tabId) {
  $("#vehicleTabs .nav-link").removeClass("active");
  $("#" + tabId + "Tab").addClass("active");
  $(".tab-content .tab-pane").removeClass("show active");
  $("#" + tabId).addClass("show active");
}

function toggleTableVisibility(tableContainer) {

  var resultTableContainer = document.getElementById(tableContainer);

  if (resultTableContainer.style.display == "none")
  {
    resultTableContainer.style.display = "block";
  }

}

function getAgeCoefficient() {

    var carYear = parseFloat(document.getElementById("manufacturingYear").value);
    var currentYear = new Date().getFullYear();
    var carAge = currentYear - carYear;

    if (carAge >= 0 && carAge <= 5) {
        switch (carAge) {
        case 0:
            return 2.2;
        case 1:
            return 1.9;
        case 2:
            return 1.65;
        case 3:
            return 1.55;
        case 4:
            return 1.45;
        case 5:
            return 1.35;
        }
    } else if (carAge >= 6 && carAge <= 15) {
        return 1;
    } else {
        return 0.7;
    }

}

function getFuelTypeCoefficient() {

    var engineFee = 0;
    var engineTypeElements = document.getElementsByName("engineType");

    for (var i = 0; i < engineTypeElements.length; i++) {
      if (engineTypeElements[i].checked) {
        engineFee = engineTypeElements[i].value;
      }
    }

    if(engineFee == 1) {
        return 1
    }

    else if (engineFee == 2) {
        return 1.2
    }

    else {
        return engineFee;
    }

}

function getExclusivityCoefficient(carCost) {
    const minimalWage = 6700;
    const exclusivityCoefficient = carCost / (375 * minimalWage);
    return exclusivityCoefficient;
}

function displayResults(
  carCost,
  engineVolume,
  customsDuty,
  vat,
  excise,
  total
) {

    var pdv = Math.round(carCost + customsDuty + vat);

    document.getElementById("costum-duty-cost").textContent = Math.round(carCost) + " грн.";
    document.getElementById("custom-duty-sum").textContent = customsDuty + " грн.";

    document.getElementById("engine-volume-cost").textContent = engineVolume + " куб.см.";
    document.getElementById("engine-volume-sum").textContent = vat + " грн.";

    document.getElementById("excise-cost").textContent = pdv + " грн.";
    document.getElementById("excise-sum").textContent = excise + " грн.";

    document.getElementById("total-sum").textContent = total + " грн.";

}

function convertCurrency(price) {
  var currency = document.getElementById("currency").value;
  const exchangeRates = {
    EUR: 41.3753,
    USD: 37.48,
    PLN: 9.52,
  };

  if (exchangeRates.hasOwnProperty(currency)) {
    const priceInUAH = price * exchangeRates[currency];
    return priceInUAH.toFixed(2);
  } else {
    return 0;
  }
}

function getCarCost() {
    var price = parseFloat(document.getElementById("carCost").value);
    return convertCurrency(price);
}

function calculateFeeCar(tableContainer) {

    var ageCoefficient = getAgeCoefficient();
    var engineVolume = parseFloat(document.getElementById("engineVolume").value);
    var fuelTypeCoefficient = getFuelTypeCoefficient();
    var carCost = getCarCost();
    var exclusivityCoefficient = getExclusivityCoefficient(carCost);

    var rate =
        ageCoefficient *
        engineVolume *
        fuelTypeCoefficient *
        exclusivityCoefficient;

    var customsDuty = 0;
    var vat = 0;
    var excise = 0;

    if (rate > 0) {
        customsDuty = Math.round(carCost * 0.1);
        vat = Math.round(
          convertCurrency(50 * (engineVolume / 100) * ageCoefficient)
        );
        excise = Math.round(carCost * 0.2);
    }

    carCost = Math.round(carCost);
    customsDuty = Math.round(customsDuty);
    vat = Math.round(vat);
    excise = Math.round(excise);
    total = Math.round(total);

    var total = carCost + customsDuty + vat + excise;

    displayResults(carCost, engineVolume, customsDuty, vat, excise, total);
    toggleTableVisibility(tableContainer);

}