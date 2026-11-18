import * as ort from "onnxruntime-web";

const DISTRICT_CORRECTION = {
    0: 1.0551,
    1: 1.0037,
    2: 0.8804,
    3: 1.1537,
    4: 1.1361,
    5: 0.9912,
    6: 1.0617,
    7: 0.9866,
    8: 1.0280,
    9: 0.8872,
    10: 0.7850,
    11: 0.9660,
    12: 0.8564,
    13: 1.1506,
    14: 0.9365,
    15: 1.0542,
    16: 1.0000,
    17: 0.8925,
    18: 0.7842,
    19: 1.0196,
    20: 0.9972,
    21: 0.9470,
    22: 1.0817,
    23: 0.9623,
    24: 0.9758,
    25: 1.0664,
    26: 1.0343,
    27: 1.0000,
    28: 1.1693,
    29: 0.9845,
    30: 1.0000,
    31: 0.9718,
    32: 0.8962,
    33: 1.0125,
    34: 0.9665,
    35: 1.0000,
    36: 1.3564,
    37: 0.8183,
    38: 0.8631,
    39: 1.0740,
    40: 0.9305,
    41: 1.0029,
    42: 1.0750,
    43: 0.9994,
    44: 0.5044,
    45: 1.0620,
    46: 1.0243,
    47: 0.8057,
    48: 1.0419,
    49: 1.0002,
    50: 1.2033,
    51: 0.7139,
    52: 0.6474,
    53: 1.1413,
    54: 1.0000,
    55: 1.0666,
    56: 1.0436,
    57: 1.0356,
    58: 1.1427,
    59: 0.4194,
    60: 1.0000,
    61: 0.9930,
    62: 0.9931,
    63: 1.0000,
    64: 1.0000,
    65: 0.9820,
    66: 0.9648,
    67: 1.0171,
    68: 0.9316,
    69: 0.7923,
    70: 1.1875,
    71: 0.7548,
    72: 1.0631,
    73: 0.7819,
    74: 1.1211,
    75: 1.0472,
    76: 0.8513,
    77: 1.0382,
    78: 0.9513,
};

const FEATURE_NAMES = [
    "rooms",
    "usable_area_m2",
    "balcony_m2",
    "loggia_m2",
    "terrace_m2",
    "cellar_m2",
    "garden_m2",
    "total_floors",
    "year_built",
    "district",
    "material",
];

let session = null;

const currencyFormatter = new Intl.NumberFormat("sk-SK", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
});

function getFeatureValue(name) {
    const input = document.getElementById(name);

    if (!input) {
        throw new Error(`Missing HTML input with id="${name}"`);
    }

    const value = Number(input.value);

    if (!Number.isFinite(value)) {
        throw new Error(`Invalid numeric value for "${name}"`);
    }

    return value;
}

function getFeatures() {
    return FEATURE_NAMES.map(getFeatureValue);
}

async function loadModel() {
    const status = document.getElementById("status");

    try {
        if (status) {
            status.textContent = "Loading ONNX model...";
        }

        session = await ort.InferenceSession.create(
            "./src/model.onnx",
            {
                executionProviders: ["wasm"],
            }
        );

        console.log("ONNX model loaded.");
        console.log("Model inputs:", session.inputNames);
        console.log("Model outputs:", session.outputNames);

        if (status) {
            status.textContent = "Model loaded.";
        }

        await predictPrice();
    } catch (error) {
        console.error("Failed to load ONNX model:", error);

        if (status) {
            status.textContent = `Error loading model: ${error.message}`;
        }
    }
}

async function predictPrice() {
    if (!session) {
        return;
    }

    const output = document.getElementById("prediction");
    const status = document.getElementById("status");

    try {
        const features = getFeatures();

        const inputName = session.inputNames[0];
        const outputName = session.outputNames[0];

        const tensor = new ort.Tensor(
            "float32",
            Float32Array.from(features),
            [1, features.length]
        );

        const results = await session.run({
            [inputName]: tensor,
        });

        const predictionTensor = results[outputName];
        const prediction = predictionTensor.data[0];
        // Get the selected district ID.
        const district = Number(document.getElementById("district").value);
        // Look up its correction multiplier.
        // Default to 1.0 if a district is missing from the map.
        const correction = DISTRICT_CORRECTION[district] ?? 1.0;
        // Apply the district correction.
        const correctedPrediction = prediction * correction;

        console.log("Input features:", features);
        console.log("Prediction:", prediction, correctedPrediction);

        if (!Number.isFinite(prediction)) {
            throw new Error("The model returned an invalid prediction.");
        }

        if (output) {
            output.textContent = currencyFormatter.format(correctedPrediction);
        }

        if (status) {
            status.textContent = "Prediction updated.";
        }
    } catch (error) {
        console.error("Prediction failed:", error);

        if (status) {
            status.textContent = `Prediction error: ${error.message}`;
        }
    }
}

function setupInputs() {
    for (const name of FEATURE_NAMES) {
        const input = document.getElementById(name);

        if (input) {
            input.addEventListener("input", predictPrice);
            input.addEventListener("change", predictPrice);
        }
    }
}

setupInputs();
loadModel();
