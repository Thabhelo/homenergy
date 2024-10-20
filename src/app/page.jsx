"use client";
import React from "react";
import { useState } from 'react';
import * as Recharts from "recharts";
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"/>;


function MainComponent() {
  const [activeRoom, setActiveRoom] = React.useState("Kitchen");
  const [devices, setDevices] = React.useState({
    "Air Conditioner": false,
    "Smart TV": true,
    "Coffee Machine": false,
    Refrigerator: true,
  });
  const [energyData, setEnergyData] = React.useState([
    { name: "Mon", usage: 12 },
    { name: "Tue", usage: 19 },
    { name: "Wed", usage: 3 },
    { name: "Thu", usage: 5 },
    { name: "Fri", usage: 2 },
    { name: "Sat", usage: 3 },
    { name: "Sun", usage: 7 },
  ]);
  const [humidityData, setHumidityData] = React.useState([
    { name: "Jan", humidity: 65 },
    { name: "Feb", humidity: 59 },
    { name: "Mar", humidity: 80 },
    { name: "Apr", humidity: 81 },
    { name: "May", humidity: 56 },
    { name: "Jun", humidity: 55 },
  ]);
  const rooms = [
    { name: "Kitchen", devices: 8, icon: "fa-utensils" },
    { name: "Living Room", devices: 12, icon: "fa-couch" },
    { name: "Bedroom", devices: 4, icon: "fa-bed" },
    { name: "Bathroom", devices: 3, icon: "fa-bath" },
  ];
  const members = [
    { name: "Jaquiline", access: "Full Access" },
    { name: "Sennorita", access: "Limited Access" },
    { name: "Firoz", access: "Full Access" },
  ];
  const history = [
    {
      device: "Air Conditioner",
      action: "Turned on",
      user: "Jaquiline",
      time: "03:20",
    },
    {
      device: "Refrigerator",
      action: "Turned on",
      user: "Firoz",
      time: "01:48",
    },
    {
      device: "Air Conditioner",
      action: "Turned off",
      user: "Jaquiline",
      time: "11:36",
    },
    {
      device: "Coffee Machine",
      action: "Turned off",
      user: "Jaquiline",
      time: "09:15",
    },
  ];
  const toggleDevice = (device) => {
    setDevices((prev) => ({ ...prev, [device]: !prev[device] }));
  };
  const [activePage, setActivePage] = React.useState("Home");
  const navigateTo = (page) => {
    setActivePage(page);
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const [showAddMemberModal, setShowAddMemberModal] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [imageData, setImageData] = React.useState(null);
  const [visionAnalysis, setVisionAnalysis] = React.useState(null);
  const [showCamera, setShowCamera] = React.useState(false);
  const [subPages, setSubPages] = React.useState([
    { name: "Energy Usage", icon: "fa-bolt" },
    { name: "Device Control", icon: "fa-sliders-h" },
    { name: "Automation", icon: "fa-magic" },
    { name: "Settings", icon: "fa-cog" },
  ]);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageData(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!imageData) return;

    const response = await fetch("/integrations/gpt-vision/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this image and identify any lights or appliances that are on unnecessarily or wasting energy. Provide specific recommendations for energy savings.",
              },
              {
                type: "image_url",
                image_url: {
                  url: imageData,
                },
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    setVisionAnalysis(data.choices[0].message.content);
  };

  const toggleCamera = () => {
    setShowCamera(!showCamera);
  };

  const goToHome = () => {
    navigateTo("Home");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#F0F8FF] text-gray-800 font-roboto">
      {isMobile ? (
        <div className="flex flex-col h-screen">
          <header className="bg-white p-4 shadow-md">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold">Smart Home</h1>
              <button onClick={toggleMobileMenu}>
                <i className="fas fa-bars text-gray-600"></i>
              </button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4">
            {activePage === "Home" && (
              <>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {rooms.map((room) => (
                    <div
                      key={room.name}
                      className={`p-4 rounded-lg shadow-md ${
                        activeRoom === room.name
                          ? "bg-blue-500 text-white"
                          : "bg-white"
                      }`}
                      onClick={() => setActiveRoom(room.name)}
                    >
                      <i className={`fas ${room.icon} text-2xl mb-2`}></i>
                      <h3 className="font-semibold">{room.name}</h3>
                      <p className="text-sm">{room.devices} Devices</p>
                    </div>
                  ))}
                </div>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">
                    Welcome to Your Smart Home
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Manage your devices, monitor energy usage, and get
                    AI-powered recommendations for a smarter, more efficient
                    home.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-100 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Energy Saved</h3>
                      <p className="text-2xl font-bold">15%</p>
                      <p className="text-sm text-gray-600">This month</p>
                    </div>
                    <div className="bg-green-100 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Active Devices</h3>
                      <p className="text-2xl font-bold">8</p>
                      <p className="text-sm text-gray-600">Out of 12</p>
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Devices</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(devices).map(([device, isOn]) => (
                      <div
                        key={device}
                        className={`p-4 rounded-lg shadow-md ${
                          isOn ? "bg-blue-100" : "bg-white"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span
                            className={isOn ? "text-blue-500" : "text-gray-500"}
                          >
                            {isOn ? "On" : "Off"}
                          </span>
                          <button
                            onClick={() => toggleDevice(device)}
                            className={`w-10 h-5 rounded-full relative ${
                              isOn ? "bg-blue-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`absolute w-4 h-4 rounded-full bg-white transition-all ${
                                isOn ? "right-0.5" : "left-0.5"
                              } top-0.5`}
                            ></span>
                          </button>
                        </div>
                        <h3 className="font-semibold">{device}</h3>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Energy Usage</h2>
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                      <div className="w-full h-full" id="energy-chart"></div>
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <button
                    onClick={toggleCamera}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
                  >
                    Scan House with Camera
                  </button>
                  {showCamera && (
                    <div className="relative w-64 h-64 mx-auto mt-4">
                      <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-blue-500">
                        <video
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
            {activePage === "Insights" && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Insights</h2>
                <div className="space-y-4">
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Energy Usage</h3>
                    <p>Your energy usage has decreased by 15% this month.</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Cost Savings</h3>
                    <p>You've saved $30 on your electricity bill this month.</p>
                  </div>
                </div>
              </div>
            )}
            {activePage === "AI Recommendations" && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">
                  AI Recommendations
                </h2>
                <ul className="space-y-4">
                  <li className="bg-yellow-100 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Optimize AC Usage</h3>
                    <p>
                      Set your AC to 78°F (26°C) when you're home to save
                      energy.
                    </p>
                  </li>
                  <li className="bg-purple-100 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Smart Lighting</h3>
                    <p>
                      Install motion sensors in less-used areas to automatically
                      turn off lights.
                    </p>
                  </li>
                </ul>
              </div>
            )}
            {activePage === "Energy Usage" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Energy Usage</h2>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Daily Consumption
                  </h3>
                  <div className="h-64 bg-gray-100 rounded">
                    <div className="w-full h-full" id="energy-chart"></div>
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Energy Saving Tips
                  </h3>
                  <ul className="list-disc pl-5">
                    <li>Turn off lights when not in use</li>
                    <li>Use energy-efficient appliances</li>
                    <li>Adjust thermostat settings</li>
                    <li>Unplug devices when not in use</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Set Energy Goals
                  </h3>
                  <div className="flex items-center">
                    <input
                      type="number"
                      className="w-24 mr-2 px-2 py-1 border rounded"
                      placeholder="kWh"
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">
                      Set Goal
                    </button>
                  </div>
                </div>
              </div>
            )}
            {activePage === "Device Control" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Device Control</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(devices).map(([device, isOn]) => (
                    <div key={device} className="p-4 rounded-lg shadow border">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{device}</h3>
                        <button
                          onClick={() => toggleDevice(device)}
                          className={`w-12 h-6 rounded-full ${
                            isOn ? "bg-green-500" : "bg-gray-300"
                          } relative transition-colors duration-300 ease-in-out`}
                        >
                          <span
                            className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform duration-300 ease-in-out ${
                              isOn ? "right-0.5" : "left-0.5"
                            }`}
                          ></span>
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        Status: {isOn ? "On" : "Off"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activePage === "Automation" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Automation</h2>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Scheduled Actions
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center">
                      <span>Turn off lights at 11 PM</span>
                      <button className="text-red-500">
                        <i className="fas fa-trash"></i>
                      </button>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Turn on AC at 5 PM</span>
                      <button className="text-red-500">
                        <i className="fas fa-trash"></i>
                      </button>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Add New Automation
                  </h3>
                  <form className="space-y-2">
                    <select className="w-full px-2 py-1 border rounded">
                      <option>Select Device</option>
                      {Object.keys(devices).map((device) => (
                        <option key={device}>{device}</option>
                      ))}
                    </select>
                    <select className="w-full px-2 py-1 border rounded">
                      <option>Select Action</option>
                      <option>Turn On</option>
                      <option>Turn Off</option>
                    </select>
                    <input
                      type="time"
                      className="w-full px-2 py-1 border rounded"
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                      Add Automation
                    </button>
                  </form>
                </div>
              </div>
            )}
            {activePage === "Settings" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Settings</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Notifications
                    </h3>
                    <div className="flex items-center justify-between">
                      <span>Energy alerts</span>
                      <button className="w-12 h-6 rounded-full bg-green-500 relative">
                        <span className="absolute w-5 h-5 bg-white rounded-full right-0.5 top-0.5"></span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Theme</h3>
                    <select className="w-full px-2 py-1 border rounded">
                      <option>Light</option>
                      <option>Dark</option>
                    </select>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Language</h3>
                    <select className="w-full px-2 py-1 border rounded">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                    Save Settings
                  </button>
                </div>
              </div>
            )}
            {activePage === "Profile" && (
              <div className="bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-[calc(100vh-2rem)]">
                <h2 className="text-2xl font-semibold mb-4">Profile</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                      value="Thabhelo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                      value="thabhelo.duve@talladega.edu"
                    />
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    Save Changes
                  </button>
                </div>
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">
                    Energy Statistics
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-blue-100 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Total Energy Saved</h4>
                      <p className="text-2xl font-bold">245 kWh</p>
                    </div>
                    <div className="bg-green-100 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">
                        Carbon Footprint Reduced
                      </h4>
                      <p className="text-2xl font-bold">180 kg CO2</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">
                    Connected Devices
                  </h3>
                  <ul className="space-y-2">
                    {Object.entries(devices).map(([device, isOn]) => (
                      <li
                        key={device}
                        className="flex items-center justify-between"
                      >
                        <span>{device}</span>
                        <span
                          className={isOn ? "text-green-500" : "text-red-500"}
                        >
                          {isOn ? "Connected" : "Disconnected"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {activePage === "FAQs" && (
              <div className="bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-[calc(100vh-2rem)]">
                <h2 className="text-2xl font-semibold mb-4">FAQs</h2>
                <ul className="space-y-4">
                  <li>
                    <h3 className="font-semibold">
                      How do I add a new device?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Go to the Devices page and click on "Add New Device".
                      Follow the on-screen instructions.
                    </p>
                  </li>
                  <li>
                    <h3 className="font-semibold">
                      Can I control my devices when I'm away from home?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Yes, you can control your devices remotely using our
                      mobile app.
                    </p>
                  </li>
                  <li>
                    <h3 className="font-semibold">
                      How does the app help reduce energy costs?
                    </h3>
                    <p className="text-sm text-gray-600">
                      The app tracks your energy consumption and provides
                      insights and recommendations to reduce wastage. You can
                      adjust settings based on these recommendations to lower
                      your energy bills.
                    </p>
                  </li>
                  <li>
                    <h3 className="font-semibold">
                      Does the AI recommender analyze my usage patterns?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Yes, the AI analyzes your energy usage patterns over time
                      and suggests the best ways to optimize your energy
                      consumption.
                    </p>
                  </li>
                  <li>
                    <h3 className="font-semibold">
                      Can I receive notifications for excessive energy
                      consumption?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Yes, you can enable notifications to alert you when your
                      energy usage is unusually high or exceeds your set
                      threshold.
                    </p>
                  </li>
                </ul>
              </div>
            )}
            {activePage === "Contact" && (
              <div className="bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-[calc(100vh-2rem)]">
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                      rows="4"
                    ></textarea>
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-full">
                    Send Message
                  </button>
                </form>
              </div>
            )}
            {activePage === "Logout" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Logout</h2>
                <p>Are you sure you want to logout?</p>
                <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md w-full">
                  Confirm Logout
                </button>
              </div>
            )}
          </main>
          <nav className="bg-white shadow-md fixed bottom-0 left-0 right-0 z-50">
            <ul className="flex justify-around p-2">
              <li>
                <button
                  className={`p-2 rounded-full ${
                    activePage === "Home" ? "bg-blue-100 text-blue-500" : ""
                  }`}
                  onClick={() => navigateTo("Home")}
                >
                  <i className="fas fa-home"></i>
                </button>
              </li>
              <li>
                <button
                  className={`p-2 rounded-full ${
                    activePage === "Insights" ? "bg-blue-100 text-blue-500" : ""
                  }`}
                  onClick={() => navigateTo("Insights")}
                >
                  <i className="fas fa-chart-line"></i>
                </button>
              </li>
              <li>
                <button
                  className={`p-2 rounded-full ${
                    activePage === "AI Recommendations"
                      ? "bg-blue-100 text-blue-500"
                      : ""
                  }`}
                  onClick={() => navigateTo("AI Recommendations")}
                >
                  <i className="fas fa-lightbulb"></i>
                </button>
              </li>
              <li>
                <button
                  className={`p-2 rounded-full ${
                    activePage === "Profile" ? "bg-blue-100 text-blue-500" : ""
                  }`}
                  onClick={() => navigateTo("Profile")}
                >
                  <i className="fas fa-user"></i>
                </button>
              </li>
              {subPages.map((page) => (
                <li key={page.name}>
                  <button
                    className={`p-2 rounded-full ${
                      activePage === page.name
                        ? "bg-blue-100 text-blue-500"
                        : ""
                    }`}
                    onClick={() => navigateTo(page.name)}
                  >
                    <i className={`fas ${page.icon}`}></i>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : (
        <>
          <aside className="w-56 bg-white p-4 shadow-lg overflow-y-auto">
            <div className="flex items-center mb-8">
              <img
                src="profile.jpg"
                alt="User profile"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <p className="font-semibold">Hello 👋</p>
                <p>Thabhelo</p>
              </div>
            </div>
            <nav>
              <ul>
                <li className="mb-4">
                  <a
                    href="#"
                    className={`flex items-center ${
                      activePage === "Home" ? "text-blue-500" : ""
                    }`}
                    onClick={() => navigateTo("Home")}
                  >
                    <i className="fas fa-home mr-2"></i> Home
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="#"
                    className={`flex items-center ${
                      activePage === "Insights" ? "text-blue-500" : ""
                    }`}
                    onClick={() => navigateTo("Insights")}
                  >
                    <i className="fas fa-chart-line mr-2"></i> Insights
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="#"
                    className={`flex items-center ${
                      activePage === "AI Recommendations" ? "text-blue-500" : ""
                    }`}
                    onClick={() => navigateTo("AI Recommendations")}
                  >
                    <i className="fas fa-lightbulb mr-2"></i> AI Recommendations
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="#"
                    className={`flex items-center ${
                      activePage === "Messages" ? "text-blue-500" : ""
                    }`}
                    onClick={() => navigateTo("Messages")}
                  >
                    <i className="fas fa-envelope mr-2"></i> Messages (2)
                  </a>
                </li>
                {subPages.map((page) => (
                  <li key={page.name} className="mb-4">
                    <a
                      href="#"
                      className={`flex items-center ${
                        activePage === page.name ? "text-blue-500" : ""
                      }`}
                      onClick={() => navigateTo(page.name)}
                    >
                      <i className={`fas ${page.icon} mr-2`}></i> {page.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-8">
              <h3 className="text-sm font-semibold mb-4">Settings</h3>
              <ul>
                <li className="mb-4">
                  <a
                    href="#"
                    className={`flex items-center ${
                      activePage === "Profile" ? "text-blue-500" : ""
                    }`}
                    onClick={() => navigateTo("Profile")}
                  >
                    <i className="fas fa-user mr-2"></i> Profile
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="#"
                    className={`flex items-center ${
                      activePage === "FAQs" ? "text-blue-500" : ""
                    }`}
                    onClick={() => navigateTo("FAQs")}
                  >
                    <i className="fas fa-question-circle mr-2"></i> FAQ's
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="#"
                    className={`flex items-center ${
                      activePage === "Contact" ? "text-blue-500" : ""
                    }`}
                    onClick={() => navigateTo("Contact")}
                  >
                    <i className="fas fa-phone mr-2"></i> Contact us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center"
                    onClick={() => navigateTo("Logout")}
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i> Logout
                  </a>
                </li>
              </ul>
            </div>
          </aside>
          <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            {activePage !== "Home" && (
              <button
                onClick={goToHome}
                className="mb-4 text-blue-500 hover:text-blue-700"
              >
                &larr; Back to Home
              </button>
            )}
            {activePage === "Home" && (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-2xl font-semibold mb-4 md:mb-0">Rooms</h1>
                  <div className="flex items-center w-full md:w-auto">
                    <input
                      type="text"
                      placeholder="Search anything here..."
                      className="px-4 py-2 rounded-lg border mr-4 w-full md:w-auto"
                    />
                    <div className="flex items-center">
                      <button className="bg-red-500 w-12 h-6 rounded-full relative mr-4">
                        <span className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full"></span>
                      </button>
                      <button className="mr-4">
                        <i className="fas fa-bell text-gray-500"></i>
                      </button>
                      <button>
                        <i className="fas fa-cog text-gray-500"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {rooms.map((room) => (
                    <div
                      key={room.name}
                      className={`p-4 rounded-lg shadow-md ${
                        activeRoom === room.name
                          ? "bg-blue-500 text-white"
                          : "bg-white"
                      }`}
                      onClick={() => setActiveRoom(room.name)}
                    >
                      <i className={`fas ${room.icon} text-2xl mb-2`}></i>
                      <h3 className="font-semibold">{room.name}</h3>
                      <p>{room.devices} Devices</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Levels</h2>
                  <a href="#" className="text-blue-500">
                    <i className="fas fa-chevron-right"></i>
                  </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <i className="fas fa-tint text-blue-500 mr-2"></i>
                        <h3 className="font-semibold">Humidity</h3>
                      </div>
                      <select className="text-sm">
                        <option>Today</option>
                        <option>Week</option>
                        <option>Month</option>
                        <option>Year</option>
                      </select>
                    </div>
                    <div className="h-40">
                      <Recharts.ResponsiveContainer width="100%" height="100%">
                        <Recharts.LineChart data={humidityData}>
                          <Recharts.CartesianGrid strokeDasharray="3 3" />
                          <Recharts.XAxis dataKey="name" />
                          <Recharts.YAxis />
                          <Recharts.Tooltip />
                          <Recharts.Line
                            type="monotone"
                            dataKey="humidity"
                            stroke="#8884d8"
                          />
                        </Recharts.LineChart>
                      </Recharts.ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <i className="fas fa-bolt text-purple-500 mr-2"></i>
                        <h3 className="font-semibold">Energy</h3>
                      </div>
                      <select className="text-sm">
                        <option>Day</option>
                        <option>Week</option>
                        <option>Month</option>
                        <option>Year</option>
                      </select>
                    </div>
                    <div className="h-40">
                      <Recharts.ResponsiveContainer width="100%" height="100%">
                        <Recharts.BarChart data={energyData}>
                          <Recharts.CartesianGrid strokeDasharray="3 3" />
                          <Recharts.XAxis dataKey="name" />
                          <Recharts.YAxis />
                          <Recharts.Tooltip />
                          <Recharts.Bar dataKey="usage" fill="#8884d8" />
                        </Recharts.BarChart>
                      </Recharts.ResponsiveContainer>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Devices</h2>
                  <a href="#" className="text-blue-500">
                    <i className="fas fa-chevron-right"></i>
                  </a>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {Object.entries(devices).map(([device, isOn]) => (
                    <div
                      key={device}
                      className={`p-4 rounded-lg shadow-md ${
                        isOn ? "bg-blue-100" : "bg-white"
                      } cursor-pointer`}
                      onClick={() => navigateTo(device)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span
                          className={isOn ? "text-blue-500" : "text-gray-500"}
                        >
                          {isOn ? "On" : "Off"}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDevice(device);
                          }}
                          className={`w-10 h-5 rounded-full relative ${
                            isOn ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`absolute w-4 h-4 rounded-full bg-white transition-all ${
                              isOn ? "right-0.5" : "left-0.5"
                            } top-0.5`}
                          ></span>
                        </button>
                      </div>
                      <i
                        className={`fas fa-${device
                          .toLowerCase()
                          .replace(" ", "-")} text-2xl mb-2 ${
                          isOn ? "text-blue-500" : "text-gray-500"
                        }`}
                      ></i>
                      <h3 className="font-semibold">{device}</h3>
                    </div>
                  ))}
                </div>
                <div className="mb-8">
                  <button
                    onClick={toggleCamera}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
                  >
                    {showCamera ? "Hide Camera" : "Show Camera"}
                  </button>
                  {showCamera && (
                    <div className="relative w-64 h-64 mx-auto">
                      <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-blue-500">
                        <video
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
            {activePage === "Insights" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Energy Usage</h3>
                    <p>Your energy usage has decreased by 15% this month.</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Cost Savings</h3>
                    <p>You've saved $30 on your electricity bill this month.</p>
                  </div>
                </div>
              </div>
            )}
            {activePage === "AI Recommendations" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">
                  AI Recommendations
                </h2>
                <ul className="space-y-4">
                  <li className="bg-yellow-100 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Optimize AC Usage</h3>
                    <p>
                      Set your AC to 78°F (26°C) when you're home to save
                      energy.
                    </p>
                  </li>
                  <li className="bg-purple-100 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Smart Lighting</h3>
                    <p>
                      Install motion sensors in less-used areas to automatically
                      turn off lights.
                    </p>
                  </li>
                </ul>
              </div>
            )}
            {activePage === "Messages" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Messages</h2>
                <ul className="space-y-4">
                  <li className="border-b pb-4">
                    <h3 className="font-semibold">System Update</h3>
                    <p className="text-sm text-gray-600">
                      A new firmware update is available for your smart
                      thermostat.
                    </p>
                  </li>
                  <li>
                    <h3 className="font-semibold">Energy Alert</h3>
                    <p className="text-sm text-gray-600">
                      Your energy usage is 20% higher than usual today.
                    </p>
                  </li>
                </ul>
              </div>
            )}
            {activePage === "Profile" && (
              <div className="bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-[calc(100vh-2rem)]">
                <h2 className="text-2xl font-semibold mb-4">Profile</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                      value="Thabhelo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                      value="thabhelo.duve@talladega.edu"
                    />
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    Save Changes
                  </button>
                </div>
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">
                    Energy Statistics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-100 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Total Energy Saved</h4>
                      <p className="text-2xl font-bold">245 kWh</p>
                    </div>
                    <div className="bg-green-100 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">
                        Carbon Footprint Reduced
                      </h4>
                      <p className="text-2xl font-bold">180 kg CO2</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">
                    Connected Devices
                  </h3>
                  <ul className="space-y-2">
                    {Object.entries(devices).map(([device, isOn]) => (
                      <li
                        key={device}
                        className="flex items-center justify-between"
                      >
                        <span>{device}</span>
                        <span
                          className={isOn ? "text-green-500" : "text-red-500"}
                        >
                          {isOn ? "Connected" : "Disconnected"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {activePage === "FAQs" && (
              <div className="bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-[calc(100vh-2rem)]">
                <h2 className="text-2xl font-semibold mb-4">FAQs</h2>
                <ul className="space-y-4">
                  <li>
                    <h3 className="font-semibold">
                      How do I add a new device?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Go to the Devices page and click on "Add New Device".
                      Follow the on-screen instructions.
                    </p>
                  </li>
                  <li>
                    <h3 className="font-semibold">
                      Can I control my devices when I'm away from home?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Yes, you can control your devices remotely using our
                      mobile app.
                    </p>
                  </li>
                  <li>
                    <h3 className="font-semibold">
                      How does the app help reduce energy costs?
                    </h3>
                    <p className="text-sm text-gray-600">
                      The app tracks your energy consumption and provides
                      insights and recommendations to reduce wastage. You can
                      adjust settings based on these recommendations to lower
                      your energy bills.
                    </p>
                  </li>
                  <li>
                    <h3 className="font-semibold">
                      Does the AI recommender analyze my usage patterns?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Yes, the AI analyzes your energy usage patterns over time
                      and suggests the best ways to optimize your energy
                      consumption.
                    </p>
                  </li>
                  <li>
                    <h3 className="font-semibold">
                      Can I receive notifications for excessive energy
                      consumption?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Yes, you can enable notifications to alert you when your
                      energy usage is unusually high or exceeds your set
                      threshold.
                    </p>
                  </li>
                  <li>
                    <h3 className="font-semibold">
                      Can I schedule when devices should be turned on or off?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Yes, you can schedule your devices to turn on or off at
                      specific times to align with your energy-saving goals.
                    </p>
                  </li>
                  <li>
                    <h3 className="font-semibold">
                      Does the app integrate with renewable energy sources?
                    </h3>
                    <p className="text-sm text-gray-600">
                      If you have solar panels or other renewable energy
                      sources, the app can track their production and help you
                      optimize energy use based on available green energy.
                    </p>
                  </li>
                  <li>
                    <h3 className="font-semibold">
                      Can the app detect faulty devices that consume too much
                      energy?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Yes, the app can flag devices that are consuming more
                      energy than usual, potentially indicating a malfunction or
                      inefficiency.
                    </p>
                  </li>
                  <li>
                    <h3 className="font-semibold">
                      Can I see real-time energy consumption data?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Yes, you can view real-time data on your energy usage
                      through the app's dashboard, helping you monitor
                      consumption at any moment.
                    </p>
                  </li>
                  <li>
                    <h3 className="font-semibold">
                      Can I customize my energy-saving goals?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Yes, the app allows you to set specific energy-saving
                      goals and provides tailored recommendations to help you
                      achieve them.
                    </p>
                  </li>
                </ul>
              </div>
            )}
            {activePage === "Contact" && (
              <div className="bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-[calc(100vh-2rem)]">
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                      rows="4"
                    ></textarea>
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    Send Message
                  </button>
                </form>
              </div>
            )}
            {activePage === "Logout" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Logout</h2>
                <p>Are you sure you want to logout?</p>
                <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md">
                  Confirm Logout
                </button>
              </div>
            )}
            {activePage === "Energy Usage" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Energy Usage</h2>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Daily Consumption
                  </h3>
                  <div className="h-64 bg-gray-100 rounded">
                    <div className="w-full h-full" id="energy-chart">
                    <div className="h-40">
                      <Recharts.ResponsiveContainer width="100%" height="100%">
                        <Recharts.BarChart data={energyData}>
                          <Recharts.CartesianGrid strokeDasharray="3 3" />
                          <Recharts.XAxis dataKey="name" />
                          <Recharts.YAxis />
                          <Recharts.Tooltip />
                          <Recharts.Bar dataKey="usage" fill="#8884d8" />
                        </Recharts.BarChart>
                      </Recharts.ResponsiveContainer>
                    </div>
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Energy Saving Tips
                  </h3>
                  <ul className="list-disc pl-5">
                    <li>Turn off lights when not in use</li>
                    <li>Use energy-efficient appliances</li>
                    <li>Adjust thermostat settings</li>
                    <li>Unplug devices when not in use</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Set Energy Goals
                  </h3>
                  <div className="flex items-center">
                    <input
                      type="number"
                      className="w-24 mr-2 px-2 py-1 border rounded"
                      placeholder="kWh"
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">
                      Set Goal
                    </button>
                  </div>
                </div>
              </div>
            )}
            {activePage === "Device Control" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Device Control</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(devices).map(([device, isOn]) => (
                    <div key={device} className="p-4 rounded-lg shadow border">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{device}</h3>
                        <button
                          onClick={() => toggleDevice(device)}
                          className={`w-12 h-6 rounded-full ${
                            isOn ? "bg-green-500" : "bg-gray-300"
                          } relative transition-colors duration-300 ease-in-out`}
                        >
                          <span
                            className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform duration-300 ease-in-out ${
                              isOn ? "right-0.5" : "left-0.5"
                            }`}
                          ></span>
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        Status: {isOn ? "On" : "Off"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activePage === "Automation" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Automation</h2>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Scheduled Actions
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center">
                      <span>Turn off lights at 11 PM</span>
                      <button className="text-red-500">
                        <i className="fas fa-trash"></i>
                      </button>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Turn on AC at 5 PM</span>
                      <button className="text-red-500">
                        <i className="fas fa-trash"></i>
                      </button>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Add New Automation
                  </h3>
                  <form className="space-y-2">
                    <select className="w-full px-2 py-1 border rounded">
                      <option>Select Device</option>
                      {Object.keys(devices).map((device) => (
                        <option key={device}>{device}</option>
                      ))}
                    </select>
                    <select className="w-full px-2 py-1 border rounded">
                      <option>Select Action</option>
                      <option>Turn On</option>
                      <option>Turn Off</option>
                    </select>
                    <input
                      type="time"
                      className="w-full px-2 py-1 border rounded"
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                      Add Automation
                    </button>
                  </form>
                </div>
              </div>
            )}
            {activePage === "Settings" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Settings</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Notifications
                    </h3>
                    <div className="flex items-center justify-between">
                      <span>Energy alerts</span>
                      <button className="w-12 h-6 rounded-full bg-green-500 relative">
                        <span className="absolute w-5 h-5 bg-white rounded-full right-0.5 top-0.5"></span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Theme</h3>
                    <select className="w-full px-2 py-1 border rounded">
                      <option>Light</option>
                      <option>Dark</option>
                    </select>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Language</h3>
                    <select className="w-full px-2 py-1 border rounded">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                    Save Settings
                  </button>
                </div>
              </div>
            )}
            {subPages.map((page) => (
              <div
                key={page.name}
                className={activePage === page.name ? "" : "hidden"}
              >
                <h2 className="text-2xl font-semibold mb-4">{page.name}</h2>
              </div>
            ))}
          </main>
          <aside className="w-72 bg-white p-6 shadow-lg overflow-y-auto">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Members</h2>
                <a href="#" className="text-blue-500 text-sm">
                  View all
                </a>
              </div>
              <ul className="space-y-4">
                {members.map((member) => (
                  <li key={member.name} className="flex items-center mb-4">
                    <img
                      src={`${member.name.toLowerCase()}.jpg`}
                      alt={member.name}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.access}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                className="w-full bg-blue-100 text-blue-500 py-2 rounded-lg mt-4"
                onClick={() => setShowAddMemberModal(true)}
              >
                Add Member
              </button>
            </div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">History</h2>
                <a href="#" className="text-blue-500 text-sm">
                  View all
                </a>
              </div>
              <ul>
                {history.map((item, index) => (
                  <li key={index} className="mb-4">
                    <div className="flex items-center">
                      <i
                        className={`fas fa-${item.device
                          .toLowerCase()
                          .replace(" ", "-")} text-green-500 mr-2`}
                      ></i>
                      <div>
                        <p className="font-semibold">{item.device}</p>
                        <p className="text-sm text-gray-500">
                          {item.action} • {item.user}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{item.time}</p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </>
      )}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="text-xl font-semibold mb-4">Add Member</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Access Level
                </label>
                <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
                  <option>Full Access</option>
                  <option>Limited Access</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="mr-2 px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainComponent;