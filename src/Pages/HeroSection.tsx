import React from 'react';
import { Link } from 'react-router-dom';
import hero from '../assets/heros.png';
import logo from '../assets/logobg.png';

const HeroSection = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Image */}
      <div className="md:w-1/3 w-full">
        <img
          src={hero}
          alt="DBConcept Illustration"
          className="w-full h-full object-cover"
          style={{ maxHeight: '100vh' }}
        />
      </div>

      {/* Right Content */}
      <div className="md:w-2/3 w-full flex flex-col justify-center p-8 md:p-16 space-y-6">
        {/* Logo + Icon */}
        <div className="flex items-center space-x-4">
          <img
            src={logo}
            alt="DBConcept Logo"
            style={{ width: '50px', height: '50px' }}
          />
        <h1 className="text-lg font-bold text-gray-700 tracking-wide">DBConcept</h1>
        </div>

        {/* Heading */}
        <h1 className="text-5xl font-bold text-gray-800 leading-tight">
          Créez vos modèles de données <br />
          <span className="text-blue-600">automatiquement avec l'IA</span>
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-lg leading-relaxed">
          DBConcept vous aide à générer des MCD (Modèles Conceptuels de Données) à partir de simples
          descriptions textuelles. Plus besoin de dessiner manuellement, laissez l’intelligence
          artificielle structurer votre base de données.
        </p>

        {/* Highlight */}
        <p className="text-purple-600 font-semibold text-md">Commencez à concevoir votre MCD en quelques clics !</p>

        {/* Buttons */}
        <div className="flex space-x-4 pt-4">
          <Link to="/login">
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg shadow hover:opacity-90 transition">
              Démarrer
            </button>
          </Link>
          <button className="border border-blue-500 text-blue-500 px-6 py-3 rounded-lg hover:bg-blue-50 transition">
            En savoir plus
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
