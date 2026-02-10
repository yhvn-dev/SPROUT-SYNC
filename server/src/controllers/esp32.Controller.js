import { clients } from "../app.js";

// Utility to send a command to all connected ESP32 clients
const sendToESP32 = (command) => {
  clients.forEach(client => {
    if (client.connected) {
      client.sendUTF(command);
    }
  });
};

// ===== FORCE CLOSE / AUTO BOKCHOY VALVE =====
export const closeBokchoyGroup = async (req, res) => {
  try {
    const action = req.body.action?.toUpperCase(); // "FORCE_OFF" or "AUTO"

    const command =
      action === "FORCE_OFF" ? "BOKCHOY_OFF" :
      action === "AUTO" ? "BOKCHOY_AUTO" :
      null;

    if (!command) {
      return res.status(400).json({ message: "Invalid action" });
    }

    sendToESP32(command);

    console.log(command);

    res.status(200).json({
      success: true,
      message: `Bokchoy valve set to "${action}"`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending command" });
  }
};



// ===== FORCE CLOSE / AUTO PECHAY VALVE =====
export const closePechayGroup = async (req, res) => {
  try {
    const action = req.body.action?.toUpperCase();

    const command =
      action === "FORCE_OFF" ? "PECHAY_OFF" :
      action === "AUTO" ? "PECHAY_AUTO" :
      null;

    if (!command) {
      return res.status(400).json({ message: "Invalid action" });
    }

    sendToESP32(command);

    console.log(command);

    res.status(200).json({
      success: true,
      message: `Pechay valve set to "${action}"`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending command" });
  }
};



// ===== FORCE CLOSE / AUTO MUSTASA VALVE =====
export const closeMustasaGroup = async (req, res) => {
  try {
    const action = req.body.action?.toUpperCase();

    const command =
      action === "FORCE_OFF" ? "MUSTASA_OFF" :
      action === "AUTO" ? "MUSTASA_AUTO" :
      null;

    if (!command) {
      return res.status(400).json({ message: "Invalid action" });
    }

    sendToESP32(command);

    console.log(command);

    res.status(200).json({
      success: true,
      message: `Mustasa valve set to "${action}"`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending command" });
  }
};






// ===== FORCE CLOSE / AUTO ALL VALVES =====
export const closeAllGroups = async (req, res) => {
  try {
    const action = req.body.action?.toUpperCase();

    if (action !== "FORCE_OFF" && action !== "AUTO") {
      return res.status(400).json({ message: "Invalid action" });
    }

    const suffix = action === "FORCE_OFF" ? "OFF" : "AUTO";

    const commands = [
      `BOKCHOY_${suffix}`,
      `PECHAY_${suffix}`,
      `MUSTASA_${suffix}`
    ];

    commands.forEach(command => sendToESP32(command));

    console.log(commands);

    res.status(200).json({
      success: true,
      message: `All valves set to "${action}"`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending command to ESP32" });
  }
};
