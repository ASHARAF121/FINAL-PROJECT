import { useState } from "react";
import api from "../../api/api";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Availability = () => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [timeSlots, setTimeSlots] = useState([
    { day: "Monday", from: "09:00", to: "12:00" },
  ]);

  const [serviceArea, setServiceArea] = useState("");

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  const addSlot = () => {
    setTimeSlots((prev) => [
      ...prev,
      { day: "Monday", from: "09:00", to: "12:00" },
    ]);
  };

  const updateSlot = (index, field, value) => {
    const updated = [...timeSlots];
    updated[index][field] = value;
    setTimeSlots(updated);
  };

  const removeSlot = (index) => {
    setTimeSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!serviceArea || selectedDays.length === 0 || timeSlots.length === 0) {
      alert("Please fill in all required fields");
      return;
    }

    const payload = {
      serviceArea,
      selectedDays,
      timeSlots,
    };

    try {
      const token = localStorage.getItem("token");
      await api.post("/provider/availability", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Availability saved successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save availability");
      console.error("Error:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Set Availability
      </h1>

      <div className="bg-white p-6 rounded-lg shadow">
        {/* Service Area */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Service Area
          </label>
          <input
            type="text"
            value={serviceArea}
            onChange={(e) => setServiceArea(e.target.value)}
            placeholder="Enter city or area (e.g. New York)"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Days Selection */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Select Working Days</h2>
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`px-3 py-1 rounded border ${
                  selectedDays.includes(day)
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Time Slots</h2>

          {timeSlots.map((slot, index) => (
            <div
              key={index}
              className="flex items-center gap-2 mb-3"
            >
              <select
                value={slot.day}
                onChange={(e) =>
                  updateSlot(index, "day", e.target.value)
                }
                className="p-2 border rounded"
              >
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>

              <input
                type="time"
                value={slot.from}
                onChange={(e) =>
                  updateSlot(index, "from", e.target.value)
                }
                className="p-2 border rounded"
              />

              <input
                type="time"
                value={slot.to}
                onChange={(e) =>
                  updateSlot(index, "to", e.target.value)
                }
                className="p-2 border rounded"
              />

              <button
                onClick={() => removeSlot(index)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            onClick={addSlot}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            + Add Slot
          </button>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save Availability
        </button>
      </div>
    </div>
  );
};

export default Availability;
