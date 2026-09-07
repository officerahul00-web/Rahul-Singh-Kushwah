import React, { useState } from 'react';
import {
  Code2,
  Database,
  Layers,
  Cpu,
  Download,
  Copy,
  Check,
  FileCode,
  BookOpen,
  Terminal,
  Shield,
  Smartphone,
  Server
} from 'lucide-react';
import { FLUTTER_CODE_FILES, FlutterCodeFile } from '../../data/flutterCode';
import {
  SYSTEM_ARCHITECTURE,
  FIRESTORE_SCHEMA,
  FIRESTORE_RULES,
  CLOUD_FUNCTIONS_CODE,
  DEPLOYMENT_GUIDE
} from '../../data/backendCode';

type DocSection = 'ARCHITECTURE' | 'SCHEMA' | 'FUNCTIONS' | 'FLUTTER_CODE' | 'DEPLOYMENT';

export const ArchitectureViewer: React.FC = () => {
  const [activeSection, setActiveSection] = useState<DocSection>('ARCHITECTURE');
  const [selectedFlutterFile, setSelectedFlutterFile] = useState<FlutterCodeFile>(FLUTTER_CODE_FILES[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.split('/').pop() || 'code.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 text-neutral-100 flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-white font-['Mukta']">
              आर्किटेक्चर, स्कीमा व प्रोडक्शन कोड हब
            </h2>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Enterprise Clean Architecture, Firestore NoSQL Indexing, Node.js v2 Cloud Functions & Production Flutter Code
          </p>
        </div>

        {/* Section Pill Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-neutral-950 p-1.5 rounded-2xl border border-neutral-800">
          <button
            id="doc-tab-architecture"
            onClick={() => setActiveSection('ARCHITECTURE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'ARCHITECTURE' ? 'bg-rose-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>सिस्टम आर्किटेक्चर</span>
          </button>

          <button
            id="doc-tab-schema"
            onClick={() => setActiveSection('SCHEMA')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'SCHEMA' ? 'bg-rose-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>डेटाबेस स्कीमा व रूल्स</span>
          </button>

          <button
            id="doc-tab-functions"
            onClick={() => setActiveSection('FUNCTIONS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'FUNCTIONS' ? 'bg-rose-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>क्लाउड फंक्शन्स (FCM)</span>
          </button>

          <button
            id="doc-tab-flutter"
            onClick={() => setActiveSection('FLUTTER_CODE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'FLUTTER_CODE' ? 'bg-rose-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>फ्लटर कोडबेस</span>
          </button>

          <button
            id="doc-tab-deployment"
            onClick={() => setActiveSection('DEPLOYMENT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'DEPLOYMENT' ? 'bg-rose-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>प्ले स्टोर डिप्लॉयमेंट</span>
          </button>
        </div>
      </div>

      {/* 1. SYSTEM ARCHITECTURE VIEW */}
      {activeSection === 'ARCHITECTURE' && (
        <div className="bg-neutral-900 rounded-3xl border border-neutral-800 p-6 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-200 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-rose-500" />
              <span>हाई-लेवल सिस्टम आर्किटेक्चर डायग्राम (Enterprise Tier)</span>
            </h3>
            <button
              onClick={() => handleCopy(SYSTEM_ARCHITECTURE, 'arch_copy')}
              className="py-1 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-neutral-300"
            >
              {copiedId === 'arch_copy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>डायग्राम कॉपी करें</span>
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono text-[11px] sm:text-xs overflow-x-auto leading-relaxed">
            {SYSTEM_ARCHITECTURE}
          </pre>

          {/* Architectural highlights cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="p-4 rounded-2xl bg-neutral-800/60 border border-neutral-700">
              <h4 className="text-xs font-bold text-rose-400 mb-1">अति-निम्न बैंडविड्थ अनुकूलन (Low Bandwidth)</h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                ग्रामीण एवं दूरदराज के क्षेत्रों के लिए कम्प्रेस्ड NoSQL पेलोड, स्थानीय ऑफ़लाइन कैशिंग और न्यूनतम नेटवर्क कॉल्स।
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-800/60 border border-neutral-700">
              <h4 className="text-xs font-bold text-emerald-400 mb-1">DPDP 2023 गोपनीयता (Data Protection)</h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                महिला दाताओं के लिए मास्क्ड कॉलिंग (Masked Phone Numbers), डेटा सहमति चेकबॉक्स और राइट-टू-डिलीट प्रोटोकॉल।
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-800/60 border border-neutral-700">
              <h4 className="text-xs font-bold text-amber-400 mb-1">तात्कालिक FCM सायरन अलर्ट (SOS Sirens)</h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                क्रिटिकल प्रायोरिटी चैनल के साथ आपातकालीन घंटी व सायरन जो साइलेंट मोड में भी दाताओं को जगाने में सक्षम है।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. FIRESTORE SCHEMA & RULES */}
      {activeSection === 'SCHEMA' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Schema */}
          <div className="bg-neutral-900 rounded-3xl border border-neutral-800 p-5 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-200 flex items-center gap-2">
                <Database className="w-4 h-4 text-rose-500" />
                <span>कलेक्शन्स, फील्ड्स व कम्पोजिट इंडेक्स</span>
              </h3>
              <button
                onClick={() => handleCopy(FIRESTORE_SCHEMA, 'schema_copy')}
                className="py-1 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold flex items-center gap-1 cursor-pointer text-neutral-300"
              >
                {copiedId === 'schema_copy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>कॉपी</span>
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed">
              {FIRESTORE_SCHEMA}
            </pre>
          </div>

          {/* Security Rules */}
          <div className="bg-neutral-900 rounded-3xl border border-neutral-800 p-5 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-200 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>firestore.rules (DPDP सुरक्षा व RBAC)</span>
              </h3>
              <button
                onClick={() => handleCopy(FIRESTORE_RULES, 'rules_copy')}
                className="py-1 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold flex items-center gap-1 cursor-pointer text-neutral-300"
              >
                {copiedId === 'rules_copy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>कॉपी</span>
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-emerald-300 font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed">
              {FIRESTORE_RULES}
            </pre>
          </div>
        </div>
      )}

      {/* 3. CLOUD FUNCTIONS */}
      {activeSection === 'FUNCTIONS' && (
        <div className="bg-neutral-900 rounded-3xl border border-neutral-800 p-6 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-200 flex items-center gap-2">
                <Server className="w-4 h-4 text-rose-500" />
                <span>Firebase Cloud Functions v2 (Node.js 20) — SOS Push Engine</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Real-time trigger on SOS creation, district matching, and FCM multicast broadcast
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(CLOUD_FUNCTIONS_CODE, 'functions_copy')}
                className="py-1.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-neutral-300"
              >
                {copiedId === 'functions_copy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>कोड कॉपी करें</span>
              </button>
              <button
                onClick={() => handleDownload('functions_index.js', CLOUD_FUNCTIONS_CODE)}
                className="py-1.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-neutral-300"
              >
                <Download className="w-3.5 h-3.5" />
                <span>डाउनलोड</span>
              </button>
            </div>
          </div>

          <pre className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-neutral-200 font-mono text-xs overflow-x-auto max-h-[600px] leading-relaxed">
            {CLOUD_FUNCTIONS_CODE}
          </pre>
        </div>
      )}

      {/* 4. PRODUCTION FLUTTER CLEAN CODE EXPLORER */}
      {activeSection === 'FLUTTER_CODE' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File Tree Explorer Sidebar */}
          <div className="bg-neutral-900 rounded-3xl border border-neutral-800 p-4 shadow-xl flex flex-col gap-2">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-2 mb-2">
              Flutter Clean Architecture Files
            </h4>

            {FLUTTER_CODE_FILES.map(file => (
              <button
                key={file.path}
                onClick={() => setSelectedFlutterFile(file)}
                className={`w-full text-left p-3 rounded-xl text-xs font-mono transition-all cursor-pointer flex flex-col gap-1 ${
                  selectedFlutterFile.path === file.path
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-neutral-850 hover:bg-neutral-800 text-neutral-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileCode className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-bold truncate">{file.path}</span>
                </div>
                <span className={`text-[10px] truncate ${
                  selectedFlutterFile.path === file.path ? 'text-rose-100' : 'text-neutral-500'
                }`}>
                  {file.description}
                </span>
              </button>
            ))}
          </div>

          {/* Code Viewer */}
          <div className="lg:col-span-2 bg-neutral-900 rounded-3xl border border-neutral-800 p-5 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-rose-400 block">{selectedFlutterFile.path}</span>
                <span className="text-[11px] text-neutral-400">{selectedFlutterFile.description}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(selectedFlutterFile.code, selectedFlutterFile.path)}
                  className="py-1 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold flex items-center gap-1 cursor-pointer text-neutral-300"
                >
                  {copiedId === selectedFlutterFile.path ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>कॉपी</span>
                </button>
                <button
                  onClick={() => handleDownload(selectedFlutterFile.path, selectedFlutterFile.code)}
                  className="py-1 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold flex items-center gap-1 cursor-pointer text-neutral-300"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>डाउनलोड</span>
                </button>
              </div>
            </div>

            <pre className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-neutral-200 font-mono text-xs overflow-x-auto max-h-[600px] leading-relaxed">
              {selectedFlutterFile.code}
            </pre>
          </div>
        </div>
      )}

      {/* 5. PLAY STORE DEPLOYMENT GUIDE */}
      {activeSection === 'DEPLOYMENT' && (
        <div className="bg-neutral-900 rounded-3xl border border-neutral-800 p-6 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-200 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-rose-500" />
              <span>Google Play Store एवं Firebase Production Deployment Guide</span>
            </h3>
            <button
              onClick={() => handleCopy(DEPLOYMENT_GUIDE, 'guide_copy')}
              className="py-1 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold flex items-center gap-1 cursor-pointer text-neutral-300"
            >
              {copiedId === 'guide_copy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>गाइड कॉपी करें</span>
            </button>
          </div>

          <pre className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono text-xs overflow-x-auto leading-relaxed whitespace-pre-wrap">
            {DEPLOYMENT_GUIDE}
          </pre>
        </div>
      )}

    </div>
  );
};
