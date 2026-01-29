import { clients } from "../app.js"; // Make sure this points to the shared clients array


// Utility to send a command to all connected ESP32 clients
const sendToESP32 = (command) => {
  clients.forEach(client => {
    if (client.connected) {
      client.sendUTF(command);
    }
  });
};


// ===== OPEN BOKCHOY VALVE =====
export const waterBokchoyGroup = async (req, res) => {
  try {
    const action = req.body.action?.toUpperCase(); // "ON" or "OFF"

    const command =
      action === "ON" ? "BOKCHOY_ON" :
      action === "OFF" ? "BOKCHOY_OFF" :
      null;

    if (!command) {
      return res.status(400).json({ message: "Invalid action" });
    }

    sendToESP32(command);

    res.status(200).json({
      success: true,
      message: `Bokchoy valve command "${command}" sent`
    });
    console.log(command)

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending command" });
  }
};



// ===== OPEN PECHAY VALVE =====
export const waterPechayGroup = async (req, res) => {
  try {
    const action = req.body.action?.toUpperCase();

    const command =
      action === "ON" ? "PECHAY_ON" :
      action === "OFF" ? "PECHAY_OFF" :
      null;

    if (!command) {
      return res.status(400).json({ message: "Invalid action" });
    }

    sendToESP32(command);

    res.status(200).json({
      success: true,
      message: `Pechay valve command "${command}" sent`
    });

    console.log(command)


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending command" });
  }
};



// ===== OPEN MUSTASA VALVE =====
export const waterMustasaGroup = async (req, res) => {
  try {
    const action = req.body.action?.toUpperCase();

    const command =
      action === "ON" ? "MUSTASA_ON" :
      action === "OFF" ? "MUSTASA_OFF" :
      null;

    if (!command) {
      return res.status(400).json({ message: "Invalid action" });
    }

    sendToESP32(command);

    res.status(200).json({
      success: true,
      message: `Mustasa valve command "${command}" sent`
    });
    console.log(command)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending command" });
  }
};






// ===== OPEN ALL VALVES =====
export const waterAllGroups = async (req, res) => {
  try {
    const action = req.body.action?.toUpperCase();

    // Validate action
    if (action !== "ON" && action !== "OFF") {
      return res.status(400).json({ message: "Invalid action" });
    }

    // Build commands for all valves
    const commands = [
      `BOKCHOY_${action}`,
      `PECHAY_${action}`,
      `MUSTASA_${action}`
    ];

    // Send each command to ESP32
    commands.forEach(command => sendToESP32(command));

    res.status(200).json({
      success: true,
      message: `All valves "${action}" command sent`
    });  
    console.log(commands)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending command to ESP32" });
  }
};
