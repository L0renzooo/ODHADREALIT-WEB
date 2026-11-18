import * as ort from "onnxruntime-web";

const DISTRICT_CORRECTION = {
    0: 0.9641,
    1: 0.9713,
    2: 1.1569,
    3: 0.9530,
    4: 0.8991,
    5: 0.8612,
    6: 1.0790,
    7: 0.9014,
    8: 1.0264,
    9: 0.6574,
    10: 1.3817,
    11: 0.9585,
    12: 0.6892,
    13: 1.0511,
    14: 1.0142,
    15: 0.9221,
    16: 0.4456,
    17: 0.8159,
    18: 0.7433,
    19: 1.0993,
    20: 1.2968,
    21: 0.8194,
    22: 1.1439,
    23: 0.7948,
    24: 1.0000,
    25: 1.4144,
    26: 0.9970,
    27: 0.8196,
    28: 0.9762,
    29: 0.7312,
    30: 0.8352,
    31: 0.9619,
    32: 0.9590,
    33: 1.0116,
    34: 0.8538,
    35: 1.0000,
    36: 1.1676,
    37: 0.9450,
    38: 0.8120,
    39: 0.9791,
    40: 0.8336,
    41: 1.0854,
    42: 1.0909,
    43: 0.9671,
    44: 0.9091,
    45: 0.9783,
    46: 0.9736,
    47: 1.1327,
    48: 0.9628,
    49: 1.1197,
    50: 0.5562,
    51: 0.8787,
    52: 0.9244,
    53: 1.0456,
    54: 0.8376,
    55: 1.2190,
    56: 0.9190,
    57: 0.9882,
    58: 1.0931,
    59: 0.8100,
    60: 1.0000,
    61: 0.7295,
    62: 0.8210,
    63: 1.0000,
    64: 1.0000,
    65: 0.9672,
    66: 1.1155,
    67: 0.8721,
    68: 0.8556,
    69: 1.1807,
    70: 1.0000,
    71: 0.7077,
    72: 1.4131,
    73: 1.4866,
    74: 0.9970,
    75: 1.1429,
    76: 0.8422,
    77: 0.8753,
    78: 0.9677,
};

const FEATURE_NAMES = [
    "usable_area_m2",
    "property_area_m2",
    "year_built",
    "district",
    "material",
    "parking",
    "garden",
    "new_build"
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
